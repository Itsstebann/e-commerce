import { MercadoPagoConfig, Preference } from 'mercadopago';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Validar que las credenciales de MercadoPago estén configuradas
    if (!process.env.MP_ACCESS_TOKEN || process.env.MP_ACCESS_TOKEN === 'tu_access_token') {
      console.error('[Checkout] MP_ACCESS_TOKEN no está configurado en .env.local');
      return NextResponse.json(
        { error: 'Configuración de pagos incompleta. Contacta al administrador.' },
        { status: 500 }
      );
    }

    // Inicializar cliente dentro de la funcion para evitar errores en build
    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN,
      options: { timeout: 5000 }
    });

    const { items, customer, shippingCost, total } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // 1. Guardar el pedido en Supabase como "pendiente"
    const { data: order, error: orderError } = await supabase
      .from('pedidos')
      .insert([
        {
          cliente_nombre: customer.nombre,
          cliente_email: customer.email,
          cliente_telefono: customer.telefono,
          direccion_envio: {
            direccion: customer.direccion,
            ciudad: customer.ciudad,
            codigoPostal: customer.codigoPostal,
            notas: customer.notas
          },
          total: total,
          estado: 'pendiente'
        }
      ])
      .select()
      .single();

    if (orderError) {
      console.error('Error al guardar pedido en BD:', orderError);
    }

    const orderId = order ? order.id : `TEMP-${Date.now()}`;

    // Insertar items del pedido
    if (order) {
      const orderItems = items.map(item => ({
        pedido_id: order.id,
        producto_id: String(item.id).length > 20 ? item.id : null,
        nombre: item.nombre,
        cantidad: item.quantity,
        precio_unitario: item.precio_oferta || item.precio,
        subtotal: (item.precio_oferta || item.precio) * item.quantity
      }));
      
      await supabase.from('pedido_items').insert(orderItems);
    }

    // 2. Preparar los items para MercadoPago
    const mpItems = items.map(item => ({
      id: String(item.id),
      title: item.nombre,
      quantity: item.quantity,
      unit_price: Number(item.precio_oferta || item.precio),
      currency_id: 'MXN',
      picture_url: item.imagen_url || undefined,
    }));

    if (shippingCost > 0) {
      mpItems.push({
        id: 'envio',
        title: 'Costo de Envio',
        quantity: 1,
        unit_price: Number(shippingCost),
        currency_id: 'MXN',
      });
    }

    // 3. Crear la preferencia en MercadoPago
    const preference = new Preference(client);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const prefResult = await preference.create({
      body: {
        items: mpItems,
        payer: {
          name: customer.nombre,
          email: customer.email,
          phone: { number: customer.telefono },
          address: {
            street_name: customer.direccion,
            zip_code: customer.codigoPostal
          }
        },
        back_urls: {
          success: `${baseUrl}/checkout/success`,
          failure: `${baseUrl}/checkout/failure`,
          pending: `${baseUrl}/checkout/pending`
        },
        auto_return: 'approved',
        external_reference: orderId,
        notification_url: `${baseUrl}/api/webhooks/mercadopago`,
      }
    });

    // 4. Actualizar el pedido con el preference ID
    if (order) {
      await supabase
        .from('pedidos')
        .update({ mercadopago_preference_id: prefResult.id })
        .eq('id', order.id);
    }

    // El SDK v2 devuelve sandbox_init_point en modo test e init_point en produccion
    const redirectUrl = prefResult.init_point || prefResult.sandbox_init_point;

    if (!redirectUrl) {
      console.error('[Checkout] MercadoPago no devolvio init_point:', JSON.stringify(prefResult));
      return NextResponse.json(
        {
          error: 'MercadoPago no devolvio una URL de pago',
          detail: `Respuesta recibida: ${JSON.stringify(prefResult)}`,
          mpStatus: 200,
        },
        { status: 500 }
      );
    }

    console.log('[Checkout] Preferencia creada:', {
      id: prefResult.id,
      init_point: prefResult.init_point,
      sandbox_init_point: prefResult.sandbox_init_point,
      redirectUrl,
    });

    return NextResponse.json({
      id: prefResult.id,
      init_point: redirectUrl,
      orderId: orderId
    });

  } catch (error) {
    // Extraer el mensaje de error específico de MercadoPago
    const mpMessage = error?.cause?.[0]?.description
      || error?.message
      || 'Error desconocido';

    const mpStatus = error?.status || 500;

    console.error('[Checkout] Error MercadoPago:', {
      status: mpStatus,
      message: mpMessage,
      cause: JSON.stringify(error?.cause),
      raw: error,
    });

    return NextResponse.json(
      {
        error: 'Error al procesar el pago',
        detail: mpMessage,
        mpStatus,
      },
      { status: 500 }
    );
  }
}
