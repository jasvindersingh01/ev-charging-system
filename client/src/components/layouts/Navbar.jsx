import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Zap } from "lucide-react";
import { motion } from "framer-motion";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Stations", path: "/stations" },
    { name: "Dashboard", path: "/dashboard" },
  ];

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
                `text-sm font-medium transition ${
                  isActive
                    ? "text-cyan-400"
                    : "text-gray-300 hover:text-white"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          {/* CTA Button */}
          <Link
            to="/login"
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition"
          >
            Login
          </Link>
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
                `block text-base ${
                  isActive
                    ? "text-cyan-400"
                    : "text-gray-300 hover:text-white"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          <Link
            to="/login"
            onClick={() => setIsOpen(false)}
            className="block text-center px-4 py-2 rounded-lg bg-cyan-500 text-black font-semibold"
          >
            Login
          </Link>
        </motion.div>
      )}
    </nav>
  );
}

export default Navbar;