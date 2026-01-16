import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, ArrowUpRight, Heart, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function Footer() {
  const { settings } = useSiteSettings();

  const socialLinks = [
    { name: "facebook", url: settings.facebook_url },
    { name: "twitter", url: settings.twitter_url },
    { name: "instagram", url: settings.instagram_url },
  ].filter(s => s.url);

  return (
    <footer className="relative bg-foreground text-background overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-accent blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-20 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="font-display text-xl font-bold text-white">
                  {settings.site_name.charAt(0)}
                </span>
              </div>
              <div>
                <span className="font-display text-xl font-bold block text-background">
                  {settings.site_name}
                </span>
                <span className="text-xs text-background/60 font-body tracking-widest uppercase">
                  {settings.site_tagline || "Bihar"}
                </span>
              </div>
            </div>
            <p className="text-background/70 font-body text-sm leading-relaxed">
              {settings.footer_text || "Crafting premium printing solutions with a perfect blend of tradition and technology since 1985."}
            </p>
            
            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -3 }}
                    className="w-10 h-10 rounded-lg bg-background/10 hover:bg-primary flex items-center justify-center transition-colors"
                  >
                    <span className="text-xs font-display font-bold text-background capitalize">
                      {social.name.charAt(0).toUpperCase()}
                    </span>
                  </motion.a>
                ))}
              </div>
            )}
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-display text-lg font-semibold mb-6 text-background">
              Quick Links
            </h4>
            <ul className="space-y-4">
              {[
                { name: "Home", path: "/" },
                { name: "Products", path: "/products" },
                { name: "About Us", path: "/about" },
                { name: "FAQ", path: "/faq" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="group flex items-center gap-2 text-background/70 hover:text-background transition-colors font-body"
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-display text-lg font-semibold mb-6 text-background">
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
              ].map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.path}
                    className="group flex items-center gap-2 text-background/70 hover:text-background transition-colors font-body"
                  >
                    <span>{service.name}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="font-display text-lg font-semibold mb-6 text-background">
              Contact Us
            </h4>
            <ul className="space-y-5">
              {settings.contact_address && (
                <li>
                  <motion.a 
                    href="#" 
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                      <MapPin className="w-5 h-5 text-background" />
                    </div>
                    <span className="text-background/70 font-body text-sm pt-2 group-hover:text-background transition-colors">
                      {settings.contact_address}
                    </span>
                  </motion.a>
                </li>
              )}
              {settings.contact_phone && (
                <li>
                  <motion.a 
                    href={`tel:${settings.contact_phone.replace(/\s/g, '')}`}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                      <Phone className="w-5 h-5 text-background" />
                    </div>
                    <span className="text-background/70 hover:text-background transition-colors font-body text-sm group-hover:text-background">
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
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500 transition-colors">
                      <MessageCircle className="w-5 h-5 text-background" />
                    </div>
                    <span className="text-background/70 hover:text-background transition-colors font-body text-sm group-hover:text-background">
                      WhatsApp
                    </span>
                  </motion.a>
                </li>
              )}
              {settings.contact_email && (
                <li>
                  <motion.a 
                    href={`mailto:${settings.contact_email}`}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                      <Mail className="w-5 h-5 text-background" />
                    </div>
                    <span className="text-background/70 hover:text-background transition-colors font-body text-sm group-hover:text-background">
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
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-background/15 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-background/50 text-sm font-body flex items-center gap-1">
            © {new Date().getFullYear()} {settings.site_name}. Made with 
            <Heart className="w-4 h-4 text-accent fill-accent" /> 
            in Bihar
          </p>
          <div className="flex gap-6">
            <Link
              to="/privacy"
              className="text-background/50 hover:text-background text-sm font-body transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-background/50 hover:text-background text-sm font-body transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
