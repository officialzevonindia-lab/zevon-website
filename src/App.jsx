import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import ProductDetails from "./pages/ProductDetails";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import Wishlist from "./pages/Wishlist";
import ReturnPolicy from "./pages/ReturnPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import OrderTracking from "./pages/OrderTracking";

import { supabase } from "./supabaseClient";

function App() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("zevon-cart");

    try {
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);

  // Check Supabase login session
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
      setLoadingSession(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        setLoadingSession(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Save cart
  useEffect(() => {
    localStorage.setItem("zevon-cart", JSON.stringify(cart));
  }, [cart]);

  // Add product to cart
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...prevCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  // Wait for Supabase session
  if (loadingSession) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-[0.3em]">
            ZEVON
          </h1>

          <p className="mt-4 text-white/50">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={
            <Home
              cart={cart}
              addToCart={addToCart}
            />
          }
        />

        {/* SHOP */}
        <Route
          path="/shop"
          element={
            <Shop
              cart={cart}
              addToCart={addToCart}
            />
          }
        />

        {/* PRODUCT DETAILS */}
        <Route
          path="/product/:id"
          element={
            <ProductDetails
              cart={cart}
              addToCart={addToCart}
            />
          }
        />

        {/* CART */}
        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              setCart={setCart}
            />
          }
        />

        {/* CHECKOUT */}
        <Route
          path="/checkout"
          element={
            <Checkout
              cart={cart}
              setCart={setCart}
            />
          }
        />

        {/* ORDER SUCCESS - WITH PERMANENT ORDER ID */}
        <Route
          path="/order-success/:orderId"
          element={<OrderSuccess />}
        />

        {/* ORDER SUCCESS - OLD URL SUPPORT */}
        <Route
          path="/order-success"
          element={<OrderSuccess />}
        />

        {/* TRACK ORDER */}
        <Route
          path="/track-order"
          element={<OrderTracking />}
        />

        {/* WISHLIST */}
        <Route
          path="/wishlist"
          element={<Wishlist />}
        />

        {/* RETURN POLICY */}
        <Route
          path="/return-policy"
          element={<ReturnPolicy />}
        />

        {/* SHIPPING POLICY */}
        <Route
          path="/shipping-policy"
          element={<ShippingPolicy />}
        />

        {/* ADMIN LOGIN */}
        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        {/* PROTECTED ADMIN */}
        <Route
          path="/admin"
          element={
            session ? (
              <Admin />
            ) : (
              <Navigate
                to="/admin-login"
                replace
              />
            )
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;