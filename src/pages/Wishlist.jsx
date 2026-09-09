import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Wishlist() {
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem("zevon-wishlist");

    try {
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch {
      return [];
    }
  });

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlist.filter(
      (product) => product.id !== productId
    );

    setWishlist(updatedWishlist);
    localStorage.setItem(
      "zevon-wishlist",
      JSON.stringify(updatedWishlist)
    );
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

  return (
    <div className="min-h-screen bg-white text-black">

      {/* HEADER */}

      <header className="border-b border-black/10 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-2xl font-bold tracking-[0.3em]"
          >
            ZEVON
          </button>

          <button
            type="button"
            onClick={() => navigate("/shop")}
            className="text-sm hover:opacity-50"
          >
            Continue Shopping
          </button>

        </div>
      </header>

      {/* WISHLIST */}

      <main className="max-w-7xl mx-auto px-6 py-16">

        <div className="mb-12">

          <p className="text-xs tracking-[0.3em] uppercase text-black/50">
            Your favourites
          </p>

          <h1 className="text-4xl md:text-5xl font-semibold mt-3">
            Wishlist
          </h1>

        </div>

        {wishlist.length === 0 ? (

          <div className="text-center py-24 border border-black/10">

            <div className="text-5xl mb-6">
              ♡
            </div>

            <h2 className="text-2xl font-medium">
              Your wishlist is empty
            </h2>

            <p className="text-black/50 mt-3">
              Save your favourite ZEVON pieces here.
            </p>

            <button
              type="button"
              onClick={() => navigate("/shop")}
              className="mt-8 bg-black text-white px-8 py-4 text-sm tracking-[0.15em]"
            >
              SHOP NOW →
            </button>

          </div>

        ) : (

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

            {wishlist.map((product) => (

              <div key={product.id}>

                <button
                  type="button"
                  onClick={() => openProduct(product)}
                  className="w-full text-left"
                >

                  <div className="aspect-square bg-gray-100 overflow-hidden">

                    {product.image_url && (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition duration-700"
                      />
                    )}

                  </div>

                </button>

                <div className="mt-4">

                  <h3 className="font-medium">
                    {product.name}
                  </h3>

                  <p className="text-black/60 mt-1">
                    ₹{product.price}
                  </p>

                  <button
                    type="button"
                    onClick={() => removeFromWishlist(product.id)}
                    className="mt-4 text-sm text-red-500 hover:text-red-700"
                  >
                    Remove ♡
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}

export default Wishlist;