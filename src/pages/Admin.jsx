import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const categories = [
  "Rings",
  "Charms",
  "Neckpieces",
  "Keychains",
  "Pendants",
];

const orderStatuses = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

function Admin() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "Rings",
    description: "",
    image_url: "",
  });

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  // ---------------- LOGOUT ----------------

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
      alert("Could not log out. Please try again.");
      return;
    }

    navigate("/admin-login", { replace: true });
  };

  // ---------------- ORDERS ----------------

  const fetchOrders = async () => {
    setLoadingOrders(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      setLoadingOrders(false);
      return;
    }

    setOrders(data || []);
    setLoadingOrders(false);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrder(orderId);

    const { error } = await supabase
      .from("orders")
      .update({
        status: newStatus,
      })
      .eq("id", orderId);

    if (error) {
      console.error("Error updating order status:", error);
      alert("Could not update order status.");
      setUpdatingOrder(null);
      return;
    }

    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
            }
          : order
      )
    );

    setUpdatingOrder(null);
  };

  // ---------------- PRODUCTS ----------------

  const fetchProducts = async () => {
    setLoadingProducts(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching products:", error);
      setLoadingProducts(false);
      return;
    }

    setProducts(data || []);
    setLoadingProducts(false);
  };

  // ---------------- FORM ----------------

  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      category: "Rings",
      description: "",
      image_url: "",
    });

    setEditingProduct(null);
    setShowAddForm(false);
  };

  const handleFormChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ---------------- IMAGE UPLOAD ----------------

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      alert("Image must be smaller than 5MB.");
      return;
    }

    setUploadingImage(true);

    try {
      const fileExtension = file.name.split(".").pop();

      const safeFileName = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9-_]/g, "-")
        .toLowerCase();

      const fileName = `${Date.now()}-${safeFileName}.${fileExtension}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Image upload error:", uploadError);
        alert(
          "Image upload failed. Please check Supabase Storage permissions."
        );
        setUploadingImage(false);
        return;
      }

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      if (!data?.publicUrl) {
        alert("Could not get image URL.");
        setUploadingImage(false);
        return;
      }

      setForm((currentForm) => ({
        ...currentForm,
        image_url: data.publicUrl,
      }));

      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Something went wrong while uploading the image.");
    }

    setUploadingImage(false);
  };

  // ---------------- ADD PRODUCT ----------------

  const addProduct = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.category) {
      alert("Please fill in the product name, price and category.");
      return;
    }

    const { error } = await supabase.from("products").insert([
      {
        name: form.name,
        price: Number(form.price),
        category: form.category,
        description: form.description,
        image_url: form.image_url,
      },
    ]);

    if (error) {
      console.error("Error adding product:", error);
      alert("Could not add product. Check Supabase permissions.");
      return;
    }

    alert("Product added successfully!");

    resetForm();
    fetchProducts();
  };

  // ---------------- EDIT PRODUCT ----------------

  const startEditing = (product) => {
    setEditingProduct(product);

    setForm({
      name: product.name || "",
      price: product.price || "",
      category: product.category || "Rings",
      description: product.description || "",
      image_url: product.image_url || "",
    });

    setShowAddForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const updateProduct = async (e) => {
    e.preventDefault();

    if (!editingProduct) return;

    const { error } = await supabase
      .from("products")
      .update({
        name: form.name,
        price: Number(form.price),
        category: form.category,
        description: form.description,
        image_url: form.image_url,
      })
      .eq("id", editingProduct.id);

    if (error) {
      console.error("Error updating product:", error);
      alert("Could not update product. Check Supabase permissions.");
      return;
    }

    alert("Product updated successfully!");

    resetForm();
    fetchProducts();
  };

  // ---------------- DELETE PRODUCT ----------------

  const deleteProduct = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (error) {
      console.error("Error deleting product:", error);
      alert("Could not delete product. Check Supabase permissions.");
      return;
    }

    alert("Product deleted successfully!");

    fetchProducts();
  };

  // ---------------- STATUS STYLE ----------------

  const getStatusClass = (status) => {
    switch (status) {
      case "confirmed":
        return "border-blue-300 bg-blue-50";

      case "shipped":
        return "border-purple-300 bg-purple-50";

      case "delivered":
        return "border-green-300 bg-green-50";

      case "cancelled":
        return "border-red-300 bg-red-50";

      default:
        return "border-yellow-300 bg-yellow-50";
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-6 md:p-10">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-wide">
              ZEVON Admin Panel
            </h1>

            <p className="mt-2 text-black/60">
              Manage products and customer orders
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                if (showAddForm) {
                  resetForm();
                } else {
                  setShowAddForm(true);
                }
              }}
              className="bg-black text-white px-6 py-3 text-sm tracking-wide hover:bg-black/80"
            >
              {showAddForm ? "CANCEL" : "+ ADD PRODUCT"}
            </button>

            <button
              onClick={handleLogout}
              className="border border-black px-6 py-3 text-sm tracking-wide hover:bg-black hover:text-white"
            >
              LOGOUT
            </button>
          </div>
        </div>

        {/* PRODUCT FORM */}

        {showAddForm && (
          <div className="border border-black/10 rounded-lg p-6 mt-10">
            <h2 className="text-2xl font-semibold">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>

            <form
              onSubmit={editingProduct ? updateProduct : addProduct}
              className="mt-6 space-y-5"
            >
              <div>
                <label className="block text-sm font-medium mb-2">
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  placeholder="Enter product name"
                  className="w-full border border-black/20 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleFormChange}
                  placeholder="Enter price"
                  className="w-full border border-black/20 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Category
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleFormChange}
                  className="w-full border border-black/20 px-4 py-3 bg-white outline-none focus:border-black"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  placeholder="Enter product description"
                  rows="4"
                  className="w-full border border-black/20 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Product Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="w-full border border-black/20 px-4 py-3 bg-white"
                />

                {uploadingImage && (
                  <p className="text-sm text-black/60 mt-3">
                    Uploading image...
                  </p>
                )}

                {form.image_url && (
                  <div className="mt-4">
                    <p className="text-sm text-black/50 mb-2">
                      Image Preview
                    </p>

                    <div className="w-40 h-40 bg-gray-100 overflow-hidden">
                      <img
                        src={form.image_url}
                        alt="Product Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="bg-black text-white px-8 py-3 text-sm tracking-wide hover:bg-black/80 disabled:opacity-50"
                >
                  {editingProduct ? "UPDATE PRODUCT" : "ADD PRODUCT"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="border border-black px-8 py-3 text-sm tracking-wide hover:bg-black hover:text-white"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        )}

        {/* PRODUCT MANAGEMENT */}

        <section className="mt-16">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold">
                Products
              </h2>

              <p className="text-black/50 mt-1">
                Add, edit or delete products
              </p>
            </div>

            <span className="text-sm text-black/50">
              {products.length} products
            </span>
          </div>

          {loadingProducts ? (
            <p className="mt-8">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="mt-8 text-black/60">
              No products found.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="border border-black/10 rounded-lg overflow-hidden"
                >
                  <div className="aspect-square bg-gray-100">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-black/40">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <p className="text-xs uppercase tracking-widest text-black/40">
                      {product.category}
                    </p>

                    <h3 className="text-lg font-semibold mt-2">
                      {product.name}
                    </h3>

                    <p className="text-lg mt-2">
                      ₹{product.price}
                    </p>

                    <p className="text-sm text-black/50 mt-3 line-clamp-3">
                      {product.description}
                    </p>

                    <div className="flex gap-3 mt-5">
                      <button
                        onClick={() => startEditing(product)}
                        className="flex-1 border border-black px-4 py-3 text-sm hover:bg-black hover:text-white"
                      >
                        EDIT
                      </button>

                      <button
                        onClick={() => deleteProduct(product)}
                        className="flex-1 bg-black text-white px-4 py-3 text-sm hover:bg-black/80"
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ORDERS */}

        <section className="mt-20">
          <h2 className="text-2xl md:text-3xl font-semibold">
            Customer Orders
          </h2>

          <p className="mt-1 text-black/50">
            View and manage orders placed by customers
          </p>

          {loadingOrders ? (
            <p className="mt-8">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="mt-8 text-black/60">
              No orders found.
            </p>
          ) : (
            <div className="mt-8 space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-black/10 p-6 rounded-lg"
                >
                  <div className="flex flex-col md:flex-row md:justify-between gap-5">
                    <div>

                      {/* ORDER ID */}
                      <p className="text-sm font-medium text-black/50 mb-1">
                        Order ID: ZEVON-{order.id}
                      </p>

                      <h2 className="text-xl font-semibold">
                        {order.full_name}
                      </h2>

                      <p className="text-sm text-black/60 mt-1">
                        {order.email}
                      </p>

                      <p className="text-sm text-black/60">
                        {order.phone}
                      </p>
                    </div>

                    <div className="md:text-right">
                      <p className="font-semibold text-lg">
                        ₹{Number(order.total_amount).toLocaleString("en-IN")}
                      </p>

                      <p className="text-sm text-black/60 mt-1">
                        Payment: {order.payment_method}
                      </p>

                      {/* STATUS */}

                      <div className="mt-3">
                        <label className="text-sm font-medium mr-2">
                          Order Status:
                        </label>

                        <select
                          value={order.status || "pending"}
                          disabled={updatingOrder === order.id}
                          onChange={(e) =>
                            updateOrderStatus(
                              order.id,
                              e.target.value
                            )
                          }
                          className={`mt-2 md:mt-0 border px-3 py-2 text-sm capitalize outline-none ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {orderStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>

                        {updatingOrder === order.id && (
                          <span className="text-xs text-black/50 ml-2">
                            Saving...
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ADDRESS */}

                  <div className="border-t border-black/10 mt-5 pt-5">
                    <p className="text-sm">
                      <strong>Address:</strong> {order.address}
                    </p>

                    <p className="text-sm mt-1">
                      <strong>City:</strong> {order.city}
                    </p>

                    <p className="text-sm mt-1">
                      <strong>Pincode:</strong> {order.pincode}
                    </p>
                  </div>

                  {/* PRODUCTS */}

                  <div className="border-t border-black/10 mt-5 pt-5">
                    <h3 className="font-semibold mb-3">
                      Products
                    </h3>

                    {Array.isArray(order.items) &&
                      order.items.map((item, index) => {
                        const itemPrice =
                          typeof item.price === "number"
                            ? item.price
                            : Number(
                                String(item.price)
                                  .replace("₹", "")
                                  .replace(/,/g, "")
                              );

                        return (
                          <div
                            key={`${item.id}-${index}`}
                            className="flex justify-between text-sm py-2"
                          >
                            <span>
                              {item.name} × {item.quantity}
                            </span>

                            <span>
                              ₹
                              {(
                                itemPrice * item.quantity
                              ).toLocaleString("en-IN")}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Admin;