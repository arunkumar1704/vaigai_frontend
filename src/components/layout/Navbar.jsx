import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";
import { resolveMediaUrl } from "../../api";
import { useSiteSettings } from "../../context/SiteSettingsContext";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/destinations", label: "Destinations" },
  { to: "/about", label: "About Us" },
  { to: "/packages", label: "Packages" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { settings } = useSiteSettings();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  const navBg = scrolled || !isHome ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-transparent";
  const linkColor = scrolled || !isHome ? "text-teal" : "text-white";

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <img
              src={resolveMediaUrl(settings.logo)}
              alt="Vaigai Tourism Logo"
              className="h-12 w-auto object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            <div className="hidden items-center gap-2">
              <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center font-display font-bold text-teal text-lg shadow-md">
                V
              </div>
              <div>
                <div className={`font-display font-bold text-xl leading-tight transition-colors ${linkColor}`}>
                  Vaigai
                </div>
                <div
                  className={`text-xs font-body font-medium tracking-widest uppercase transition-colors ${
                    scrolled || !isHome ? "text-gold-dark" : "text-gold-light"
                  }`}
                >
                  Tourism
                </div>
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-body font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? "text-gold-dark bg-gold/10"
                      : `${linkColor} hover:text-gold-dark hover:bg-gold/5`
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link to="/packages" className="ml-3 btn-primary text-sm py-2.5 px-6">
              Book a Tour
            </Link>
          </nav>

          <button
            onClick={() => setMobileOpen((open) => !open)}
            className={`md:hidden p-2 rounded-lg transition-colors ${linkColor}`}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <HiX size={26} /> : <HiMenu size={26} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <nav className="flex flex-col px-4 py-4 gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl font-body font-medium transition-colors ${
                      isActive ? "bg-gold/15 text-teal" : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <Link to="/packages" className="mt-2 btn-primary justify-center">
                Book a Tour
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
