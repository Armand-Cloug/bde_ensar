import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function getAmountCents(): number {
  // 15 € par défaut si non défini
  const raw = process.env.STRIPE_ADHESION_PRICE_CENTS ?? "1500";
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return 1500;
  return Math.trunc(n);
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: "Auth required" }, { status: 401 });
    }

    const amount = getAmountCents();

    const checkout = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: session.user.email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: amount,
            product_data: {
              name: "Adhésion BDE ENSAR",
              description: "Cotisation annuelle",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: String(session.user.id),
        purpose: "adhesion",
      },
      success_url: `${process.env.NEXTAUTH_URL}/adhesion?success=1`,
      cancel_url: `${process.env.NEXTAUTH_URL}/adhesion?canceled=1`,
    });

    return NextResponse.json({ url: checkout.url }, { status: 200 });
  } catch (err: any) {
    console.error("[STRIPE_CHECKOUT_ERROR]", err);
    return NextResponse.json(
      { error: "Unable to create checkout session" },
      { status: 500 }
    );
  }
}
