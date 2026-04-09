import { useState } from "react";
import API from "../api/axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState("login");

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (state === "login") {
        const res = await API.post("/api/auth/login", formData);

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userName", res.data.name);

        toast.success("Login successful ⚡");

        navigate(from, { replace: true });

        window.location.reload();
      } else {
        await API.post("/api/auth/register", formData);

        toast.success("Account created 🎉");
        setState("login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-white to-blue-50">

      <form
        onSubmit={handleSubmit}
        className="sm:w-[360px] w-full text-center border border-gray-200 rounded-3xl px-8 bg-white shadow-xl"
      >
        {/* TITLE */}
        <h1 className="text-gray-900 text-3xl mt-10 font-semibold">
          {state === "login" ? "Welcome Back" : "Create Account"}
        </h1>

        <p className="text-gray-500 text-sm mt-2">
          {state === "login" ? "Login to continue" : "Signup to get started"}
        </p>

        {/* NAME */}
        {state !== "login" && (
          <div className="flex items-center mt-6 border border-gray-200 h-12 rounded-full px-4 gap-3 bg-gray-50">

            {/* USER ICON */}
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round-icon lucide-user-round"><circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" /></svg>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400"
              required
            />
          </div>
        )}

        {/* EMAIL */}
        <div className="flex items-center mt-4 border border-gray-200 h-12 rounded-full px-4 gap-3 bg-gray-50">

          {/* EMAIL ICON */}
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail-icon lucide-mail"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /><rect x="2" y="4" width="20" height="16" rx="2" /></svg>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400"
            required
          />
        </div>

        {/* PASSWORD */}
        <div className="flex items-center mt-4 border border-gray-200 h-12 rounded-full px-4 gap-3 bg-gray-50">

          {/* LOCK ICON */}
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock-icon lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400"
            required
          />
        </div>

        {/* FORGOT */}
        {state === "login" && (
          <div className="mt-4 text-left">
            <button type="button" className="text-sm text-cyan-600 hover:underline">
              Forgot password?
            </button>
          </div>
        )}

        {/* BUTTON 🔥 */}
        <button className="group relative mt-6 w-full px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-2xl font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300">
          {state === "login" ? "Login" : "Sign up"}
        </button>

        {/* SWITCH */}
        <p className="text-gray-500 text-sm mt-5 mb-10">
          {state === "login"
            ? "Don't have an account?"
            : "Already have an account?"}

          <span
            onClick={() =>
              setState((prev) =>
                prev === "login" ? "register" : "login"
              )
            }
            className="text-cyan-600 cursor-pointer ml-1 hover:underline"
          >
            click here
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;