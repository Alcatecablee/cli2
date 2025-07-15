import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!,
);

// PayPal webhook signature verification
async function verifyPayPalWebhook(
  request: NextRequest,
  body: string,
): Promise<boolean> {
  try {
    // Get PayPal headers
    const authAlgo = request.headers.get("PAYPAL-AUTH-ALGO");
    const transmission_id = request.headers.get("PAYPAL-TRANSMISSION-ID");
    const cert_url = request.headers.get("PAYPAL-CERT-URL");
    const transmission_sig = request.headers.get("PAYPAL-TRANSMISSION-SIG");
    const transmission_time = request.headers.get("PAYPAL-TRANSMISSION-TIME");
    const webhook_id = process.env.PAYPAL_WEBHOOK_ID;

    // Validate required headers are present
    if (
      !authAlgo ||
      !transmission_id ||
      !cert_url ||
      !transmission_sig ||
      !transmission_time ||
      !webhook_id
    ) {
      console.error("Missing required PayPal webhook headers");
      return false;
    }

    // In development, allow bypassing verification if explicitly set
    if (
      process.env.NODE_ENV === "development" &&
      process.env.PAYPAL_WEBHOOK_VERIFY_DISABLED === "true"
    ) {
      console.warn("PayPal webhook verification disabled for development");
      return true;
    }

    // TODO: Implement full PayPal webhook signature verification
    // This requires:
    // 1. Fetching the PayPal certificate from cert_url
    // 2. Validating the certificate chain
    // 3. Verifying the signature using the certificate
    // 4. Checking transmission time to prevent replay attacks

    // For now, implement basic validation
    const expectedSig = crypto
      .createHmac("sha256", process.env.PAYPAL_WEBHOOK_SECRET || "")
      .update(`${webhook_id}|${transmission_time}|${body}`)
      .digest("base64");

    // This is a simplified verification - implement full verification for production
    return transmission_sig === expectedSig;
  } catch (error) {
    console.error("PayPal webhook verification error:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  let body: string;

  try {
    // Get raw body for signature verification
    body = await request.text();

    // Verify webhook signature
    const isValid = await verifyPayPalWebhook(request, body);
    if (!isValid) {
      console.error("PayPal webhook signature verification failed");
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 },
      );
    }

    // Parse the body after verification
    const webhookData = JSON.parse(body);
    const { event_type, resource } = webhookData;

    // Validate webhook data structure
    if (!event_type || !resource) {
      console.error("Invalid PayPal webhook data structure");
      return NextResponse.json(
        { error: "Invalid webhook data" },
        { status: 400 },
      );
    }

    console.log("PayPal webhook received:", event_type, resource?.id);

    // Add request logging for audit trail
    const logData = {
      event_type,
      resource_id: resource?.id,
      timestamp: new Date().toISOString(),
      ip: request.headers.get("x-forwarded-for") || "unknown",
    };

    // Store webhook event for audit (optional)
    await supabase
      .from("webhook_logs")
      .insert({
        provider: "paypal",
        event_type,
        data: logData,
        created_at: new Date().toISOString(),
      })
      .then(() => {})
      .catch((err) => {
        console.warn("Failed to log webhook event:", err.message);
      });

    switch (event_type) {
      case "BILLING.SUBSCRIPTION.ACTIVATED":
        await handleSubscriptionActivated(resource);
        break;

      case "BILLING.SUBSCRIPTION.CANCELLED":
        await handleSubscriptionCancelled(resource);
        break;

      case "BILLING.SUBSCRIPTION.SUSPENDED":
        await handleSubscriptionSuspended(resource);
        break;

      case "BILLING.SUBSCRIPTION.PAYMENT.COMPLETED":
        await handlePaymentCompleted(resource);
        break;

      case "BILLING.SUBSCRIPTION.PAYMENT.FAILED":
        await handlePaymentFailed(resource);
        break;

      default:
        console.log("Unhandled PayPal webhook event:", event_type);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PayPal webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}

async function handleSubscriptionActivated(resource: any) {
  try {
    const subscriptionId = resource.id;
    const payerId = resource.subscriber?.payer_id;

    // Find subscription by PayPal ID
    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select("*, profiles!subscriptions_user_id_fkey(*)")
      .eq("paypal_subscription_id", subscriptionId)
      .single();

    if (error || !subscription) {
      console.error("Subscription not found for PayPal ID:", subscriptionId);
      return;
    }

    // Update subscription status
    const { error: updateError } = await supabase
      .from("subscriptions")
      .update({
        status: "active",
        paypal_payer_id: payerId,
        updated_at: new Date().toISOString(),
      })
      .eq("paypal_subscription_id", subscriptionId);

    if (updateError) {
      console.error("Failed to update subscription:", updateError);
      return;
    }

    // Update user's plan
    await supabase
      .from("profiles")
      .update({
        plan: subscription.plan,
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscription.user_id);

    console.log(`Subscription activated for user ${subscription.user_id}`);
  } catch (error) {
    console.error("Error handling subscription activation:", error);
  }
}

async function handleSubscriptionCancelled(resource: any) {
  try {
    const subscriptionId = resource.id;

    // Update subscription status
    const { error: updateError } = await supabase
      .from("subscriptions")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("paypal_subscription_id", subscriptionId);

    if (updateError) {
      console.error("Failed to update cancelled subscription:", updateError);
      return;
    }

    // Get subscription to find user
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("user_id")
      .eq("paypal_subscription_id", subscriptionId)
      .single();

    if (subscription) {
      // Downgrade user to free plan
      await supabase
        .from("profiles")
        .update({
          plan: "free",
          updated_at: new Date().toISOString(),
        })
        .eq("id", subscription.user_id);

      console.log(`Subscription cancelled for user ${subscription.user_id}`);
    }
  } catch (error) {
    console.error("Error handling subscription cancellation:", error);
  }
}

async function handleSubscriptionSuspended(resource: any) {
  try {
    const subscriptionId = resource.id;

    // Update subscription status
    await supabase
      .from("subscriptions")
      .update({
        status: "suspended",
        updated_at: new Date().toISOString(),
      })
      .eq("paypal_subscription_id", subscriptionId);

    console.log(`Subscription suspended: ${subscriptionId}`);
  } catch (error) {
    console.error("Error handling subscription suspension:", error);
  }
}

async function handlePaymentCompleted(resource: any) {
  try {
    const subscriptionId = resource.billing_agreement_id;
    const amount = resource.amount?.total;

    // Log payment for analytics
    await supabase.from("payments").insert({
      paypal_payment_id: resource.id,
      paypal_subscription_id: subscriptionId,
      amount: parseFloat(amount || "0"),
      currency: resource.amount?.currency || "USD",
      status: "completed",
      created_at: new Date().toISOString(),
    });

    // Extend subscription if needed
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("paypal_subscription_id", subscriptionId)
      .single();

    if (subscription) {
      const newEndDate = new Date();
      newEndDate.setMonth(newEndDate.getMonth() + 1); // Extend by 1 month

      await supabase
        .from("subscriptions")
        .update({
          current_period_end: newEndDate.toISOString(),
          status: "active",
          updated_at: new Date().toISOString(),
        })
        .eq("paypal_subscription_id", subscriptionId);
    }

    console.log(`Payment completed for subscription: ${subscriptionId}`);
  } catch (error) {
    console.error("Error handling payment completion:", error);
  }
}

async function handlePaymentFailed(resource: any) {
  try {
    const subscriptionId = resource.billing_agreement_id;

    // Log failed payment
    await supabase.from("payments").insert({
      paypal_payment_id: resource.id,
      paypal_subscription_id: subscriptionId,
      amount: parseFloat(resource.amount?.total || "0"),
      currency: resource.amount?.currency || "USD",
      status: "failed",
      created_at: new Date().toISOString(),
    });

    // TODO: Implement retry logic or suspend subscription after multiple failures

    console.log(`Payment failed for subscription: ${subscriptionId}`);
  } catch (error) {
    console.error("Error handling payment failure:", error);
  }
}
