import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function OrderTracking() {
  const navigate = useNavigate();

  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchOrder = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setOrder(null);

    const cleanOrderId = orderId
      .trim()
      .replace(/^ZEVON-/i, "");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanOrderId || !cleanEmail) {
      setError("Please enter your Order ID and email.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .rpc("track_order", {
        p_order_id: cleanOrderId,
        p_email: cleanEmail,
      });

    if (error) {
      console.error(error);
      setError("Unable to find this order.");
      setLoading(false);
      return;
    }

    if (!data || data.length === 0) {
      setError("No order found. Please check your Order ID and email.");
      setLoading(false);
      return;
    }

    setOrder(data[0]);
    setLoading(false);
  };

  const statuses = [
    "pending",
    "confirmed",
    "shipped",
    "delivered",
  ];

  const currentStatus = order?.status?.toLowerCase();

  return (
    <div className="min-h-screen bg-white text-black px-6 py-12">
      <div className="max-w-2xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-10">
          <button
            onClick={() => navigate("/")}
            className="text-xs tracking-[0.4em] font-semibold"
          >
            ZEVON
          </button>

          <h1 className="text-4xl font-semibold mt-6">
            Track Your Order
          </h1>

          <p className="text-black/50 mt-3">
            Enter your Order ID and email to check your order status.
          </p>
        </div>

        {/* SEARCH FORM */}
        <form
          onSubmit={searchOrder}
          className="border border-black/10 p-6 md:p-8"
        >
          <label className="block text-sm font-medium mb-2">
            Order ID
          </label>

          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Example: ZEVON-xxxxxxxx"
            required
            className="w-full border border-black/20 px-4 py-3 outline-none focus:border-black"
          />

          <label className="block text-sm font-medium mb-2 mt-5">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your order email"
            required
            className="w-full border border-black/20 px-4 py-3 outline-none focus:border-black"
          />

          {error && (
            <p className="text-red-500 text-sm mt-4">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 mt-6 tracking-wide disabled:opacity-50"
          >
            {loading ? "SEARCHING..." : "TRACK ORDER →"}
          </button>
        </form>

        {/* ORDER RESULT */}
        {order && (
          <div className="mt-8">

            {/* ORDER INFO */}
            <div className="border border-black/10 p-6">
              <p className="text-xs uppercase tracking-widest text-black/40">
                Order ID
              </p>

              <p className="font-medium mt-2 break-all">
                ZEVON-{order.id}
              </p>

              <div className="mt-6">
                <p className="text-xs uppercase tracking-widest text-black/40">
                  Current Status
                </p>

                <p className="text-2xl font-semibold mt-2 capitalize">
                  {order.status}
                </p>
              </div>

              <div className="mt-6">
                <p className="text-xs uppercase tracking-widest text-black/40">
                  Estimated Delivery
                </p>

                <p className="font-semibold mt-2">
                  Within 7 days
                </p>
              </div>
            </div>

            {/* STATUS TIMELINE */}
            <div className="border border-black/10 p-6 mt-4">

              <p className="text-xs uppercase tracking-widest text-black/40 mb-6">
                Order Progress
              </p>

              {statuses.map((status, index) => {
                const currentIndex = statuses.indexOf(currentStatus);

                const completed =
                  currentIndex >= index;

                return (
                  <div
                    key={status}
                    className="flex items-center gap-4 mb-5 last:mb-0"
                  >
                    <div
                      className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm ${
                        completed
                          ? "bg-black text-white border-black"
                          : "border-black/20 text-black/30"
                      }`}
                    >
                      {completed ? "✓" : index + 1}
                    </div>

                    <p
                      className={`capitalize ${
                        completed
                          ? "font-medium"
                          : "text-black/30"
                      }`}
                    >
                      {status}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* CANCELLED */}
            {currentStatus === "cancelled" && (
              <div className="border border-red-200 bg-red-50 p-5 mt-4">
                <p className="font-semibold text-red-600">
                  Order Cancelled
                </p>

                <p className="text-sm text-red-500 mt-1">
                  This order has been cancelled.
                </p>
              </div>
            )}

            <button
              onClick={() => {
                setOrder(null);
                setOrderId("");
                setEmail("");
              }}
              className="w-full border border-black py-4 mt-6"
            >
              TRACK ANOTHER ORDER
            </button>
          </div>
        )}

        {/* BACK */}
        <button
          onClick={() => navigate("/shop")}
          className="block mx-auto mt-8 text-sm underline text-black/50 hover:text-black"
        >
          ← Back to Shop
        </button>

      </div>
    </div>
  );
}

export default OrderTracking;