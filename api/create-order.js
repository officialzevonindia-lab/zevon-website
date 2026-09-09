import Razorpay from "razorpay";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { amount } = req.body;

    if (!amount || Number(amount) < 1) {
      return res.status(400).json({
        error: "Invalid amount",
      });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: `zevon_${Date.now()}`,
    });

    return res.status(200).json(order);
  } catch (error) {
    console.error("Razorpay create order error:", error);

    return res.status(500).json({
      error: "Unable to create Razorpay order",
    });
  }
}