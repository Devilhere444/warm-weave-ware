import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, ArrowUpRight, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
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
                  L
                </span>
              </div>
              <div>
                <span className="font-display text-xl font-bold block text-background">
                  Litho Art Press
                </span>
                <span className="text-xs text-background/60 font-body tracking-widest uppercase">
                  Bihar
                </span>
              </div>
            </div>
            <p className="text-background/70 font-body text-sm leading-relaxed">
              Crafting premium printing solutions with a perfect blend of
              tradition and technology since 1985.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {['facebook', 'twitter', 'instagram', 'linkedin'].map((social, index) => (
                <motion.a
                  key={social}
                  href={`#${social}`}
                  whileHover={{ scale: 1.1, y: -3 }}
                  className="w-10 h-10 rounded-lg bg-background/10 hover:bg-primary flex items-center justify-center transition-colors"
                >
                  <span className="text-xs font-display font-bold text-background capitalize">
                    {social.charAt(0).toUpperCase()}
                  </span>
                </motion.a>
              ))}
            </div>
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
                "Book Printing",
                "Packaging Design",
                "Business Stationery",
                "Wedding Cards",
                "Promotional Materials",
              ].map((service) => (
                <li
                  key={service}
                  className="text-background/70 font-body hover:text-background transition-colors cursor-default"
                >
                  {service}
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
                    Industrial Area, Patna, Bihar 800001, India
                  </span>
                </motion.a>
              </li>
              <li>
                <motion.a 
                  href="tel:+919876543210"
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                    <Phone className="w-5 h-5 text-background" />
                  </div>
                  <span className="text-background/70 hover:text-background transition-colors font-body text-sm group-hover:text-background">
                    +91 98765 43210
                  </span>
                </motion.a>
              </li>
              <li>
                <motion.a 
                  href="mailto:info@lithoartpress.com"
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                    <Mail className="w-5 h-5 text-background" />
                  </div>
                  <span className="text-background/70 hover:text-background transition-colors font-body text-sm group-hover:text-background">
                    info@lithoartpress.com
                  </span>
                </motion.a>
              </li>
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
            © 2024 Litho Art Press. Made with 
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
