import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Cart({ cart, setCart }) {
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const increaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.id !== id)
    );
  };

  const total = cart.reduce((sum, item) => {
    const price = Number(
      item.price.replace("₹", "").replace(",", "")
    );

    return sum + price * item.quantity;
  }, 0);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-black">

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white border-b border-black/10">

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
          <nav className="hidden md:flex items-center gap-10 text-sm">

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
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-2xl leading-none"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>

            {/* CART */}
            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="text-xl"
              aria-label="Cart"
            >
              🛒

              {cart.length > 0 && (
                <span className="ml-1 text-xs">
                  {cart.reduce(
                    (total, item) =>
                      total + (item.quantity || 0),
                    0
                  )}
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

      {/* CART CONTENT */}
      <main className="p-8">

        <h1 className="text-4xl font-semibold mb-8">
          Your Cart
        </h1>

        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="grid lg:grid-cols-3 gap-12">

            {/* CART PRODUCTS */}
            <div className="lg:col-span-2 space-y-6">

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-6 border-b border-black/10 pb-6"
                >

                  {/* PRODUCT IMAGE */}
                  <div className="w-32 h-32 bg-gray-100 overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* PRODUCT DETAILS */}
                  <div className="flex-1">

                    <h2 className="text-xl font-medium">
                      {item.name}
                    </h2>

                    <p className="text-black/60 mt-2">
                      {item.price}
                    </p>

                    {/* QUANTITY */}
                    <div className="flex items-center gap-3 mt-4">

                      <button
                        onClick={() =>
                          decreaseQuantity(item.id)
                        }
                        className="border border-black w-8 h-8 hover:bg-black hover:text-white transition"
                      >
                        −
                      </button>

                      <span className="w-6 text-center">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          increaseQuantity(item.id)
                        }
                        className="border border-black w-8 h-8 hover:bg-black hover:text-white transition"
                      >
                        +
                      </button>

                    </div>

                    {/* REMOVE */}
                    <button
                      onClick={() =>
                        removeFromCart(item.id)
                      }
                      className="mt-4 text-sm underline text-black/60 hover:text-black"
                    >
                      Remove
                    </button>

                  </div>

                </div>
              ))}

            </div>

            {/* ORDER SUMMARY */}
            <div className="border border-black/10 p-6 h-fit">

              <h2 className="text-2xl font-semibold mb-6">
                Order Summary
              </h2>

              {/* SUBTOTAL */}
              <div className="flex justify-between text-base">
                <span>Subtotal</span>

                <span>
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>

              {/* SHIPPING */}
              <div className="flex justify-between text-base mt-4">
                <span>Shipping</span>

                <span>
                  Calculated at checkout
                </span>
              </div>

              {/* TOTAL */}
              <div className="border-t border-black/10 mt-6 pt-6 flex justify-between text-xl font-semibold">

                <span>Total</span>

                <span>
                  ₹{total.toLocaleString("en-IN")}
                </span>

              </div>

              {/* CHECKOUT */}
              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-black text-white py-4 mt-8 text-sm tracking-wide hover:bg-black/80 transition"
              >
                PROCEED TO CHECKOUT →
              </button>

            </div>

          </div>
        )}

      </main>

    </div>
  );
}

export default Cart;