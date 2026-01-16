import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, MessageCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    message: ""
  });
  const { settings } = useSiteSettings();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast.success("Thank you! We'll get back to you soon.");
    setIsSubmitting(false);
    setFormData({ name: "", email: "", phone: "", projectType: "", message: "" });
  };

  const handleWhatsAppQuote = () => {
    const whatsappNumber = settings.whatsapp_number?.replace(/\D/g, '') || '';
    if (!whatsappNumber) {
      toast.error("WhatsApp number not configured");
      return;
    }

    // Build the quote message
    const message = encodeURIComponent(
      `Hi! I'd like to request a quote.\n\n` +
      `Name: ${formData.name || 'Not provided'}\n` +
      `Email: ${formData.email || 'Not provided'}\n` +
      `Phone: ${formData.phone || 'Not provided'}\n` +
      `Project Type: ${formData.projectType || 'Not specified'}\n\n` +
      `Message:\n${formData.message || 'No message provided'}`
    );

    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  // Address from plus code GHRC+88 Katihar, Bihar
  const address = "Katihar, Bihar 854105, India";
  const mapQuery = encodeURIComponent("GHRC+88 Katihar, Bihar");

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      content: address,
      href: `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
      external: true,
    },
    settings.contact_phone && {
      icon: Phone,
      title: "Call Us",
      content: settings.contact_phone,
      href: `tel:${settings.contact_phone.replace(/\s/g, '')}`,
    },
    settings.whatsapp_number && {
      icon: MessageCircle,
      title: "WhatsApp",
      content: "Chat with us",
      href: `https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`,
      external: true,
    },
    settings.contact_email && {
      icon: Mail,
      title: "Email Us",
      content: settings.contact_email,
      href: `mailto:${settings.contact_email}`,
    },
    settings.business_hours && {
      icon: Clock,
      title: "Business Hours",
      content: settings.business_hours,
    },
  ].filter(Boolean);

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left - Contact Info */}
          <div className="space-y-8">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-sm font-elegant tracking-widest uppercase text-primary"
            >
              Get In Touch
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-3xl md:text-4xl font-bold text-foreground"
            >
              Let's Create
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Something Beautiful</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground font-body text-lg leading-relaxed"
            >
              Ready to bring your vision to life? Contact us today for a free
              consultation and quote. Our team is eager to help you achieve
              printing excellence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="space-y-6 pt-6"
            >
              {contactInfo.map((item: any, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-foreground">
                      {item.title}
                    </h4>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                        className="text-muted-foreground font-body hover:text-primary transition-colors"
                      >
                        {item.content}
                      </a>
                    ) : (
                      <p className="text-muted-foreground font-body">
                        {item.content}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-card p-8 rounded-2xl shadow-lg border border-border space-y-6"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-elegant text-foreground">
                    Full Name
                  </label>
                  <Input
                    required
                    placeholder="John Doe"
                    className="font-body"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-elegant text-foreground">
                    Email Address
                  </label>
                  <Input
                    required
                    type="email"
                    placeholder="john@example.com"
                    className="font-body"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-elegant text-foreground">
                  Phone Number
                </label>
                <Input
                  placeholder="+91 98765 43210"
                  className="font-body"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-elegant text-foreground">
                  Project Type
                </label>
                <Input
                  placeholder="e.g., Book Printing, Packaging"
                  className="font-body"
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-elegant text-foreground">
                  Message
                </label>
                <Textarea
                  required
                  placeholder="Tell us about your project..."
                  rows={4}
                  className="font-body resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="flex-1 bg-primary hover:bg-primary/90 font-elegant tracking-wide"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  size="lg"
                  onClick={handleWhatsAppQuote}
                  className="flex-1 bg-[#25D366] hover:bg-[#20BD5A] text-white font-elegant tracking-wide"
                >
                  <MessageCircle className="mr-2 w-5 h-5" />
                  Quote via WhatsApp
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
