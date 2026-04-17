import { useState } from "react";
import API from "../api/axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const [state, setState] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const email = localStorage.getItem("userEmail");
  const isAdmin = email === "admin@gmail.com";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitch = (newState) => {
    setState(newState);
    setFormData({ name: "", email: "", password: "" });
    setShowPassword(false);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    if (state === "login") {
      const res = await API.post("/api/auth/login", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", res.data.name);
      localStorage.setItem("userRole", res.data.role);

      toast.success("Login successful");
      console.log(res.data);

      navigate(from, { replace: true });

    } else {
      await API.post("/api/auth/register", formData);
      toast.success("Account created. Please login");
      handleSwitch("login");
    }
  } catch (err) {
    toast.error(err.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white border border-gray-200 rounded-3xl shadow-xl overflow-hidden">

          <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />

          <div className="flex border-b border-gray-100">
            {["login", "register"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => handleSwitch(tab)}
                className={`relative flex-1 py-4 text-sm font-medium transition ${state === tab
                  ? "text-cyan-600"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {tab === "login" ? "Login" : "Register"}
                {state === tab && (
                  <motion.div
                    layoutId="authTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500"
                  />
                )}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {state === "login" ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {state === "login"
                  ? "Login to continue"
                  : "Register to get started"}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {state === "register" && (
                <motion.div
                  key="nameField"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                    Full Name
                  </label>
                  <div className="flex items-center h-12 px-4 gap-3 border border-gray-200 rounded-xl bg-gray-50 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-100 transition">
                    <User size={18} className="text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                Email Address
              </label>
              <div className="flex items-center h-12 px-4 gap-3 border border-gray-200 rounded-xl bg-gray-50 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-100 transition">
                <Mail size={18} className="text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                Password
              </label>
              <div className="flex items-center h-12 px-4 gap-3 border border-gray-200 rounded-xl bg-gray-50 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-100 transition">
                <Lock size={18} className="text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {state === "login" && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-xs text-cyan-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold text-sm shadow-md hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : state === "login" ? (
                "Login"
              ) : (
                "Create Account"
              )}
            </button>

            <p className="text-center text-sm text-gray-500">
              {state === "login"
                ? "Don't have an account?"
                : "Already have an account?"}
              <button
                type="button"
                onClick={() =>
                  handleSwitch(state === "login" ? "register" : "login")
                }
                className="ml-1 text-cyan-600 font-medium hover:underline"
              >
                {state === "login" ? "Register" : "Login"}
              </button>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;