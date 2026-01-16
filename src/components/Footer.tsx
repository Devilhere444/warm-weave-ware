import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, ArrowUpRight, Heart, MessageCircle, Sparkles } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 }
  }
};

const linkHoverVariants: Variants = {
  initial: { x: 0 },
  hover: { x: 8, transition: { type: "spring" as const, stiffness: 400, damping: 20 } }
};

export default function Footer() {
  const { settings } = useSiteSettings();

  const socialLinks = [
    { name: "facebook", url: settings.facebook_url },
    { name: "twitter", url: settings.twitter_url },
    { name: "instagram", url: settings.instagram_url },
  ].filter(s => s.url);

  return (
    <footer className="relative bg-foreground text-background overflow-hidden">
      {/* Animated Decorative Background */}
      <div className="absolute inset-0 opacity-5">
        <motion.div 
          className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary blur-[150px]"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-accent blur-[120px]"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.05, 0.08, 0.05]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* Subtle Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--background)) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      <motion.div 
        className="container mx-auto px-4 lg:px-8 py-20 relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center gap-3 group">
              <motion.div 
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.05 }}
                transition={{ duration: 0.5 }}
              >
                <span className="font-display-bold text-xl text-white">
                  {settings.site_name.charAt(0)}
                </span>
              </motion.div>
              <div>
                <span className="font-display-bold text-xl block text-background">
                  {settings.site_name}
                </span>
                <span className="text-xs text-background/60 font-body-medium tracking-widest uppercase">
                  {settings.site_tagline || "Bihar"}
                </span>
              </div>
            </div>
            <p className="text-background/70 font-body-regular text-sm leading-relaxed">
              {settings.footer_text || "Crafting premium printing solutions with a perfect blend of tradition and technology since 1985."}
            </p>
            
            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                    whileHover={{ scale: 1.15, y: -5, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-lg bg-background/10 hover:bg-primary flex items-center justify-center transition-colors"
                  >
                    <span className="text-xs font-display-bold text-background capitalize">
                      {social.name.charAt(0).toUpperCase()}
                    </span>
                  </motion.a>
                ))}
              </div>
            )}
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="font-display-semibold text-lg mb-6 text-background flex items-center gap-2">
              Quick Links
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 text-primary" />
              </motion.div>
            </h4>
            <ul className="space-y-4">
              {[
                { name: "Home", path: "/" },
                { name: "Products", path: "/products" },
                { name: "About Us", path: "/about" },
                { name: "FAQ", path: "/faq" },
                { name: "Contact", path: "/contact" },
              ].map((link, index) => (
                <motion.li 
                  key={link.path}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <Link to={link.path}>
                    <motion.div
                      className="group flex items-center gap-2 text-background/70 hover:text-background transition-colors font-body-regular"
                      variants={linkHoverVariants}
                      initial="initial"
                      whileHover="hover"
                    >
                      <span className="relative">
                        {link.name}
                        <motion.span 
                          className="absolute bottom-0 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300"
                        />
                      </span>
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-y-1 group-hover:translate-y-0" />
                    </motion.div>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={itemVariants}>
            <h4 className="font-display-semibold text-lg mb-6 text-background">
              Our Services
            </h4>
            <ul className="space-y-4">
              {[
                { name: "Book Printing", path: "/products?category=book-printing" },
                { name: "Packaging Design", path: "/products?category=packaging" },
                { name: "Business Stationery", path: "/products?category=stationery" },
                { name: "Wedding Cards", path: "/products?category=invitations" },
                { name: "Commercial Printing", path: "/products?category=commercial" },
                { name: "Labels & Stickers", path: "/products?category=labels" },
              ].map((service, index) => (
                <motion.li 
                  key={service.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.35 + index * 0.05 }}
                >
                  <Link to={service.path}>
                    <motion.div
                      className="group flex items-center gap-2 text-background/70 hover:text-background transition-colors font-body-regular"
                      variants={linkHoverVariants}
                      initial="initial"
                      whileHover="hover"
                    >
                      <span className="relative">
                        {service.name}
                        <motion.span 
                          className="absolute bottom-0 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-300"
                        />
                      </span>
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-y-1 group-hover:translate-y-0" />
                    </motion.div>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants}>
            <h4 className="font-display-semibold text-lg mb-6 text-background">
              Contact Us
            </h4>
            <ul className="space-y-5">
              {settings.contact_address && (
                <li>
                  <motion.a 
                    href="#" 
                    className="flex items-start gap-4 group"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <motion.div 
                      className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors"
                      whileHover={{ rotate: 10 }}
                    >
                      <MapPin className="w-5 h-5 text-background" />
                    </motion.div>
                    <span className="text-background/70 font-body-regular text-sm pt-2 group-hover:text-background transition-colors">
                      {settings.contact_address}
                    </span>
                  </motion.a>
                </li>
              )}
              {settings.contact_phone && (
                <li>
                  <motion.a 
                    href={`tel:${settings.contact_phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-4 group"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <motion.div 
                      className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors"
                      whileHover={{ rotate: 10 }}
                    >
                      <Phone className="w-5 h-5 text-background" />
                    </motion.div>
                    <span className="text-background/70 font-body-regular text-sm group-hover:text-background transition-colors">
                      {settings.contact_phone}
                    </span>
                  </motion.a>
                </li>
              )}
              {settings.whatsapp_number && (
                <li>
                  <motion.a 
                    href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 group"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <motion.div 
                      className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500 transition-colors"
                      whileHover={{ rotate: 10 }}
                    >
                      <MessageCircle className="w-5 h-5 text-background" />
                    </motion.div>
                    <span className="text-background/70 font-body-regular text-sm group-hover:text-background transition-colors">
                      WhatsApp
                    </span>
                  </motion.a>
                </li>
              )}
              {settings.contact_email && (
                <li>
                  <motion.a 
                    href={`mailto:${settings.contact_email}`}
                    className="flex items-center gap-4 group"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <motion.div 
                      className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors"
                      whileHover={{ rotate: 10 }}
                    >
                      <Mail className="w-5 h-5 text-background" />
                    </motion.div>
                    <span className="text-background/70 font-body-regular text-sm group-hover:text-background transition-colors">
                      {settings.contact_email}
                    </span>
                  </motion.a>
                </li>
              )}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="border-t border-background/15 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-background/50 text-sm font-body-regular flex items-center gap-1">
            © {new Date().getFullYear()} {settings.site_name}. Made with 
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart className="w-4 h-4 text-accent fill-accent" />
            </motion.span>
            in Bihar
          </p>
          <div className="flex gap-6">
            <Link to="/privacy">
              <motion.span 
                className="text-background/50 hover:text-background text-sm font-body-medium transition-colors inline-block"
                whileHover={{ y: -2 }}
              >
                Privacy Policy
              </motion.span>
            </Link>
            <Link to="/terms">
              <motion.span 
                className="text-background/50 hover:text-background text-sm font-body-medium transition-colors inline-block"
                whileHover={{ y: -2 }}
              >
                Terms of Service
              </motion.span>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}