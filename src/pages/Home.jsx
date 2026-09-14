import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import zevonBrandingVideo from "../assets/zevon-branding.mp4";

function Home({ cart = [], addToCart }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const categories = [
    "Rings",
    "Charms",
    "Neckpieces",
    "Keychains",
    "Pendants",
  ];

  useEffect(() => {
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

    fetchProducts();
  }, []);

  const homeCategories = categories.map((category) => {
    const first = products.find(
      (product) => product.category === category
    );

    return {
      name: category,
      image: first?.image_url,
    };
  });

  const featuredProducts = products.slice(0, 4);

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

  const searchResults = products.filter((product) => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) return false;

    return (
      product.name?.toLowerCase().includes(search) ||
      product.category?.toLowerCase().includes(search) ||
      product.description?.toLowerCase().includes(search)
    );
  });

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

    setSearchOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-white text-black">

      {/* NAVBAR */}

      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-2xl font-bold tracking-[0.3em]"
          >
            ZEVON
          </button>

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

            {/* TRACK ORDER */}
            <button
              type="button"
              onClick={() => navigate("/track-order")}
              className="hover:opacity-50"
            >
              Track Order
            </button>

            <a
              href="#categories"
              className="hover:opacity-50"
            >
              Collections
            </a>

            <a
              href="#about"
              className="hover:opacity-50"
            >
              About
            </a>

          </nav>

          <div className="hidden md:flex items-center gap-5">

            {/* SEARCH */}

            <button
              type="button"
              onClick={() => {
                setSearchOpen(!searchOpen);
                setSearchTerm("");
              }}
              className="text-xl hover:opacity-50"
              aria-label="Search"
            >
              ⌕
            </button>

            {/* HEART / WISHLIST */}

            <button
              type="button"
              onClick={() => navigate("/wishlist")}
              className="text-xl hover:opacity-50"
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

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-xl"
            aria-label="Menu"
          >
            ☰
          </button>

        </div>

        {/* SEARCH BOX */}

        {searchOpen && (
          <div className="border-t border-black/10 bg-white px-6 py-5">

            <div className="max-w-7xl mx-auto">

              <input
                type="text"
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search rings, charms, pendants..."
                className="w-full border border-black/20 px-4 py-3 outline-none focus:border-black"
              />

              {searchTerm.trim() && (
                <div className="mt-4 max-h-96 overflow-y-auto">

                  {searchResults.length === 0 ? (
                    <p className="py-5 text-black/50">
                      No products found.
                    </p>
                  ) : (
                    <div className="space-y-3">

                      {searchResults.map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => openProduct(product)}
                          className="w-full flex items-center gap-4 p-3 text-left hover:bg-gray-50"
                        >

                          <div className="w-16 h-16 bg-gray-100 overflow-hidden flex-shrink-0">
                            {product.image_url && (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>

                          <div>
                            <p className="font-medium">
                              {product.name}
                            </p>

                            <p className="text-sm text-black/50">
                              {product.category}
                            </p>

                            <p className="text-sm mt-1">
                              ₹{product.price}
                            </p>
                          </div>

                        </button>
                      ))}

                    </div>
                  )}

                </div>
              )}

            </div>

          </div>
        )}

        {/* MOBILE MENU */}

        {menuOpen && (
          <nav className="md:hidden px-6 pb-6 flex flex-col gap-5 text-sm">

            <button
              type="button"
              onClick={() => {
                navigate("/");
                setMenuOpen(false);
              }}
              className="text-left"
            >
              Home
            </button>

            <button
              type="button"
              onClick={() => {
                navigate("/shop");
                setMenuOpen(false);
              }}
              className="text-left"
            >
              Shop
            </button>

            {/* MOBILE TRACK ORDER */}

            <button
              type="button"
              onClick={() => {
                navigate("/track-order");
                setMenuOpen(false);
              }}
              className="text-left"
            >
              Track Order
            </button>

            <a
              href="#categories"
              onClick={() => setMenuOpen(false)}
            >
              Collections
            </a>

            <a
              href="#about"
              onClick={() => setMenuOpen(false)}
            >
              About
            </a>

            <button
              type="button"
              onClick={() => {
                navigate("/wishlist");
                setMenuOpen(false);
              }}
              className="text-left"
            >
              ♡ Wishlist
            </button>

            <button
              type="button"
              onClick={() => {
                navigate("/cart");
                setMenuOpen(false);
              }}
              className="text-left"
            >
              🛒 Cart ({cartCount})
            </button>

          </nav>
        )}

      </header>

      {/* HERO / BRANDING VIDEO */}

      <section className="relative min-h-[92vh] overflow-hidden bg-black text-white pt-20">

        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={zevonBrandingVideo}
          autoPlay
          muted
          loop
          playsInline
          aria-label="ZEVON branding video"
        />

        <div className="absolute inset-0 bg-black/45" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/70" />

        <div className="relative z-10 min-h-[92vh] flex items-center justify-center text-center px-6">

          <div className="max-w-3xl">

            <p className="uppercase tracking-[0.5em] text-xs md:text-sm text-white/70 mb-6">
              Accessories made to stand out
            </p>

            <h1 className="text-6xl md:text-8xl font-semibold tracking-[0.18em] leading-none">
              ZEVON
            </h1>

            <p className="mt-6 text-lg md:text-2xl tracking-[0.25em] uppercase text-white/85">
              Wear Your Vibe.
            </p>

            <p className="mt-5 max-w-lg mx-auto text-sm md:text-base text-white/65 leading-relaxed">
              Statement accessories for your everyday style. Discover pieces that feel like you.
            </p>

            <button
              type="button"
              onClick={() => navigate("/shop")}
              className="mt-9 bg-white text-black px-9 py-4 text-sm font-medium tracking-[0.15em] hover:bg-white/85 transition"
            >
              SHOP COLLECTION →
            </button>

          </div>

        </div>

      </section>

      {/* CATEGORIES */}

      <section
        id="categories"
        className="py-24 px-6"
      >

        <div className="max-w-7xl mx-auto">

          <p className="text-xs tracking-[0.3em] uppercase text-black/50">
            Explore
          </p>

          <h2 className="text-4xl font-semibold mt-3 mb-12">
            Shop by Category
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            {homeCategories.map((category) => (

              <button
                type="button"
                key={category.name}
                onClick={() => navigate("/shop")}
                className="group relative aspect-[3/4] overflow-hidden bg-gray-100 text-left"
              >

                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-black/40">
                    Loading...
                  </div>
                )}

                <div className="absolute inset-0 bg-black/20" />

                <h3 className="absolute bottom-6 left-6 text-white text-xl font-medium">
                  {category.name}
                </h3>

              </button>

            ))}

          </div>

        </div>

      </section>

      {/* FEATURED PRODUCTS */}

      <section className="py-24 px-6 bg-gray-50">

        <div className="max-w-7xl mx-auto">

          <p className="text-xs tracking-[0.3em] uppercase text-black/50">
            ZEVON Essentials
          </p>

          <h2 className="text-4xl font-semibold mt-3 mb-12">
            Featured Pieces
          </h2>

          {loading ? (
            <p className="text-center py-16 text-black/50">
              Loading products...
            </p>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">

              {featuredProducts.map((product) => (

                <div key={product.id}>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/product/${product.id}`, {
                        state: {
                          product: {
                            ...product,
                            image: product.image_url,
                            price: `₹${product.price}`,
                          },
                        },
                      })
                    }
                    className="block w-full text-left"
                  >

                    <div className="aspect-square overflow-hidden bg-white">

                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition duration-700"
                      />

                    </div>

                  </button>

                  <div className="flex justify-between items-start mt-5">

                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/product/${product.id}`, {
                          state: {
                            product: {
                              ...product,
                              image: product.image_url,
                              price: `₹${product.price}`,
                            },
                          },
                        })
                      }
                      className="text-left"
                    >

                      <h3 className="font-medium">
                        {product.name}
                      </h3>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="text-base font-medium text-black">
                          ₹{product.price}
                        </span>

                        {Number(product.mrp) > Number(product.price) && (
                          <>
                            <span className="text-sm text-black/40 line-through">
                              ₹{product.mrp}
                            </span>

                            <span className="text-xs font-medium text-black border border-black/20 px-2 py-1">
                              {Math.round(
                                ((Number(product.mrp) - Number(product.price)) /
                                  Number(product.mrp)) *
                                  100
                              )}% OFF
                            </span>
                          </>
                        )}
                      </div>

                    </button>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className="text-sm border border-black px-4 py-2 hover:bg-black hover:text-white"
                    >
                      Add
                    </button>

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>

      </section>

      {/* PROMO */}

      <section className="py-28 px-6 bg-black text-white text-center">

        <p className="text-xs tracking-[0.4em] uppercase text-white/50">
          ZEVON
        </p>

        <h2 className="text-4xl md:text-6xl font-semibold mt-5">
          Designed to Stand Apart.
        </h2>

        <p className="max-w-xl mx-auto mt-6 text-white/60">
          Premium details. Timeless design. Made for your everyday style.
        </p>

        <button
          type="button"
          onClick={() => navigate("/shop")}
          className="mt-9 border border-white px-8 py-4 text-sm hover:bg-white hover:text-black"
        >
          EXPLORE COLLECTION
        </button>

      </section>

      {/* ABOUT */}

      <section
        id="about"
        className="py-24 px-6"
      >

        <div className="max-w-3xl mx-auto text-center">

          <p className="text-xs tracking-[0.3em] uppercase text-black/50">
            About ZEVON
          </p>

          <h2 className="text-4xl font-semibold mt-4">
            Less Noise. More Style.
          </h2>

          <p className="mt-6 text-black/60 leading-relaxed">
            ZEVON is built around a simple idea — accessories should
            feel personal. Every piece is selected to bring a clean,
            confident edge to your everyday look.
          </p>

        </div>

      </section>

      {/* CONTACT */}

      <section
        id="contact"
        className="py-24 px-6 bg-gray-50"
      >

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          <div>

            <p className="text-xs tracking-[0.3em] uppercase text-black/50">
              Get in touch
            </p>

            <h2 className="text-4xl md:text-5xl font-semibold mt-3">
              Contact Zevon
            </h2>

            <p className="mt-5 max-w-lg text-black/60 leading-relaxed">
              Questions about an order, a product, or the collection?
              Reach out and we’ll be happy to help.
            </p>

          </div>

          <div className="space-y-5 text-sm">

            <a
              href="tel:+918108560779"
              className="block border-b border-black/10 pb-4 hover:opacity-60 transition"
            >
              <span className="block text-xs uppercase tracking-[0.25em] text-black/40 mb-2">
                Phone
              </span>

              +91 8108560779
            </a>

            <a
              href="https://www.instagram.com/zevon_in/"
              target="_blank"
              rel="noopener noreferrer"
              className="block border-b border-black/10 pb-4 hover:opacity-60 transition"
            >
              <span className="block text-xs uppercase tracking-[0.25em] text-black/40 mb-2">
                Instagram
              </span>

              @zevon_in ↗
            </a>

            <a
              href="mailto:official.zevonindia@gmail.com"
              className="block border-b border-black/10 pb-4 hover:opacity-60 transition"
            >
              <span className="block text-xs uppercase tracking-[0.25em] text-black/40 mb-2">
                Email
              </span>

              official.zevonindia@gmail.com
            </a>

          </div>

        </div>

      </section>

      {/* FOOTER */}

      <footer className="bg-black text-white px-6 py-16">

        <div className="max-w-7xl mx-auto">

          <div className="grid md:grid-cols-4 gap-10">

            <div>

              <h3 className="text-xl font-bold tracking-[0.3em]">
                ZEVON
              </h3>

              <p className="text-white/50 text-sm mt-5">
                Elevate your everyday.
              </p>

            </div>

            <div>

              <h4 className="font-medium mb-4">
                Shop
              </h4>

              <div className="flex flex-col gap-3 text-sm text-white/50">

                <button
                  type="button"
                  onClick={() => navigate("/shop")}
                  className="text-left"
                >
                  All Products
                </button>

                <a href="#categories">
                  Categories
                </a>

                <button
                  type="button"
                  onClick={() => navigate("/shop")}
                  className="text-left"
                >
                  New Arrivals
                </button>

              </div>

            </div>

            <div>

              <h4 className="font-medium mb-4">
                Help
              </h4>

              <div className="flex flex-col gap-3 text-sm text-white/50">

                <a href="#contact">
                  Contact
                </a>

                {/* TRACK ORDER */}

                <button
                  type="button"
                  onClick={() => navigate("/track-order")}
                  className="text-left"
                >
                  Track Order
                </button>

                {/* SHIPPING POLICY */}

                <button
                  type="button"
                  onClick={() => navigate("/shipping-policy")}
                  className="text-left"
                >
                  Shipping
                </button>

                {/* RETURN & REFUND POLICY */}

                <button
                  type="button"
                  onClick={() => navigate("/return-policy")}
                  className="text-left"
                >
                  Return & Refund Policy
                </button>

              </div>

            </div>

            <div>

              <h4 className="font-medium mb-4">
                Follow
              </h4>

              <div className="flex flex-col gap-3 text-sm text-white/50">

                <a
                  href="https://www.instagram.com/zevon_in/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram @zevon_in ↗
                </a>

                <a href="#">
                  Facebook
                </a>

                <a href="#">
                  Pinterest
                </a>

              </div>

            </div>

          </div>

          <div className="border-t border-white/10 mt-12 pt-6 text-sm text-white/40">
            © 2026 ZEVON. All rights reserved.
          </div>

        </div>

      </footer>

    </div>
  );
}

export default Home;