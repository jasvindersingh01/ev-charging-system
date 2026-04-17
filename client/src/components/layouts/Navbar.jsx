import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Menu, X, ChevronDown, LayoutDashboard,
  ShieldCheck, LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
 const [isOpen, setIsOpen] = useState(false);
const [profileOpen, setProfileOpen] = useState(false);
const [token, setToken] = useState(null);
const [userName, setUserName] = useState("");
const [userRole, setUserRole] = useState("");

const navigate = useNavigate();
const location = useLocation();
const profileRef = useRef(null);

useEffect(() => {
  const storedToken = localStorage.getItem("token");
  const storedName = localStorage.getItem("userName");
  const storedRole = localStorage.getItem("userRole");

  setToken(storedToken);
  setUserName(storedName || "");
  setUserRole(storedRole || "user");
}, [location]); 

// role check
const isAdmin = userRole === "admin";

// outside click
useEffect(() => {
  const handleClickOutside = (e) => {
    if (profileRef.current && !profileRef.current.contains(e.target)) {
      setProfileOpen(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

// nav links
const navLinks = [
  { name: "Home", path: "/" },
  { name: "Stations", path: "/stations" },

  ...(token && !isAdmin
    ? [{ name: "Dashboard", path: "/dashboard" }]
    : []),

  ...(token && isAdmin
    ? [{ name: "Admin Panel", path: "/admin" }]
    : []),
];

// logout
const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userName");
  localStorage.removeItem("userRole");

  setToken(null);
  setUserName("");
  setUserRole("");
  setProfileOpen(false);
  setIsOpen(false);

  navigate("/login");
};

  const avatarLetter = userName ? userName.charAt(0).toUpperCase() : "U";

  return (
    <nav className="fixed top-0 left-0 w-full z-[9999] border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="Voltify Logo"
            className="h-16 w-auto object-contain"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, index) => (
            <NavLink
              key={index}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-medium transition flex items-center gap-1.5 ${isActive ? "text-cyan-400" : "text-gray-300 hover:text-white"
                }`
              }
            >
              {/* Admin link ke saath shield icon */}
              {link.name === "Admin Panel" && (
                <ShieldCheck size={14} className="text-amber-400" />
              )}
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-3">
          {token ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
              >
                {/* Avatar */}
                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold ${isAdmin
                  ? "bg-gradient-to-br from-amber-500 to-orange-600"
                  : "bg-gradient-to-br from-cyan-500 to-blue-600"
                  }`}>
                  {avatarLetter}
                </div>

                <div className="text-left">
                  <p className="text-sm font-semibold text-white leading-none">
                    {userName || "User"}
                  </p>
                  <p className={`text-xs mt-1 ${isAdmin ? "text-amber-400" : "text-gray-400"
                    }`}>
                    {isAdmin ? "Administrator" : "User Account"}
                  </p>
                </div>

                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition ${profileOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {/* Dropdown */}
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    className="absolute right-0 mt-3 w-64 rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden"
                  >
                    {/* Profile Header */}
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className={`h-11 w-11 rounded-full flex items-center justify-center text-white font-semibold ${isAdmin
                          ? "bg-gradient-to-br from-amber-500 to-orange-600"
                          : "bg-gradient-to-br from-cyan-500 to-blue-600"
                          }`}>
                          {avatarLetter}
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">
                            {userName || "User"}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {isAdmin && (
                              <ShieldCheck size={12} className="text-amber-500" />
                            )}
                            <p className={`text-xs ${isAdmin ? "text-amber-600 font-medium" : "text-gray-500"
                              }`}>
                              {isAdmin ? "Admin Account" : "Customer Account"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      {isAdmin ? (
                        <>
                          <button
                            onClick={() => { navigate("/admin"); setProfileOpen(false); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-100 transition"
                          >
                            <ShieldCheck size={16} className="text-amber-500" />
                            Admin Panel
                          </button>
                          <button
                            onClick={() => { navigate("/dashboard"); setProfileOpen(false); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-100 transition"
                          >
                            <LayoutDashboard size={16} className="text-cyan-600" />
                            Dashboard
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => { navigate("/dashboard"); setProfileOpen(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-100 transition"
                        >
                          <LayoutDashboard size={16} className="text-cyan-600" />
                          My Dashboard
                        </button>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-200 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold shadow-lg shadow-cyan-500/20 hover:opacity-90 transition"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Button */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-xl"
          >
            <div className="px-4 py-5 space-y-5">
              {/* Mobile Profile Card */}
              {token && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className={`h-11 w-11 rounded-full flex items-center justify-center text-white font-semibold ${isAdmin
                    ? "bg-gradient-to-br from-amber-500 to-orange-600"
                    : "bg-gradient-to-br from-cyan-500 to-blue-600"
                    }`}>
                    {avatarLetter}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{userName || "User"}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {isAdmin && <ShieldCheck size={11} className="text-amber-400" />}
                      <p className={`text-xs ${isAdmin ? "text-amber-400" : "text-gray-400"}`}>
                        {isAdmin ? "Administrator" : "User Account"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Nav Links */}
              <div className="space-y-2">
                {navLinks.map((link, index) => (
                  <NavLink
                    key={index}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition ${isActive
                        ? "bg-cyan-500/10 text-cyan-400"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                      }`
                    }
                  >
                    {link.name === "Admin Panel" && <ShieldCheck size={14} className="text-amber-400" />}
                    {link.name}
                  </NavLink>
                ))}
              </div>

              {/* Mobile Actions */}
              {token ? (
                <div className="space-y-2 pt-2 border-t border-white/10">
                  {isAdmin && (
                    <button
                      onClick={() => { navigate("/admin"); setIsOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:bg-white/5"
                    >
                      <ShieldCheck size={16} className="text-amber-400" />
                      Admin Panel
                    </button>
                  )}

                  <button
                    onClick={() => { navigate("/dashboard"); setIsOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:bg-white/5"
                  >
                    <LayoutDashboard size={16} className="text-cyan-400" />
                    {isAdmin ? "Dashboard" : "My Dashboard"}
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 pt-2 border-t border-white/10">
                  <button
                    onClick={() => { navigate("/login"); setIsOpen(false); }}
                    className="w-full py-2.5 rounded-xl border border-white/10 text-white text-sm"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { navigate("/register"); setIsOpen(false); }}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;