import { MercadoPagoConfig, Payment } from 'mercadopago';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN,
    });

    const url = new URL(req.url);
    const type = url.searchParams.get('type') || url.searchParams.get('topic');
    const dataId = url.searchParams.get('data.id') || url.searchParams.get('id');

    if (type === 'payment' && dataId) {
      const payment = new Payment(client);
      const paymentInfo = await payment.get({ id: dataId });

      if (paymentInfo && paymentInfo.external_reference) {
        const orderId = paymentInfo.external_reference;
        const status = paymentInfo.status;

        let nuevoEstado = 'pendiente';
        if (status === 'approved') nuevoEstado = 'pagado';
        else if (status === 'rejected') nuevoEstado = 'rechazado';

        const { error } = await supabase
          .from('pedidos')
          .update({
            estado: nuevoEstado,
            mercadopago_id: String(dataId)
          })
          .eq('id', orderId);

        if (error) {
          console.error('Error actualizando pedido desde webhook:', error);
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Error en webhook de MP:', error);
    return NextResponse.json({ received: false, error: error.message }, { status: 500 });
  }
}
