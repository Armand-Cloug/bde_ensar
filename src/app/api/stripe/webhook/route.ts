// src/app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // évite toute staticisation de la route

// lazy init Stripe
let stripePromise: Promise<any> | null = null;
async function getStripe() {
  if (!stripePromise) {
    stripePromise = (async () => {
      const { default: Stripe } = await import("stripe");
      const key = process.env.STRIPE_SECRET_KEY;
      if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
      return new Stripe(key, { apiVersion: "2025-07-30.basil" });
    })();
  }
  return stripePromise;
}

// calcule le prochain 1er septembre (UTC) à partir d'une date
function nextSeptember1(from: Date) {
  const year = from.getUTCFullYear();
  const sept1 = new Date(Date.UTC(year, 8, 1, 0, 0, 0));
  return from.getTime() < sept1.getTime()
    ? sept1
    : new Date(Date.UTC(year + 1, 8, 1, 0, 0, 0));
}

async function activateAdhesion(userId: string) {
  const now = new Date();
  const end = nextSeptember1(now);
  await db.user.update({
    where: { id: String(userId) },
    data: {
      isAdherent: true,
      adhesionStart: now,
      adhesionEnd: end,
    },
  });
}

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await req.text();
  const stripe = await getStripe();

  let event: any; // typé par Stripe au runtime
  try {
    const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!whSecret) throw new Error("STRIPE_WEBHOOK_SECRET is not set");
    event = stripe.webhooks.constructEvent(body, sig, whSecret);
  } catch (err) {
    console.error("[STRIPE_WEBHOOK_SIGNATURE_ERROR]", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as {
          metadata?: { userId?: string };
          customer_email?: string;
        };

        const userId = session.metadata?.userId;
        if (userId) {
          await activateAdhesion(userId);
        } else if (session.customer_email) {
          const user = await db.user.findUnique({
            where: { email: session.customer_email },
            select: { id: true },
          });
          if (user) await activateAdhesion(user.id);
        }
        break;
      }
      default:
        // non géré
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("[STRIPE_WEBHOOK_HANDLER_ERROR]", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
