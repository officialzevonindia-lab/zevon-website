import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ReturnPolicy() {
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

      {/* RETURN & REFUND POLICY CONTENT */}
      <main className="w-full max-w-4xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
        <div className="return-policy">

          <h1 className="text-3xl sm:text-4xl font-bold mb-5">
            ZEVON — Return & Refund Policy
          </h1>

          <p className="mb-5">
            <strong>Last Updated: 2026</strong>
          </p>

          <p className="mb-6">
            At ZEVON, we want you to be happy with your purchase. If there is an
            issue with your order, you may request a return according to the
            conditions below.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-3">
            1. Return Window
          </h2>

          <p className="mb-3">
            Returns are accepted{" "}
            <strong>only on the same day the order is delivered</strong>.
          </p>

          <p className="mb-5">
            Once the delivery day has passed, the product will no longer be
            eligible for return.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-3">
            2. Eligible Reasons for Return
          </h2>

          <p className="mb-3">A return may be requested if:</p>

          <ul className="list-disc pl-6 mb-5 space-y-2">
            <li>The product arrives damaged or broken.</li>
            <li>The product is defective.</li>
            <li>You received the wrong product.</li>
            <li>
              The product is not as expected, including concerns regarding its
              size, appearance, or overall product condition.
            </li>
          </ul>

          <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-3">
            3. Same-Day Requirement
          </h2>

          <p className="mb-3">
            Customers must contact ZEVON on the day of delivery to request a
            return.
          </p>

          <p className="mb-5">
            Requests made on the following day or later may not be accepted.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-3">
            4. Proof of the Issue
          </h2>

          <p className="mb-3">
            For damaged, broken, defective, or incorrect products, ZEVON may
            request clear photos or a video showing the issue.
          </p>

          <p className="mb-5">
            This helps us verify the problem and process the return or replacement
            fairly.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-3">
            5. Product Condition
          </h2>

          <p className="mb-3">
            The product should be returned in the condition in which it was
            received.
          </p>

          <p className="mb-5">
            Where applicable, please keep the original packaging and any
            accessories until your return request has been reviewed.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-3">
            6. Return Approval
          </h2>

          <p className="mb-3">
            Submitting a return request does not automatically guarantee approval.
          </p>

          <p className="mb-5">
            ZEVON will review the reason for the return and any photos/videos
            provided before approving the return.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-3">
            7. Refunds & Replacements
          </h2>

          <p className="mb-3">Depending on the situation, ZEVON may offer:</p>

          <ul className="list-disc pl-6 mb-3 space-y-2">
            <li>A replacement</li>
            <li>A refund</li>
          </ul>

          <p className="mb-5">
            The available option may depend on the product and the reason for the
            return.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-3">
            8. Non-Eligible Returns
          </h2>

          <p className="mb-3">Returns may not be accepted when:</p>

          <ul className="list-disc pl-6 mb-5 space-y-2">
            <li>The return request is made after the same day of delivery.</li>
            <li>
              The product has been intentionally damaged or misused after delivery.
            </li>
            <li>The issue is caused by normal wear and tear.</li>
            <li>
              Once a return is approved, the customer must return the product to
              ZEVON as instructed.
            </li>
          </ul>

          <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-3">
            9. How to Request a Return
          </h2>

          <p className="mb-5">
            To request a return, contact ZEVON on the same day your order is
            delivered.
          </p>

          <p className="mb-3">
            <strong>Phone:</strong> +91 8108560779
          </p>

          <p className="mb-3">
            <strong>Email:</strong> official.zevonindia@gmail.com
          </p>

          <p className="mb-5">
            <strong>Instagram:</strong> @zevon_in
          </p>

          <p className="mb-5">
            Please include your order details and the reason for the return. For
            damaged, broken, defective, or wrong products, include clear photos or
            a video where possible.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-3">
            10. Important
          </h2>

          <p className="mb-3">
            By placing an order with ZEVON, customers acknowledge and agree to
            this Return & Refund Policy.
          </p>

          <p className="mb-5">
            <strong>
              ZEVON reserves the right to review each return request individually
              and determine whether it meets the conditions of this policy.
            </strong>
          </p>

        </div>
      </main>
    </div>
  );
}

export default ReturnPolicy;