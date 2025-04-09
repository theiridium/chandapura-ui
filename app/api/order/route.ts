import Razorpay from 'razorpay';
import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic'

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY_ID!,
    key_secret: process.env.RAZORPAY_API_KEY_SECRET,
});

export async function POST(request: NextRequest) {
    const { amount, currency, receipt, notes } = (await request.json()) as {
        amount: string;
        currency: string;
        receipt: string;
        notes: {};
    };

    var options = {
        amount: amount,
        currency: currency,
        receipt: receipt,
        notes: notes
    };
    const order = await razorpay.orders.create(options);
    console.log(order);
    return NextResponse.json({ orderId: order.id }, { status: 200 });
}