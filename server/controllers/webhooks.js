import crypto from "crypto";
import Transaction from "../models/Transaction.js";
import UserActivation from "../models/UserActivation.js"; 

export const razorpayWebhooks = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEB_HOOKS; 

    // 🔹 Verify Razorpay signature
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    const signature = req.headers["x-razorpay-signature"];

    if (digest !== signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }

    const event = req.body.event;

    switch (event) {
      case "payment.captured": {
        const paymentEntity = req.body.payload.payment.entity;
        const { transactionId, appId } = paymentEntity.notes || {};

        if (appId === "quickgpt") {
          const transaction = await Transaction.findOne({
            _id: transactionId,
            isPaid: false,
          });

          if (!transaction) {
            return res.json({
              received: true,
              message: "Transaction not found or already paid",
            });
          }

          // ✅ Update user credits
          await UserActivation.updateOne(
            { _id: transaction.userId },
            { $inc: { credits: transaction.credits } }
          );

          // ✅ Mark transaction as paid
          transaction.isPaid = true;
          await transaction.save();

          console.log("💰 Payment success, credits updated for user:", transaction.userId);
        } else {
          return res.json({
            received: true,
            message: "Ignore Event: Invalid app",
          });
        }
        break;
      }

      default:
        console.log("Unhandled event type:", event);
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
