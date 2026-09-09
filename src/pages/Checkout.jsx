import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function Checkout({ cart, setCart }) {
  const navigate = useNavigate();

  const [area, setArea] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  const subtotal = cart.reduce((sum, item) => {
    const price =
      typeof item.price === "number"
        ? item.price
        : Number(
            String(item.price)
              .replace("₹", "")
              .replace(/,/g, "")
          );

    return sum + price * item.quantity;
  }, 0);

  // Bhandup = FREE shipping
  // Other Mumbai areas = ₹50 shipping
  const isBhandup = area.trim().toLowerCase().includes("bhandup");

  const shipping = isBhandup ? 0 : 50;
  const total = subtotal + shipping;

  const cartCount = cart.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Load Razorpay Checkout script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  // Save order in Supabase
  const saveOrder = async (orderData) => {
    const { data, error } = await supabase
      .from("orders")
      .insert([orderData])
      .select();

    if (error) {
      console.error("ORDER SAVE ERROR:", error);
      console.error("Message:", error.message);
      console.error("Details:", error.details);
      console.error("Hint:", error.hint);
      console.error("Code:", error.code);

      alert(
        `Unable to place your order.\n\n${
          error.message || "Unknown Supabase error"
        }`
      );

      return null;
    }

    console.log("ORDER SAVED SUCCESSFULLY:", data);

    return data?.[0]?.id || null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!cart || cart.length === 0) {
      alert("Your cart is empty.");
      navigate("/shop");
      return;
    }

    if (processingPayment) {
      return;
    }

    const formData = new FormData(event.target);

    const fullName = formData.get("fullName")?.trim();
    const email = formData.get("email")?.trim();
    const phone = formData.get("phone")?.trim();
    const address = formData.get("address")?.trim();
    const customerArea = formData.get("area")?.trim();
    const city = formData.get("city")?.trim();
    const state = formData.get("state")?.trim();
    const pincode = formData.get("pincode")?.trim();
    const paymentMethod = formData.get("payment");

    // Check Mumbai
    if (!city || city.toLowerCase() !== "mumbai") {
      alert("Sorry, ZEVON currently delivers only within Mumbai.");
      return;
    }

    // Check Maharashtra
    if (!state || state.toLowerCase() !== "maharashtra") {
      alert(
        "Sorry, ZEVON currently delivers only within Mumbai, Maharashtra."
      );
      return;
    }

    // Check area
    if (!customerArea) {
      alert("Please enter your area/locality.");
      return;
    }

    const fullAddress = `${address}, ${customerArea}, ${city}, ${state} - ${pincode}`;

    const orderItems = cart.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    }));

    const orderData = {
      full_name: fullName,
      email: email,
      phone: phone,
      address: fullAddress,
      city: city,
      pincode: pincode,
      items: orderItems,
      total_amount: total,
      payment_method: paymentMethod,
      status: "pending",
    };

    // --------------------------------------------------
    // COD
    // --------------------------------------------------
    if (paymentMethod === "cod") {
      setProcessingPayment(true);

      const orderId = await saveOrder(orderData);

      setProcessingPayment(false);

      if (!orderId) {
        return;
      }

      setCart([]);
      navigate(`/order-success/${orderId}`);
      return;
    }

    // --------------------------------------------------
    // RAZORPAY ONLINE PAYMENT
    // --------------------------------------------------
    setProcessingPayment(true);

    try {
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        alert(
          "Unable to load Razorpay payment system. Please check your internet connection and try again."
        );
        setProcessingPayment(false);
        return;
      }

      // Razorpay amount is in paise
      const amountInPaise = Math.round(total * 100);

      // Create Razorpay order through Supabase Edge Function
      const { data: razorpayOrder, error: createOrderError } =
        await supabase.functions.invoke("razorpay-create-order", {
          body: {
            amount: amountInPaise,
            currency: "INR",
            receipt: `zevon_${Date.now()}`,
          },
        });

      if (createOrderError) {
        console.error(
          "RAZORPAY CREATE ORDER ERROR:",
          createOrderError
        );

        alert(
          "Unable to start payment. Please try again."
        );

        setProcessingPayment(false);
        return;
      }

      if (!razorpayOrder?.id) {
        console.error("Invalid Razorpay order:", razorpayOrder);

        alert(
          "Unable to create payment order. Please try again."
        );

        setProcessingPayment(false);
        return;
      }

      console.log(
        "Razorpay order created:",
        razorpayOrder
      );

      const razorpayOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: razorpayOrder.amount,

        currency: razorpayOrder.currency,

        name: "ZEVON",

        description: "ZEVON Order Payment",

        order_id: razorpayOrder.id,

        prefill: {
          name: fullName,
          email: email,
          contact: phone,
        },

        notes: {
          area: customerArea,
          city: city,
        },

        theme: {
          color: "#000000",
        },

        handler: async function (response) {
          try {
            console.log(
              "Razorpay payment response:",
              response
            );

            // Verify payment on the server
            const {
              data: verificationData,
              error: verificationError,
            } = await supabase.functions.invoke(
              "razorpay-verify-payment",
              {
                body: {
                  razorpay_order_id:
                    response.razorpay_order_id,

                  razorpay_payment_id:
                    response.razorpay_payment_id,

                  razorpay_signature:
                    response.razorpay_signature,
                },
              }
            );

            if (verificationError) {
              console.error(
                "PAYMENT VERIFICATION ERROR:",
                verificationError
              );

              alert(
                "Payment verification failed. Please contact ZEVON support before trying again."
              );

              setProcessingPayment(false);
              return;
            }

            if (!verificationData?.success) {
              console.error(
                "Payment verification failed:",
                verificationData
              );

              alert(
                "Payment could not be verified. Please contact ZEVON support."
              );

              setProcessingPayment(false);
              return;
            }

            console.log(
              "PAYMENT VERIFIED SUCCESSFULLY"
            );

            // Save verified order
            const paidOrderData = {
              ...orderData,
              payment_method: paymentMethod,
              status: "pending",
            };

            const orderId = await saveOrder(
              paidOrderData
            );

            if (!orderId) {
              setProcessingPayment(false);

              alert(
                "Payment was successful, but we could not save your order. Please contact ZEVON support."
              );

              return;
            }

            // Clear cart
            setCart([]);

            // Go to order success page
            navigate(`/order-success/${orderId}`);
          } catch (error) {
            console.error(
              "PAYMENT HANDLER ERROR:",
              error
            );

            alert(
              "Something went wrong after payment. Please contact ZEVON support."
            );

            setProcessingPayment(false);
          }
        },

        modal: {
          ondismiss: function () {
            console.log(
              "Razorpay payment window closed."
            );

            setProcessingPayment(false);
          },
        },
      };

      const razorpay = new window.Razorpay(
        razorpayOptions
      );

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "RAZORPAY PAYMENT FAILED:",
            response.error
          );

          alert(
            response?.error?.description ||
              "Payment failed. Please try again."
          );

          setProcessingPayment(false);
        }
      );

      razorpay.open();
    } catch (error) {
      console.error(
        "RAZORPAY ERROR:",
        error
      );

      alert(
        "Something went wrong while starting payment. Please try again."
      );

      setProcessingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-black/10">

        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          {/* LOGO */}
          <button
            type="button"
            onClick={() => {
              closeMobileMenu();
              navigate("/");
            }}
            className="text-2xl font-bold tracking-[0.3em]"
          >
            ZEVON
          </button>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden md:flex items-center gap-10 text-sm tracking-wide">

            <button
              type="button"
              onClick={() => navigate("/")}
              className="hover:opacity-50"
            >
              Home
            </button>

            <button
              type="button"
              onClick={() => navigate("/shop")}
              className="hover:opacity-50"
            >
              Shop
            </button>

            <button
              type="button"
              onClick={() => navigate("/track-order")}
              className="hover:opacity-50"
            >
              Track Order
            </button>

            <button
              type="button"
              onClick={() => navigate("/#categories")}
              className="hover:opacity-50"
            >
              Collections
            </button>

            <button
              type="button"
              onClick={() => navigate("/#about")}
              className="hover:opacity-50"
            >
              About
            </button>

          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-5">

            {/* MOBILE MENU BUTTON */}
            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen(!mobileMenuOpen)
              }
              className="md:hidden text-2xl leading-none"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>

            {/* WISHLIST */}
            <button
              type="button"
              onClick={() => navigate("/wishlist")}
              className="text-2xl hover:opacity-50 transition"
              aria-label="Wishlist"
            >
              ♡
            </button>

            {/* CART */}
            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="relative text-xl"
              aria-label="Cart"
            >
              🛒

              {cartCount > 0 && (
                <span className="absolute -top-3 -right-3 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

          </div>

        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-black/10 bg-white">

            <nav className="flex flex-col px-6 py-4">

              <button
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  navigate("/");
                }}
                className="text-left py-4 border-b border-black/10"
              >
                Home
              </button>

              <button
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  navigate("/shop");
                }}
                className="text-left py-4 border-b border-black/10"
              >
                Shop
              </button>

              <button
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  navigate("/track-order");
                }}
                className="text-left py-4 border-b border-black/10"
              >
                Track Order
              </button>

              <button
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  navigate("/#categories");
                }}
                className="text-left py-4 border-b border-black/10"
              >
                Collections
              </button>

              <button
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  navigate("/#about");
                }}
                className="text-left py-4"
              >
                About
              </button>

            </nav>

          </div>
        )}

      </header>

      {/* CHECKOUT CONTENT */}
      <main className="p-8">

        <div className="max-w-6xl mx-auto">

          <h1 className="text-4xl font-semibold mb-10">
            Checkout
          </h1>

          {/* DELIVERY INFORMATION */}
          <div className="border border-black/20 bg-gray-50 p-5 mb-10">

            <p className="font-medium">
              🚚 Delivery available only within Mumbai,
              Maharashtra
            </p>

            <p className="text-sm text-black/60 mt-2">
              Estimated delivery:{" "}
              <span className="font-medium text-black">
                Within 7 days
              </span>
            </p>

            <p className="text-sm text-black/60 mt-2">
              Bhandup: FREE shipping
            </p>

            <p className="text-sm text-black/60">
              Other Mumbai areas: ₹50 shipping
            </p>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="grid lg:grid-cols-3 gap-12">

              {/* LEFT SIDE */}
              <div className="lg:col-span-2">

                {/* CUSTOMER INFORMATION */}
                <h2 className="text-2xl font-semibold mb-6">
                  Customer Information
                </h2>

                <div className="space-y-5">

                  <div>
                    <label className="block text-sm mb-2">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="fullName"
                      placeholder="Enter your full name"
                      required
                      className="w-full border border-black/20 px-4 py-3 outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      required
                      className="w-full border border-black/20 px-4 py-3 outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter 10-digit phone number"
                      required
                      pattern="[0-9]{10}"
                      maxLength="10"
                      inputMode="numeric"
                      className="w-full border border-black/20 px-4 py-3 outline-none focus:border-black"
                    />
                  </div>

                </div>

                {/* DELIVERY ADDRESS */}
                <h2 className="text-2xl font-semibold mt-12 mb-6">
                  Delivery Address
                </h2>

                <div className="space-y-5">

                  {/* ADDRESS */}
                  <div>
                    <label className="block text-sm mb-2">
                      Address
                    </label>

                    <input
                      type="text"
                      name="address"
                      placeholder="House number, street"
                      required
                      className="w-full border border-black/20 px-4 py-3 outline-none focus:border-black"
                    />
                  </div>

                  {/* AREA */}
                  <div>
                    <label className="block text-sm mb-2">
                      Area / Locality
                    </label>

                    <input
                      type="text"
                      name="area"
                      value={area}
                      onChange={(e) =>
                        setArea(e.target.value)
                      }
                      placeholder="e.g. Bhandup, Andheri, Bandra"
                      required
                      className="w-full border border-black/20 px-4 py-3 outline-none focus:border-black"
                    />

                    {isBhandup ? (
                      <p className="text-xs mt-2">
                        🎉 Your area qualifies for FREE
                        shipping.
                      </p>
                    ) : (
                      <p className="text-xs text-black/50 mt-2">
                        Shipping for this Mumbai area: ₹50
                      </p>
                    )}
                  </div>

                  {/* CITY */}
                  <div>
                    <label className="block text-sm mb-2">
                      City
                    </label>

                    <input
                      type="text"
                      name="city"
                      placeholder="Mumbai"
                      defaultValue="Mumbai"
                      required
                      className="w-full border border-black/20 px-4 py-3 outline-none focus:border-black"
                    />

                    <p className="text-xs text-black/50 mt-2">
                      ZEVON currently delivers only within
                      Mumbai.
                    </p>
                  </div>

                  {/* STATE */}
                  <div>
                    <label className="block text-sm mb-2">
                      State
                    </label>

                    <input
                      type="text"
                      name="state"
                      placeholder="Maharashtra"
                      defaultValue="Maharashtra"
                      required
                      className="w-full border border-black/20 px-4 py-3 outline-none focus:border-black"
                    />
                  </div>

                  {/* PIN CODE */}
                  <div>
                    <label className="block text-sm mb-2">
                      PIN Code
                    </label>

                    <input
                      type="text"
                      name="pincode"
                      placeholder="Enter 6-digit PIN code"
                      required
                      pattern="[0-9]{6}"
                      maxLength="6"
                      inputMode="numeric"
                      className="w-full border border-black/20 px-4 py-3 outline-none focus:border-black"
                    />
                  </div>

                </div>

                {/* PAYMENT */}
                <h2 className="text-2xl font-semibold mt-12 mb-6">
                  Payment Method
                </h2>

                <div className="space-y-4">

                  {/* UPI */}
                  <label className="flex items-center gap-4 border border-black/20 p-4 cursor-pointer hover:border-black">

                    <input
                      type="radio"
                      name="payment"
                      value="upi"
                      required
                    />

                    <div>
                      <p className="font-medium">
                        UPI
                      </p>

                      <p className="text-sm text-black/50">
                        Google Pay, PhonePe, Paytm and
                        other UPI apps
                      </p>
                    </div>

                  </label>

                  {/* CARD */}
                  <label className="flex items-center gap-4 border border-black/20 p-4 cursor-pointer hover:border-black">

                    <input
                      type="radio"
                      name="payment"
                      value="card"
                    />

                    <div>
                      <p className="font-medium">
                        Credit / Debit Card
                      </p>

                      <p className="text-sm text-black/50">
                        Visa, Mastercard and other cards
                      </p>
                    </div>

                  </label>

                  {/* COD */}
                  <label className="flex items-center gap-4 border border-black/20 p-4 cursor-pointer hover:border-black">

                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                    />

                    <div>
                      <p className="font-medium">
                        Cash on Delivery
                      </p>

                      <p className="text-sm text-black/50">
                        Pay when your order arrives.
                      </p>
                    </div>

                  </label>

                </div>

                {/* PAYMENT NOTE */}
                <div className="mt-6 border border-black/10 bg-gray-50 p-4">

                  <p className="text-sm font-medium">
                    🔒 Secure Online Payment
                  </p>

                  <p className="text-xs text-black/50 mt-1">
                    UPI and card payments are securely
                    processed through Razorpay.
                  </p>

                </div>

              </div>

              {/* RIGHT SIDE - ORDER SUMMARY */}
              <div className="border border-black/10 p-6 h-fit">

                <h2 className="text-2xl font-semibold mb-6">
                  Order Summary
                </h2>

                <div className="space-y-5">

                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4"
                    >

                      <div className="w-20 h-20 bg-gray-100 overflow-hidden flex-shrink-0">

                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />

                      </div>

                      <div className="flex-1">

                        <p className="font-medium">
                          {item.name}
                        </p>

                        <p className="text-sm text-black/50 mt-1">
                          Qty: {item.quantity}
                        </p>

                        <p className="text-sm mt-1">
                          {item.price}
                        </p>

                      </div>

                    </div>
                  ))}

                </div>

                {/* DELIVERY ESTIMATE */}
                <div className="border-t border-black/10 mt-6 pt-5">

                  <div className="flex justify-between">

                    <span className="text-sm">
                      Estimated Delivery
                    </span>

                    <span className="text-sm font-medium">
                      Within 7 days
                    </span>

                  </div>

                </div>

                {/* PRICE SUMMARY */}
                <div className="border-t border-black/10 mt-6 pt-6">

                  {/* SUBTOTAL */}
                  <div className="flex justify-between">

                    <span>
                      Subtotal
                    </span>

                    <span>
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>

                  </div>

                  {/* SHIPPING */}
                  <div className="flex justify-between mt-4">

                    <span>
                      Shipping
                    </span>

                    <span>
                      {shipping === 0
                        ? "FREE"
                        : `₹${shipping}`}
                    </span>

                  </div>

                  <p className="text-xs text-black/50 mt-2">

                    {isBhandup
                      ? "Free shipping applied for Bhandup."
                      : "₹50 shipping applies to other Mumbai areas."}

                  </p>

                  {/* TOTAL */}
                  <div className="border-t border-black/10 mt-6 pt-6 flex justify-between text-xl font-semibold">

                    <span>
                      Total
                    </span>

                    <span>
                      ₹{total.toLocaleString("en-IN")}
                    </span>

                  </div>

                  {/* PLACE ORDER */}
                  <button
                    type="submit"
                    disabled={processingPayment}
                    className="w-full bg-black text-white py-4 mt-8 text-sm tracking-wide hover:bg-black/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processingPayment
                      ? "PROCESSING..."
                      : "PLACE ORDER →"}
                  </button>

                </div>

              </div>

            </div>

          </form>

        </div>

      </main>

    </div>
  );
}

export default Checkout;