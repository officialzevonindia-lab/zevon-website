import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-[0.3em]">
            ZEVON
          </h1>

          <p className="mt-3 text-white/50 tracking-wide">
            ADMIN LOGIN
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="border border-white/20 p-6 md:p-8"
        >

          <div>
            <label className="block text-sm mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin email"
              required
              className="w-full bg-white text-black px-4 py-3 outline-none"
            />
          </div>

          <div className="mt-5">
            <label className="block text-sm mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full bg-white text-black px-4 py-3 outline-none"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm mt-4">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-4 mt-7 tracking-wide hover:bg-white/80 disabled:opacity-50"
          >
            {loading ? "LOGGING IN..." : "LOGIN"}
          </button>

        </form>

        <button
          onClick={() => navigate("/")}
          className="block mx-auto mt-6 text-sm text-white/50 hover:text-white"
        >
          ← Back to website
        </button>

      </div>
    </div>
  );
}

export default AdminLogin;