import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function Shop({ cart = [], addToCart }) {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem("zevon-wishlist");

    try {
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch {
      return [];
    }
  });

  const categories = [
    "All",
    "Rings",
    "Charms",
    "Neckpieces",
    "Keychains",
    "Pendants",
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "zevon-wishlist",
      JSON.stringify(wishlist)
    );
  }, [wishlist]);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
      return;
    }

    setProducts(data || []);
    setLoading(false);
  };

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (product) => product.category === selectedCategory
        );

  const cartCount = cart.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );

  const handleAddToCart = (product) => {
    if (typeof addToCart === "function") {
      addToCart({
        ...product,
        image: product.image_url,
        price: `₹${product.price}`,
      });
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(
      (product) => product.id === productId
    );
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      const updatedWishlist = wishlist.filter(
        (item) => item.id !== product.id
      );

      setWishlist(updatedWishlist);
    } else {
      setWishlist([
        ...wishlist,
        product,
      ]);
    }
  };

  const openProduct = (product) => {
    navigate(`/product/${product.id}`, {
      state: {
        product: {
          ...product,
          image: product.image_url,
          price: `₹${product.price}`,
        },
      },
    });
  };

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

            {/* MOBILE MENU BUTTON */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-2xl leading-none"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>

            {/* WISHLIST */}
            <button
              type="button"
              onClick={() => navigate("/wishlist")}
              className="text-xl hover:opacity-50"
              aria-label="Wishlist"
            >
              {wishlist.length > 0 ? "♥" : "♡"}
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

      {/* SHOP HEADER */}
      <section className="border-b border-black/10">
        <div className="max-w-7xl mx-auto px-6 py-12">

          <p className="text-xs tracking-[0.4em] uppercase text-black/50">
            ZEVON
          </p>

          <h1 className="text-5xl font-semibold mt-3">
            Shop
          </h1>

          <p className="mt-4 text-black/60">
            Premium accessories for your everyday style.
          </p>

        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-6 py-10">

        <div className="flex flex-wrap gap-3">

          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category
                  ? "px-5 py-2 border border-black bg-black text-white text-sm"
                  : "px-5 py-2 border border-black text-sm hover:bg-black hover:text-white"
              }
            >
              {category}
            </button>
          ))}

        </div>

      </section>

      {/* PRODUCTS */}
      <section className="max-w-7xl mx-auto px-6 pb-24">

        {loading ? (
          <p className="text-center py-20 text-black/60">
            Loading products...
          </p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center py-20 text-black/60">
            No products found.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group"
              >

                {/* PRODUCT IMAGE */}
                <div className="relative">

                  <button
                    type="button"
                    onClick={() => openProduct(product)}
                    className="block w-full text-left"
                  >
                    <div className="aspect-square overflow-hidden bg-gray-100">

                      <img
                        src={product.image_url}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                      />

                    </div>
                  </button>

                  {/* PRODUCT HEART */}
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-xl hover:bg-black hover:text-white transition"
                    aria-label={
                      isInWishlist(product.id)
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                  >
                    {isInWishlist(product.id) ? "♥" : "♡"}
                  </button>

                </div>

                {/* PRODUCT INFO */}
                <div className="mt-5">

                  <p className="text-xs uppercase tracking-widest text-black/40">
                    {product.category}
                  </p>

                  <div className="flex justify-between items-start mt-2 gap-4">

                    <button
                      type="button"
                      onClick={() => openProduct(product)}
                      className="text-left"
                    >

                      <h2 className="text-lg font-medium hover:opacity-60">
                        {product.name}
                      </h2>

                      <p className="mt-1 text-black/60">
                        ₹{product.price}
                      </p>

                    </button>

                    {/* ADD TO CART */}
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className="border border-black px-5 py-2 text-sm hover:bg-black hover:text-white transition"
                    >
                      Add
                    </button>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </section>

    </div>
  );
}

export default Shop;