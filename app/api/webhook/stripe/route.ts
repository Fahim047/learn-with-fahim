import db from "@/lib/db";
import { enrollments, user } from "@/lib/db/schema";
import env from "@/lib/env";
import { stripeClient } from "@/lib/stripe";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(req: Request) {
  // body is obtained via req.text(), which is correct for Stripe webhooks (raw payload).
  const body = await req.text();
  const headersList = await headers();

  const sig = headersList.get("Stripe-Signature");

  if (!sig) {
    return new Response("Webhook Error", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripeClient.webhooks.constructEvent(
      body,
      sig,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return new Response("Webhook Error", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const courseId = session.metadata?.courseId;
    const enrollmentId = session.metadata?.enrollmentId;
    const customerId = session.customer as string;

    if (!courseId || !customerId || !enrollmentId) {
      return new Response("Webhook Error", { status: 400 });
    }

    const usr = await db.query.user.findFirst({
      where: eq(user.stripeCustomerId, customerId),
    });

    if (!usr) {
      return new Response("User not found", { status: 404 });
    }

    await db
      .update(enrollments)
      .set({
        status: "active",
      })
      .where(eq(enrollments.id, enrollmentId));
  }

  return new Response("success", { status: 200 });
}
