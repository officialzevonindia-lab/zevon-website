import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ShippingPolicy() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* HEADER */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="h-20 flex items-center justify-between">

            {/* LOGO */}
            <button
              onClick={() => navigate("/")}
              className="text-2xl font-bold tracking-[0.25em]"
            >
              ZEVON
            </button>

            {/* DESKTOP NAVIGATION */}
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
              <button onClick={() => navigate("/")}>Home</button>

              <button onClick={() => navigate("/shop")}>Shop</button>

              <button onClick={() => navigate("/track-order")}>
                Track Order
              </button>

              <button onClick={() => navigate("/#categories")}>
                Collections
              </button>

              <button onClick={() => navigate("/#about")}>
                About
              </button>

              <button
                onClick={() => navigate("/wishlist")}
                className="text-xl"
                aria-label="Wishlist"
              >
                ♡
              </button>

              <button
                onClick={() => navigate("/cart")}
                className="text-xl"
                aria-label="Cart"
              >
                🛒
              </button>
            </nav>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-2xl"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>

          {/* MOBILE NAVIGATION */}
          {mobileMenuOpen && (
            <nav className="md:hidden border-t border-gray-200 py-5">
              <div className="flex flex-col gap-5 text-sm font-medium">

                <button
                  onClick={() => {
                    navigate("/");
                    closeMobileMenu();
                  }}
                  className="text-left"
                >
                  Home
                </button>

                <button
                  onClick={() => {
                    navigate("/shop");
                    closeMobileMenu();
                  }}
                  className="text-left"
                >
                  Shop
                </button>

                <button
                  onClick={() => {
                    navigate("/track-order");
                    closeMobileMenu();
                  }}
                  className="text-left"
                >
                  Track Order
                </button>

                <button
                  onClick={() => {
                    navigate("/#categories");
                    closeMobileMenu();
                  }}
                  className="text-left"
                >
                  Collections
                </button>

                <button
                  onClick={() => {
                    navigate("/#about");
                    closeMobileMenu();
                  }}
                  className="text-left"
                >
                  About
                </button>

                <div className="flex items-center gap-6 pt-2">
                  <button
                    onClick={() => {
                      navigate("/wishlist");
                      closeMobileMenu();
                    }}
                    className="text-xl"
                    aria-label="Wishlist"
                  >
                    ♡
                  </button>

                  <button
                    onClick={() => {
                      navigate("/cart");
                      closeMobileMenu();
                    }}
                    className="text-xl"
                    aria-label="Cart"
                  >
                    🛒
                  </button>
                </div>

              </div>
            </nav>
          )}
        </div>
      </header>

      {/* SHIPPING POLICY CONTENT */}
      <main className="w-full max-w-4xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
        <div className="shipping-policy">

          <h1 className="text-3xl sm:text-4xl font-bold mb-5">
            ZEVON — Shipping Policy
          </h1>

          <p className="mb-5">
            <strong>Last Updated: 2026</strong>
          </p>

          <p className="mb-6">
            At ZEVON, we aim to make sure your order reaches you safely and on
            time. Please read the following shipping information before placing
            your order.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-3">
            1. Order Processing
          </h2>

          <p className="mb-3">
            Orders are processed after the order has been successfully placed.
          </p>

          <p className="mb-5">
            We may require some time to prepare, pack, and dispatch your order.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-3">
            2. Delivery Time
          </h2>

          <p className="mb-3">
            Delivery times may vary depending on your location and other
            circumstances.
          </p>

          <p className="mb-3">
            Estimated delivery time will be communicated or displayed during
            the ordering process where applicable.
          </p>

          <p className="mb-5">
            Please note that delivery times are estimates and may be affected by
            circumstances beyond ZEVON's control.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-3">
            3. Shipping Area
          </h2>

          <p className="mb-3">
            ZEVON currently provides delivery{" "}
            <strong>only within Mumbai, Maharashtra</strong>.
          </p>

          <p className="mb-5">
            Orders placed for locations outside Mumbai are currently not eligible
            for delivery.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-3">
            4. Shipping Charges
          </h2>

          <p className="mb-3">
            Shipping charges, if applicable, will be shown during the checkout
            process before the order is placed.
          </p>

          <p className="mb-5">
            Any applicable shipping charges will be added to the total order
            amount.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-3">
            5. Free Shipping
          </h2>

          <p className="mb-3">
            <strong>Free shipping is available only in Bhandup</strong>, subject
            to the applicable delivery area.
          </p>

          <p className="mb-5">
            For locations outside Bhandup but within Mumbai, shipping charges may
            apply.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-3">
            6. Delivery Delays
          </h2>

          <p className="mb-3">
            ZEVON is not responsible for delays caused by circumstances beyond our
            control, including:
          </p>

          <ul className="list-disc pl-6 mb-5 space-y-2">
            <li>Weather conditions</li>
            <li>Transportation delays</li>
            <li>Delivery service issues</li>
            <li>Incorrect or incomplete address information</li>
            <li>Unavailability of the customer at the delivery address</li>
            <li>Other unforeseen circumstances</li>
          </ul>

          <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-3">
            7. Incorrect Address
          </h2>

          <p className="mb-3">
            Customers are responsible for providing a{" "}
            <strong>
              correct and complete delivery address and contact details
            </strong>{" "}
            when placing an order.
          </p>

          <p className="mb-5">
            ZEVON may not be responsible for delivery issues caused by incorrect
            or incomplete information provided by the customer.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-3">
            8. Order Delivery
          </h2>

          <p className="mb-3">
            Customers should ensure that someone is available to receive the order
            at the provided delivery address.
          </p>

          <p className="mb-5">
            If a delivery attempt is unsuccessful, the delivery service may make
            another attempt or contact the customer.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-3">
            9. Damaged Package
          </h2>

          <p className="mb-3">
            If your package appears damaged or the product inside is damaged,
            please contact ZEVON{" "}
            <strong>on the same day of delivery</strong>.
          </p>

          <p className="mb-3">
            Clear photos or a video of the package and product may be requested to
            help us review the issue.
          </p>

          <p className="mb-5">
            For more information about returns, please see our{" "}
            <strong>Return & Refund Policy</strong>.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-3">
            10. Contact Us
          </h2>

          <p className="mb-3">
            If you have any questions regarding your order or shipping, please
            contact ZEVON.
          </p>

          <p className="mb-3">
            <strong>Phone:</strong> +91 8108560779
          </p>

          <p className="mb-3">
            <strong>Email:</strong> official.zevonindia@gmail.com
          </p>

          <p className="mb-3">
            <strong>Instagram:</strong> @zevon_in
          </p>

          <p className="mb-5">
            Please provide your <strong>order details</strong> when contacting us
            so that we can assist you more efficiently.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-3">
            11. Important
          </h2>

          <p className="mb-3">
            By placing an order with ZEVON, customers acknowledge and agree to
            this Shipping Policy.
          </p>

          <p className="mb-5">
            <strong>
              ZEVON reserves the right to update this Shipping Policy when
              necessary.
            </strong>
          </p>

        </div>
      </main>
    </div>
  );
}

export default ShippingPolicy;