import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const faqs = [
  {
    category: "General",
    questions: [
      {
        q: "What types of printing services do you offer?",
        a: "We offer a comprehensive range of printing services including book printing (hardcover & softcover), packaging design, business stationery, wedding invitations, commercial printing (brochures, catalogs, posters), and custom labels & stickers."
      },
      {
        q: "How long have you been in business?",
        a: "Litho Art Press has been serving customers since 1985 - that's over 38 years of experience in the printing industry. We've grown from a small workshop to one of Bihar's leading printing presses."
      },
      {
        q: "Do you serve customers outside Bihar?",
        a: "Yes! While we're based in Bihar, we serve customers across India. We can ship your printed materials to any location within the country."
      }
    ]
  },
  {
    category: "Ordering & Pricing",
    questions: [
      {
        q: "How do I get a quote for my project?",
        a: "You can request a quote by visiting our Contact page, calling us directly, or reaching out via WhatsApp. Simply describe your project requirements and we'll provide a detailed quote within 24 hours."
      },
      {
        q: "What is the minimum order quantity?",
        a: "Minimum order quantities vary by product. For most commercial printing, we can accommodate small runs starting from 100 pieces. For books, minimum quantities typically start at 50-100 copies. Contact us for specific requirements."
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept bank transfers, UPI payments, cash, and cheques. For large orders, we typically require a 50% advance payment with the balance due before delivery."
      },
      {
        q: "Are there any discounts for bulk orders?",
        a: "Yes, we offer volume discounts for bulk orders. The larger your order, the better the per-unit pricing. Contact us with your quantity requirements for a custom quote."
      }
    ]
  },
  {
    category: "Production & Delivery",
    questions: [
      {
        q: "What is the typical turnaround time?",
        a: "Standard turnaround time is 5-7 business days after proof approval. Rush orders can be accommodated for an additional fee. Complex projects or large quantities may require additional time."
      },
      {
        q: "Do you provide proofs before printing?",
        a: "Yes, we provide digital proofs for all orders before printing begins. Physical proofs are available for an additional charge. We don't proceed with production until you approve the proof."
      },
      {
        q: "Do you offer delivery services?",
        a: "Yes, we offer delivery across India. Local deliveries in Bihar are often free for orders above a certain value. For other locations, shipping charges are calculated based on weight and destination."
      },
      {
        q: "What happens if there's an issue with my order?",
        a: "Customer satisfaction is our priority. If there's a defect due to our error, we will reprint the order at no additional cost. Please report any issues within 48 hours of receiving your order."
      }
    ]
  },
  {
    category: "Files & Artwork",
    questions: [
      {
        q: "What file formats do you accept?",
        a: "We prefer print-ready PDF files. We also accept AI, EPS, PSD, and high-resolution JPEG/PNG files. All files should be in CMYK color mode with a minimum resolution of 300 DPI."
      },
      {
        q: "Can you help with design?",
        a: "Yes! Our in-house design team can help create or refine your artwork. Design services are available for an additional fee. We can work from your rough concepts or create designs from scratch."
      },
      {
        q: "What should I include in my print-ready file?",
        a: "Your file should include 3mm bleed on all sides, fonts embedded or outlined, images at 300 DPI minimum, and CMYK color mode. We'll provide a detailed specification sheet upon request."
      }
    ]
  },
  {
    category: "Specialty Services",
    questions: [
      {
        q: "Do you offer specialty finishes?",
        a: "Yes, we offer a wide range of specialty finishes including foil stamping (gold, silver, custom colors), embossing, debossing, spot UV coating, lamination (matte & gloss), and die-cutting."
      },
      {
        q: "Can you print on eco-friendly materials?",
        a: "Absolutely! We offer recycled paper options, FSC-certified paper, and biodegradable packaging materials. Let us know your sustainability requirements and we'll recommend the best options."
      },
      {
        q: "Do you print wedding invitations?",
        a: "Yes, wedding invitations are one of our specialties! We offer a wide range of traditional and modern designs with premium finishes like foil stamping, laser cutting, and handmade paper options."
      }
    ]
  }
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const { settings } = useSiteSettings();

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6"
            >
              <HelpCircle className="w-4 h-4 text-primary" />
              <span className="text-sm font-elegant text-primary">Help Center</span>
            </motion.div>
            
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Frequently Asked
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Questions
              </span>
            </h1>
            <p className="text-muted-foreground font-body text-lg">
              Find answers to common questions about our printing services, 
              ordering process, and more.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-12">
            {faqs.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: categoryIndex * 0.1 }}
              >
                <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
                  {category.category}
                </h2>
                
                <div className="space-y-3">
                  {category.questions.map((faq, index) => {
                    const itemId = `${categoryIndex}-${index}`;
                    const isOpen = openItems.includes(itemId);
                    
                    return (
                      <div
                        key={index}
                        className="bg-card border border-border rounded-xl overflow-hidden"
                      >
                        <button
                          onClick={() => toggleItem(itemId)}
                          className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
                        >
                          <span className="font-elegant font-medium text-foreground pr-4">
                            {faq.q}
                          </span>
                          <ChevronDown 
                            className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        
                        <motion.div
                          initial={false}
                          animate={{ 
                            height: isOpen ? "auto" : 0,
                            opacity: isOpen ? 1 : 0
                          }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 pt-0">
                            <p className="text-muted-foreground font-body leading-relaxed">
                              {faq.a}
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              Still have questions?
            </h2>
            <p className="text-muted-foreground font-body mb-6">
              Can't find the answer you're looking for? Our team is here to help.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact">
                <Button size="lg" className="font-elegant">
                  Contact Us
                </Button>
              </Link>
              {settings.whatsapp_number && (
                <a
                  href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="font-elegant gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </Button>
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
