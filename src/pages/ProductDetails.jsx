import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

function ProductDetails({ cart = [], addToCart }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [quantity, setQuantity] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!location.state?.product);

  // Cart popup
  const [cartPopup, setCartPopup] = useState(false);

  // Wishlist
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem("zevon-wishlist");

    try {
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch {
      return [];
    }
  });

  // Reviews
  const [reviews, setReviews] = useState([]);
  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
        return;
      }

      setProduct(data);
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  // Save wishlist
  useEffect(() => {
    localStorage.setItem(
      "zevon-wishlist",
      JSON.stringify(wishlist)
    );
  }, [wishlist]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;

      setReviewsLoading(true);

      const { data, error } = await supabase
        .from("product_reviews")
        .select("*")
        .eq("product_id", id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching reviews:", error);
      } else {
        setReviews(data || []);
      }

      setReviewsLoading(false);
    };

    fetchReviews();
  }, [id]);

  // Wishlist status
  const isInWishlist = product
    ? wishlist.some((item) => item.id === product.id)
    : false;

  // Toggle wishlist
  const toggleWishlist = () => {
    if (!product) return;

    setWishlist((currentWishlist) => {
      const alreadyAdded = currentWishlist.some(
        (item) => item.id === product.id
      );

      if (alreadyAdded) {
        return currentWishlist.filter(
          (item) => item.id !== product.id
        );
      }

      return [...currentWishlist, product];
    });
  };

  // Cart count
  const cartCount = cart.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );

  // Add product to cart
  const addProductToCart = (showPopup = true) => {
    if (!product) return;

    const productForCart = {
      ...product,
      image: product.image_url,
      price: `₹${product.price}`,
    };

    for (let i = 0; i < quantity; i += 1) {
      addToCart?.(productForCart);
    }

    if (showPopup) {
      setCartPopup(true);

      setTimeout(() => {
        setCartPopup(false);
      }, 4000);
    }
  };

  // Buy Now
  const handleBuyNow = () => {
    addProductToCart(false);
    navigate("/cart");
  };

  // Submit review
  const handleSubmitReview = async (event) => {
    event.preventDefault();

    if (!reviewName.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!reviewText.trim()) {
      alert("Please write a review.");
      return;
    }

    setSubmittingReview(true);

    const { data, error } = await supabase
      .from("product_reviews")
      .insert([
        {
          product_id: product.id,
          customer_name: reviewName.trim(),
          rating: reviewRating,
          review: reviewText.trim(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error submitting review:", error);
      alert("Unable to submit review. Please try again.");
      setSubmittingReview(false);
      return;
    }

    setReviews((currentReviews) => [data, ...currentReviews]);

    setReviewName("");
    setReviewText("");
    setReviewRating(5);
    setSubmittingReview(false);

    alert("Thank you! Your review has been submitted.");
  };

  // Average rating
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (total, review) => total + Number(review.rating),
            0
          ) / reviews.length
        ).toFixed(1)
      : "0.0";

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-black/60">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-semibold">
            Product Not Found
          </h1>

          <button
            onClick={() => navigate("/shop")}
            className="mt-6 bg-black text-white px-6 py-3"
          >
            BACK TO SHOP
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">

      {/* ================= CART POPUP ================= */}
      {cartPopup && (
        <div className="fixed top-5 right-5 z-[100] w-[340px] max-w-[calc(100%-2rem)] bg-white border border-black/10 shadow-2xl">

          <div className="flex items-center justify-between px-5 py-4 border-b border-black/10">

            <div className="flex items-center gap-2">

              <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs">
                ✓
              </span>

              <p className="font-medium">
                Added to cart
              </p>

            </div>

            <button
              type="button"
              onClick={() => setCartPopup(false)}
              className="text-xl hover:opacity-50"
              aria-label="Close"
            >
              ×
            </button>

          </div>

          <div className="p-4 flex gap-4">

            <img
              src={product.image_url}
              alt={product.name}
              className="w-20 h-20 object-cover bg-gray-100"
            />

            <div className="flex-1">

              <p className="text-xs uppercase tracking-widest text-black/40">
                {product.category}
              </p>

              <h3 className="font-medium mt-1">
                {product.name}
              </h3>

              <p className="text-black/60 mt-1">
                ₹{product.price}
              </p>

            </div>

          </div>

          <div className="px-4 pb-4 grid grid-cols-2 gap-2">

            <button
              type="button"
              onClick={() => {
                setCartPopup(false);
              }}
              className="border border-black py-2 text-sm hover:bg-black hover:text-white transition"
            >
              Continue Shopping
            </button>

            <button
              type="button"
              onClick={() => {
                setCartPopup(false);
                navigate("/cart");
              }}
              className="bg-black text-white py-2 text-sm hover:opacity-80 transition"
            >
              Go to Cart
            </button>

          </div>

        </div>
      )}

      {/* ================= HEADER ================= */}
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
              className="text-2xl hover:opacity-50 transition"
              aria-label="Wishlist"
            >
              {wishlist.length > 0 ? "♥" : "♡"}
            </button>

            {/* CART */}
            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="relative"
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

      {/* ================= PRODUCT ================= */}
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">

        <button
          type="button"
          onClick={() => navigate("/shop")}
          className="text-sm text-black/50 hover:text-black transition mb-10"
        >
          ← Back to Shop
        </button>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">

          {/* PRODUCT IMAGE */}
          <div className="relative aspect-square bg-gray-100 overflow-hidden">

            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />

            {/* WISHLIST */}
            <button
              type="button"
              onClick={toggleWishlist}
              className="absolute top-5 right-5 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-2xl hover:bg-black hover:text-white transition shadow-sm"
              aria-label={
                isInWishlist
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
            >
              {isInWishlist ? "♥" : "♡"}
            </button>

          </div>

          {/* PRODUCT INFORMATION */}
          <div className="flex flex-col justify-center">

            <p className="text-xs uppercase tracking-[0.3em] text-black/40">
              {product.category}
            </p>

            <h1 className="text-4xl md:text-5xl font-semibold mt-4">
              {product.name}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="text-2xl font-medium text-black">
                ₹{product.price}
              </span>

              {Number(product.mrp) > Number(product.price) && (
                <>
                  <span className="text-lg text-black/40 line-through">
                    ₹{product.mrp}
                  </span>

                  <span className="text-sm font-medium text-black border border-black/20 px-3 py-1">
                    {Math.round(
                      ((Number(product.mrp) - Number(product.price)) /
                        Number(product.mrp)) *
                        100
                    )}% OFF
                  </span>
                </>
              )}
            </div>

            {/* RATING */}
            <div className="flex items-center gap-3 mt-5">

              <span className="text-xl tracking-widest">
                {reviews.length > 0 ? "★★★★★" : "☆☆☆☆☆"}
              </span>

              <span className="text-sm text-black/50">
                {reviews.length > 0
                  ? `${averageRating} / 5 (${reviews.length} ${
                      reviews.length === 1 ? "review" : "reviews"
                    })`
                  : "No reviews yet"}
              </span>

            </div>

            {/* DESCRIPTION */}
            <div className="border-t border-black/10 mt-8 pt-8">

              <p className="text-black/60 leading-relaxed">
                {product.description}
              </p>

            </div>

            {/* QUANTITY */}
            <div className="mt-8">

              <p className="text-sm mb-3">
                Quantity
              </p>

              <div className="flex items-center border border-black w-fit">

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((value) =>
                      Math.max(1, value - 1)
                    )
                  }
                  className="px-5 py-3 hover:bg-black hover:text-white"
                >
                  −
                </button>

                <span className="px-6">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((value) => value + 1)
                  }
                  className="px-5 py-3 hover:bg-black hover:text-white"
                >
                  +
                </button>

              </div>

            </div>

            {/* ADD TO CART */}
            <button
              type="button"
              onClick={() => addProductToCart(true)}
              className="w-full bg-black text-white py-4 mt-8 text-sm tracking-wide hover:bg-black/80"
            >
              ADD TO CART →
            </button>

            {/* BUY NOW */}
            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full border border-black py-4 mt-4 text-sm tracking-wide hover:bg-black hover:text-white"
            >
              BUY NOW
            </button>

            {/* FEATURES */}
            <div className="border-t border-black/10 mt-10 pt-6 space-y-3 text-sm text-black/50">

              <p>✓ Premium quality accessories</p>
              <p>✓ Secure checkout</p>
              <p>✓ Free shipping only in Bhandup</p>

            </div>

          </div>

        </div>

        {/* ================= REVIEWS ================= */}
        <section className="border-t border-black/10 mt-20 pt-14">

          <div className="grid md:grid-cols-2 gap-12 lg:gap-20">

            {/* WRITE REVIEW */}
            <div>

              <p className="text-xs uppercase tracking-[0.3em] text-black/40">
                Customer Reviews
              </p>

              <h2 className="text-3xl md:text-4xl font-semibold mt-3">
                Leave a Review
              </h2>

              <form
                onSubmit={handleSubmitReview}
                className="mt-8 space-y-5"
              >

                {/* CUSTOMER NAME */}
                <div>

                  <label className="block text-sm mb-2">
                    Your Name
                  </label>

                  <input
                    type="text"
                    value={reviewName}
                    onChange={(event) =>
                      setReviewName(event.target.value)
                    }
                    placeholder="Enter your name"
                    className="w-full border border-black/20 px-4 py-3 outline-none focus:border-black"
                  />

                </div>

                {/* RATING */}
                <div>

                  <label className="block text-sm mb-2">
                    Your Rating
                  </label>

                  <div className="flex gap-2">

                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="text-3xl hover:scale-110 transition"
                        aria-label={`Rate ${star} stars`}
                      >
                        {star <= reviewRating ? "★" : "☆"}
                      </button>
                    ))}

                  </div>

                </div>

                {/* REVIEW TEXT */}
                <div>

                  <label className="block text-sm mb-2">
                    Your Review
                  </label>

                  <textarea
                    value={reviewText}
                    onChange={(event) =>
                      setReviewText(event.target.value)
                    }
                    placeholder="Write your review..."
                    rows={5}
                    className="w-full border border-black/20 px-4 py-3 outline-none focus:border-black resize-none"
                  />

                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full bg-black text-white py-4 text-sm tracking-wide hover:bg-black/80 disabled:opacity-50"
                >
                  {submittingReview
                    ? "SUBMITTING..."
                    : "SUBMIT REVIEW"}
                </button>

              </form>

            </div>

            {/* REVIEWS LIST */}
            <div>

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="text-2xl font-semibold">
                    Reviews
                  </h2>

                  <p className="text-sm text-black/50 mt-1">
                    {reviews.length > 0
                      ? `${averageRating} average rating`
                      : "Be the first to review this product"}
                  </p>

                </div>

              </div>

              {reviewsLoading ? (
                <p className="mt-8 text-black/50">
                  Loading reviews...
                </p>
              ) : reviews.length === 0 ? (
                <div className="border border-black/10 p-8 mt-8 text-center">

                  <p className="text-black/50">
                    No reviews yet.
                  </p>

                  <p className="text-sm text-black/40 mt-2">
                    Be the first customer to leave a review!
                  </p>

                </div>
              ) : (
                <div className="mt-8 space-y-6">

                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-black/10 pb-6"
                    >

                      <div className="flex items-center justify-between gap-4">

                        <div>

                          <p className="font-medium">
                            {review.customer_name}
                          </p>

                          <div className="text-sm tracking-widest mt-1">
                            {"★".repeat(Number(review.rating))}
                            {"☆".repeat(
                              5 - Number(review.rating)
                            )}
                          </div>

                        </div>

                        <p className="text-xs text-black/40">
                          {new Date(
                            review.created_at
                          ).toLocaleDateString()}
                        </p>

                      </div>

                      <p className="text-black/60 mt-4 leading-relaxed">
                        {review.review}
                      </p>

                    </div>
                  ))}

                </div>
              )}

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default ProductDetails;