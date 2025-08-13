import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("[STRIPE_WEBHOOK_SIGNATURE_ERROR]", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      // Paiements cartes “synchro”
      case "checkout.session.completed":
      // Paiements asynchrones (ex SEPA) une fois confirmés
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Id utilisateur transmis en metadata depuis la création de la session
        const userId = session.metadata?.userId;

        // fallback de sécurité : si pas de metadata, tenter avec l'email
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
        // pour debug :
        // console.log("Unhandled event type:", event.type);
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("[STRIPE_WEBHOOK_HANDLER_ERROR]", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
