import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Phone, MessageCircle, LogIn, UserPlus, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import CartIcon from "@/components/CartIcon";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { supabase } from "@/integrations/supabase/client";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Products", path: "/products" },
  { name: "Contact", path: "/contact" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const haptic = useHapticFeedback();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleCall = () => {
    if (settings.contact_phone) {
      window.location.href = `tel:${settings.contact_phone}`;
    }
  };

  const handleWhatsApp = () => {
    if (settings.whatsapp_number) {
      const number = settings.whatsapp_number.replace(/\D/g, '');
      window.open(`https://wa.me/${number}`, '_blank');
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-lg py-2"
          : "bg-background/80 backdrop-blur-md border-b border-border/50 py-3"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            {settings.logo_url ? (
              <img 
                src={settings.logo_url} 
                alt={settings.site_name} 
                className="w-10 h-10 object-contain rounded-lg transition-all duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex items-center gap-1">
                {/* Colorful leaf icon similar to reference */}
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="transition-transform group-hover:scale-105">
                  <path d="M20 8L26 20L20 32" fill="#10B981" />
                  <path d="M20 8L14 20L20 32" fill="#3B82F6" />
                  <path d="M12 14L20 20L12 26" fill="#F59E0B" />
                  <path d="M28 14L20 20L28 26" fill="#EC4899" />
                </svg>
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-display-bold text-xl tracking-wide text-primary">
                {settings.site_name.split(' ')[0]} <span className="text-foreground">{settings.site_name.split(' ').slice(1).join(' ')}</span>
              </span>
              <span className="text-[10px] font-body-medium tracking-[0.2em] uppercase text-muted-foreground">
                PRESS
              </span>
            </div>
          </Link>

          {/* Desktop Nav - Center */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative font-body-medium text-sm tracking-wide transition-all duration-300 px-4 py-2 rounded-lg ${
                  location.pathname === link.path
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Action Buttons - Right */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Call Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCall}
              className="font-body-medium text-sm gap-2 text-foreground hover:text-primary"
            >
              <Phone className="w-4 h-4" />
              Call
            </Button>

            {/* WhatsApp Button */}
            <Button
              size="sm"
              onClick={handleWhatsApp}
              className="font-body-semibold text-sm gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full px-4"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </Button>

            {/* Cart */}
            <CartIcon />

            {/* Login Button */}
            <Link to="/auth">
              <Button
                variant="outline"
                size="sm"
                className="font-body-medium text-sm gap-2 border-border text-foreground hover:bg-muted"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Button>
            </Link>

            {/* Register Button */}
            <Link to="/auth">
              <Button
                size="sm"
                className="font-display-semibold text-sm gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-5"
              >
                Register
              </Button>
            </Link>

            {isLoggedIn && (
              <Link to="/admin">
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-body-medium text-sm gap-1 text-muted-foreground hover:text-primary"
                >
                  <Shield className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => {
              haptic.triggerLight();
              setIsOpen(!isOpen);
            }}
            className="lg:hidden p-2 text-foreground touch-target btn-snappy"
            aria-label={isOpen ? "Close menu" : "Open menu"}
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
              <div className="py-6 space-y-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`block font-body-medium text-lg tracking-wide py-3 px-2 rounded-lg touch-target ${
                        location.pathname === link.path
                          ? "text-primary bg-primary/10"
                          : "text-foreground active:bg-muted/50"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile Action Buttons */}
                <div className="pt-4 space-y-3 border-t border-border">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { handleCall(); setIsOpen(false); }}
                      className="flex-1 font-body-medium gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Call
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => { handleWhatsApp(); setIsOpen(false); }}
                      className="flex-1 font-body-semibold gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </Button>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link to="/auth" onClick={() => setIsOpen(false)} className="flex-1">
                      <Button variant="outline" className="w-full font-body-medium gap-2">
                        <LogIn className="w-4 h-4" />
                        Login
                      </Button>
                    </Link>
                    <Link to="/auth" onClick={() => setIsOpen(false)} className="flex-1">
                      <Button className="w-full font-display-semibold gap-2 bg-primary">
                        Register
                      </Button>
                    </Link>
                  </div>

                  {isLoggedIn && (
                    <Link to="/admin" onClick={() => setIsOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full font-body-medium tracking-wide gap-2"
                      >
                        <Shield className="w-4 h-4" />
                        Admin Panel
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
