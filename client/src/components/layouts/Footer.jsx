import { Link } from "react-router-dom";
import { MapPin, Mail, Phone } from "lucide-react";
import { FaTwitter, FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-black/70 backdrop-blur-xl border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/">
              <img src="/logo.png" alt="Voltify" className="h-12 w-auto object-contain" />
            </Link>
            <p className="text-sm text-gray-400 mt-3 leading-relaxed">
              Find & book EV charging stations near you. Fast, simple, reliable.
            </p>

            <div className="mt-4 space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin size={13} className="text-gray-500" />
                Kota, Rajasthan, India
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Mail size={13} className="text-gray-500" />
                support@voltify.in
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Phone size={13} className="text-gray-500" />
                +91 98765 43210
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: "Home", path: "/" },
                { name: "Stations", path: "/stations" },
                { name: "Dashboard", path: "/dashboard" },
                { name: "Book a Slot", path: "/stations" },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm text-gray-400 hover:text-cyan-400 transition">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Support</h4>
            <ul className="space-y-2">
              {[
                { name: "Help Center", path: "/" },
                { name: "FAQs", path: "/" },
                { name: "Privacy Policy", path: "/" },
                { name: "Terms of Service", path: "/" },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm text-gray-400 hover:text-cyan-400 transition">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Follow Us</h4>
            <div className="flex flex-wrap gap-2.5">
              {[
                { icon: FaTwitter, href: "#", label: "Twitter" },
                { icon: FaInstagram, href: "#", label: "Instagram" },
                { icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
                { icon: FaGithub, href: "#", label: "GitHub" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-500/10 transition"
                >
                  <s.icon size={16} />
                </a>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4 leading-relaxed">
              Stay updated with latest stations and features.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Voltify. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <Link to="/" className="hover:text-gray-300 transition">Privacy</Link>
            <Link to="/" className="hover:text-gray-300 transition">Terms</Link>
            <Link to="/" className="hover:text-gray-300 transition">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;