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
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left - Contact Info */}
          <div className="space-y-6 md:space-y-8">
            <span className="inline-block text-xs md:text-sm font-elegant tracking-widest uppercase text-primary">
              Get In Touch
            </span>

            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight">
              Let's Create
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Something Beautiful</span>
            </h2>

            <p className="text-muted-foreground font-body text-base md:text-lg leading-relaxed">
              Ready to bring your vision to life? Contact us today for a free
              consultation and quote. Our team is eager to help you achieve
              printing excellence.
            </p>

            <div className="space-y-4 md:space-y-6 pt-4 md:pt-6">
              {contactInfo.map((item: any, index) => (
                <div key={index} className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  </div>
                  <div className="pt-1">
                    <h4 className="font-display font-semibold text-sm md:text-base text-foreground">
                      {item.title}
                    </h4>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                        className="text-muted-foreground font-body text-sm md:text-base hover:text-primary transition-colors"
                      >
                        {item.content}
                      </a>
                    ) : (
                      <p className="text-muted-foreground font-body text-sm md:text-base">
                        {item.content}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Contact Form */}
          <div>
            <form
              onSubmit={handleSubmit}
              className="bg-card p-5 md:p-8 rounded-2xl shadow-lg border border-border space-y-4 md:space-y-6"
            >
              <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-xs md:text-sm font-elegant text-foreground">
                    Full Name
                  </label>
                  <Input
                    required
                    placeholder="John Doe"
                    className="font-body text-base"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-xs md:text-sm font-elegant text-foreground">
                    Email Address
                  </label>
                  <Input
                    required
                    type="email"
                    placeholder="john@example.com"
                    className="font-body text-base"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5 md:space-y-2">
                <label className="text-xs md:text-sm font-elegant text-foreground">
                  Phone Number
                </label>
                <Input
                  placeholder="+91 98765 43210"
                  className="font-body text-base"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="space-y-1.5 md:space-y-2">
                <label className="text-xs md:text-sm font-elegant text-foreground">
                  Project Type
                </label>
                <Input
                  placeholder="e.g., Book Printing, Packaging"
                  className="font-body text-base"
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                />
              </div>

              <div className="space-y-1.5 md:space-y-2">
                <label className="text-xs md:text-sm font-elegant text-foreground">
                  Message
                </label>
                <Textarea
                  required
                  placeholder="Tell us about your project..."
                  rows={4}
                  className="font-body resize-none text-base"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-2">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="flex-1 bg-primary hover:bg-primary/90 font-elegant tracking-wide text-sm md:text-base btn-snappy touch-target"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 w-4 h-4 md:w-5 md:h-5" />
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  size="lg"
                  onClick={handleWhatsAppQuote}
                  className="flex-1 bg-[#25D366] hover:bg-[#20BD5A] text-white font-elegant tracking-wide text-sm md:text-base btn-snappy touch-target"
                >
                  <MessageCircle className="mr-2 w-4 h-4 md:w-5 md:h-5" />
                  Quote via WhatsApp
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
