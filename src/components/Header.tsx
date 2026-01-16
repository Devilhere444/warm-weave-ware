import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-lg py-3"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${
              scrolled ? "bg-primary" : "bg-white/20 backdrop-blur-md"
            }`}>
              <span className={`font-display text-xl font-bold ${
                scrolled ? "text-primary-foreground" : "text-white"
              }`}>
                L
              </span>
            </div>
            <div className="flex flex-col">
              <span className={`font-display text-xl font-bold tracking-wide transition-colors ${
                scrolled ? "text-foreground" : "text-white"
              }`}>
                Litho Art Press
              </span>
              <span className={`text-xs font-elegant tracking-widest uppercase transition-colors ${
                scrolled ? "text-muted-foreground" : "text-white/70"
              }`}>
                Bihar • Since 1985
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative font-elegant text-lg tracking-wide transition-colors ${
                  location.pathname === link.path
                    ? scrolled ? "text-primary" : "text-white"
                    : scrolled ? "text-foreground hover:text-primary" : "text-white/80 hover:text-white"
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent"
                  />
                )}
              </Link>
            ))}
            <Link to="/admin">
              <Button
                variant="outline"
                size="sm"
                className={`font-elegant tracking-wide transition-all ${
                  scrolled 
                    ? "border-primary text-primary hover:bg-primary hover:text-primary-foreground" 
                    : "border-white/30 text-white hover:bg-white/10"
                }`}
              >
                Admin
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 ${scrolled ? "text-foreground" : "text-white"}`}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-6 space-y-4">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`block font-elegant text-lg tracking-wide py-2 ${
                        location.pathname === link.path
                          ? "text-primary"
                          : "text-foreground"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link to="/admin" onClick={() => setIsOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full font-elegant tracking-wide"
                    >
                      Admin Panel
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
