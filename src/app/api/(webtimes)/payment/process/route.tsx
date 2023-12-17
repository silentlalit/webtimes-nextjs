import { NextRequest, NextResponse } from "next/server";
import { Stripe } from "stripe";
import { ErrorRes } from "../../../helper/ErrorRes";

export const POST = async (req: NextRequest, res: NextResponse) => {
  const stripeClient = new Stripe(`${process.env.STRIPE_SEC_KEY}`, {
    apiVersion: "2023-10-16",
  });

  try {
    const { token, description, amount } = await req.json();

    const paymentIntent = await stripeClient.paymentIntents.create({
      amount,
      currency: "inr",
      description,
      confirm: true,
      payment_method_data: {
        type: "card",
        card: {
          token: token,
        },
      },
      return_url: `${process.env.APP_URL}/services/order`,
    });

    return NextResponse.json(
      {
        success: true,
        client_secret: paymentIntent.client_secret,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error.message);
    return ErrorRes(false, error.message, 500);
  }
};
