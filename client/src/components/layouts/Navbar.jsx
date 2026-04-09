import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import userIcon from "../../assets/icons/user_icon.png";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedName = localStorage.getItem("userName");

    setToken(storedToken);
    setUserName(storedName);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Stations", path: "/stations" },
    { name: "Dashboard", path: "/dashboard" },
  ];

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");

    setToken(null);
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-5 py-3 flex justify-between items-center">

        {/* 🔥 LOGO */}
        <Link to="/" className="flex items-center gap-2">
          {/* You can replace with your image */}
          <img
            src="/logo.png"
            alt="Voltify Logo"
            className="h-14 object-contain"
          />
        </Link>

        {/* 🖥️ DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, index) => (
            <NavLink
              key={index}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive
                  ? "text-cyan-400"
                  : "text-gray-300 hover:text-white"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          {/* CTA Button */}
      {token ? (
  <div className="flex items-center gap-3 relative">
    <img
      src={userIcon}
      alt="user"
      className="w-8 h-8 rounded-full border"
    />
    <span className="text-white text-sm">
      {userName}
    </span>

    <button
      onClick={handleLogout}
      className="ml-2 px-3 py-1 bg-red-500 text-white rounded"
    >
      Logout
    </button>
  </div>
) : (
  <Link
    to="/login"
    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold"
  >
    Login
  </Link>
)}
        </div>

        {/* 📱 MOBILE MENU BUTTON */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <X className="text-white" size={26} />
            ) : (
              <Menu className="text-white" size={26} />
            )}
          </button>
        </div>
      </div>

      {/* 📱 MOBILE MENU */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-black border-t border-white/10 px-5 py-4 space-y-4"
        >
          {navLinks.map((link, index) => (
            <NavLink
              key={index}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block text-base ${isActive
                  ? "text-cyan-400"
                  : "text-gray-300 hover:text-white"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          {token ? (
            <div
              className="relative"
              onMouseEnter={() => setOpen(true)}
              onMouseLeave={() => setOpen(false)}
            >
              {/* USER INFO */}
              <div className="flex items-center gap-2 cursor-pointer">
                <img
                  src={userIcon}
                  alt="user"
                  className="w-8 h-8 rounded-full border"
                />

                <span className="text-sm font-medium text-gray-700">
                  Hi, {userName}
                </span>
              </div>

              {open && (
                <div className="absolute right-0 mt-3 w-40 bg-white border rounded-xl shadow-lg p-2 z-50">

                  <button
                    onClick={() => navigate("/dashboard")}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                  >
                    Dashboard
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded"
                  >
                    Logout
                  </button>

                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg"
            >
              Login
            </button>
          )}
        </motion.div>
      )}
    </nav>
  );
}

export default Navbar;