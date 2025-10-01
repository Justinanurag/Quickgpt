import Transaction from "../models/Transaction.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const plans = [
  {
    _id: "basic",
    name: "Basic",
    price: 10,
    credits: 100,
    features: [
      "100 text generations",
      "50 image generations",
      "Standard support",
      "Access to basic models",
    ],
  },
  {
    _id: "pro",
    name: "Pro",
    price: 20,
    credits: 500,
    features: [
      "500 text generations",
      "200 image generations",
      "Priority support",
      "Access to pro models",
      "Faster response time",
    ],
  },
  {
    _id: "premium",
    name: "Premium",
    price: 30,
    credits: 1000,
    features: [
      "1000 text generations",
      "500 image generations",
      "24/7 VIP support",
      "Access to premium models",
      "Dedicated account manager",
    ],
  },
];

// API controller for getting all plans
export const getPlans = async (req, res) => {
  try {
    res.json({
      success: true,
      plans,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// API Controller for purchasing plans
export const purchasePlan = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.user._id;

    // validate planId first
    if (!planId) {
      return res.json({ success: false, message: "Invalid Plan ID" });
    }

    // find plan
    const plan = plans.find((plan) => plan._id === planId);
    if (!plan) {
      return res.json({ success: false, message: "Plan not found" });
    }

    // create new Transaction
    const transaction = await Transaction.create({
      userId: userId,
      planId: plan._id,
      amount: plan.price,
      credits: plan.credits,
      isPaid: false,
    });

    // create Razorpay order
    const options = {
      amount: plan.price * 100, // amount in paise (₹1 = 100)
      currency: "INR",
      receipt: `txn_${transaction._id}`,
      notes: {
        transactionId: transaction._id.toString(),
        planId: plan._id,
        userId: userId.toString(),
      },
    };

    const order = await razorpay.orders.create(options);

    return res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID, // frontend needs this
    });
  } catch (error) {
    console.error("Purchase Plan Error:", error.message);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// API Controller to verify Razorpay payment
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // ✅ Update Transaction as paid
      await Transaction.findOneAndUpdate(
        { "notes.transactionId": razorpay_order_id }, // or match by stored transaction
        { isPaid: true }
      );

      return res.json({ success: true, message: "Payment verified successfully" });
    } else {
      return res.json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Verify Payment Error:", error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
