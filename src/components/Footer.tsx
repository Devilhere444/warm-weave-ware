import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Heart, MessageCircle } from "lucide-react";
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

      {/* Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--background)) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="container mx-auto px-4 lg:px-8 py-12 md:py-20 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4 md:space-y-6">
            <div className="flex items-center gap-2 md:gap-3 group">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="font-display-bold text-lg md:text-xl text-white">
                  {settings.site_name.charAt(0)}
                </span>
              </div>
              <div>
                <span className="font-display-bold text-lg md:text-xl block text-background">
                  {settings.site_name}
                </span>
                <span className="text-[10px] md:text-xs text-background/60 font-body-medium tracking-widest uppercase">
                  {settings.site_tagline || "Bihar"}
                </span>
              </div>
            </div>
            <p className="text-background/70 font-body-regular text-xs md:text-sm leading-relaxed">
              {settings.footer_text || "Crafting premium printing solutions with a perfect blend of tradition and technology since 1965. Proudly serving Katihar and nearby Bihar regions, and across all over India. Over 1 Lakh+ projects delivered."}
            </p>
            
            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex gap-2 md:gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-background/10 hover:bg-primary flex items-center justify-center transition-colors touch-target"
                  >
                    <span className="text-xs font-display-bold text-background capitalize">
                      {social.name.charAt(0).toUpperCase()}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display-semibold text-base md:text-lg mb-4 md:mb-6 text-background">
              Quick Links
            </h4>
            <ul className="space-y-2.5 md:space-y-4">
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
                    className="text-background/70 hover:text-background transition-colors font-body-regular text-sm md:text-base"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display-semibold text-base md:text-lg mb-4 md:mb-6 text-background">
              Our Services
            </h4>
            <ul className="space-y-2.5 md:space-y-4">
              {[
                { name: "Book Printing", path: "/products?category=book-printing" },
                { name: "Packaging", path: "/products?category=packaging" },
                { name: "Stationery", path: "/products?category=stationery" },
                { name: "Wedding Cards", path: "/products?category=invitations" },
                { name: "Commercial", path: "/products?category=commercial" },
              ].map((service) => (
                <li key={service.name}>
                  <Link 
                    to={service.path}
                    className="text-background/70 hover:text-background transition-colors font-body-regular text-sm md:text-base"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-display-semibold text-base md:text-lg mb-4 md:mb-6 text-background">
              Contact Us
            </h4>
            <ul className="space-y-3 md:space-y-5">
              {settings.contact_address && (
                <li>
                  <a 
                    href="#" 
                    className="flex items-start gap-3 md:gap-4 group"
                  >
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-background/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                      <MapPin className="w-4 h-4 md:w-5 md:h-5 text-background" />
                    </div>
                    <span className="text-background/70 font-body-regular text-xs md:text-sm pt-1 md:pt-2 group-hover:text-background transition-colors">
                      {settings.contact_address}
                    </span>
                  </a>
                </li>
              )}
              {settings.contact_phone && (
                <li>
                  <a 
                    href={`tel:${settings.contact_phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-3 md:gap-4 group"
                  >
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-background/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                      <Phone className="w-4 h-4 md:w-5 md:h-5 text-background" />
                    </div>
                    <span className="text-background/70 font-body-regular text-xs md:text-sm group-hover:text-background transition-colors">
                      {settings.contact_phone}
                    </span>
                  </a>
                </li>
              )}
              {settings.whatsapp_number && (
                <li>
                  <a 
                    href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 md:gap-4 group"
                  >
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-background/10 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500 transition-colors">
                      <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-background" />
                    </div>
                    <span className="text-background/70 font-body-regular text-xs md:text-sm group-hover:text-background transition-colors">
                      WhatsApp
                    </span>
                  </a>
                </li>
              )}
              {settings.contact_email && (
                <li>
                  <a 
                    href={`mailto:${settings.contact_email}`}
                    className="flex items-center gap-3 md:gap-4 group"
                  >
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-background/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                      <Mail className="w-4 h-4 md:w-5 md:h-5 text-background" />
                    </div>
                    <span className="text-background/70 font-body-regular text-xs md:text-sm group-hover:text-background transition-colors">
                      {settings.contact_email}
                    </span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/15 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/50 text-xs md:text-sm font-body-regular flex items-center gap-1">
            © {new Date().getFullYear()} {settings.site_name}. Made with 
            <Heart className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent fill-accent" />
            in Bihar
          </p>
          <div className="flex gap-4 md:gap-6">
            <Link to="/privacy">
              <span className="text-background/50 hover:text-background text-xs md:text-sm font-body-medium transition-colors">
                Privacy Policy
              </span>
            </Link>
            <Link to="/terms">
              <span className="text-background/50 hover:text-background text-xs md:text-sm font-body-medium transition-colors">
                Terms of Service
              </span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}