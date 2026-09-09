import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function OrderSuccess() {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
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

            {/* MOBILE MENU */}
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
              className="text-xl hover:opacity-50 transition"
              aria-label="Cart"
            >
              🛒
            </button>

          </div>

        </div>

        {/* MOBILE NAVIGATION */}
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

      {/* ORDER SUCCESS CONTENT */}
      <main className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-12">

        <div className="text-center max-w-xl w-full">

          {/* SUCCESS ICON */}
          <div className="mx-auto mb-8 w-20 h-20 border-2 border-black rounded-full flex items-center justify-center">
            <span className="text-4xl">
              ✓
            </span>
          </div>

          <p className="text-xs tracking-[0.4em] uppercase text-black/50">
            ZEVON
          </p>

          <h1 className="text-5xl md:text-6xl font-semibold mt-4">
            Order Confirmed
          </h1>

          <p className="mt-6 text-black/60 leading-relaxed">
            Thank you for shopping with ZEVON.
            <br />
            Your order has been successfully placed.
          </p>

          <p className="mt-3 text-black/50">
            We'll prepare your order for delivery.
          </p>

          {/* DELIVERY INFORMATION */}
          <div className="border border-black/10 mt-8 p-5 bg-gray-50">

            <p className="text-xs uppercase tracking-widest text-black/40">
              Estimated Delivery
            </p>

            <p className="font-semibold text-lg mt-2">
              Within 7 days
            </p>

            <p className="text-sm text-black/50 mt-2">
              🚚 Your ZEVON order will be delivered within 7 days.
            </p>

          </div>

          {/* ORDER ID */}
          <div className="border border-black/10 mt-4 p-5">

            <p className="text-xs uppercase tracking-widest text-black/40">
              Order ID
            </p>

            <p className="font-semibold text-lg mt-2 break-all">
              {orderId
                ? `ZEVON-${orderId}`
                : "Order placed successfully"}
            </p>

            <p className="text-sm text-black/60 mt-4 leading-relaxed">
              Please save your Order ID.
              <br />
              Take a screenshot or note down this number.
              <br />
              You will need it to track your order.
            </p>

          </div>

          {/* TRACK ORDER */}
          <button
            type="button"
            onClick={() => navigate("/track-order")}
            className="w-full border border-black py-4 mt-6 text-sm tracking-wide hover:bg-black hover:text-white transition"
          >
            TRACK YOUR ORDER →
          </button>

          {/* CONTINUE SHOPPING */}
          <button
            type="button"
            onClick={() => navigate("/shop")}
            className="w-full bg-black text-white py-4 mt-4 text-sm tracking-wide hover:bg-black/80 transition"
          >
            CONTINUE SHOPPING →
          </button>

          {/* HOME */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-5 text-sm underline text-black/60 hover:text-black"
          >
            Back to Home
          </button>

        </div>

      </main>

    </div>
  );
}

export default OrderSuccess;