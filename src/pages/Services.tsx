import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  BookOpen, Package, FileText, Stamp, Printer, 
  Gift, CreditCard, Palette, ArrowRight, CheckCircle2
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const services = [
  {
    id: "book-printing",
    title: "Book Printing",
    description: "Premium quality book printing for publishers, authors, and educational institutions. From paperbacks to hardcovers, we deliver excellence.",
    icon: BookOpen,
    features: ["Offset & Digital Printing", "Custom Binding Options", "Premium Paper Stock", "Bulk Discounts"],
    color: "bg-blue-500",
  },
  {
    id: "packaging",
    title: "Packaging Solutions",
    description: "Custom packaging that protects your products and elevates your brand. Boxes, cartons, and specialty packaging.",
    icon: Package,
    features: ["Custom Box Design", "Food-Grade Materials", "Eco-Friendly Options", "Brand Integration"],
    color: "bg-amber-500",
  },
  {
    id: "commercial",
    title: "Commercial Printing",
    description: "High-volume commercial printing for businesses. Brochures, catalogs, flyers, and marketing materials.",
    icon: Printer,
    features: ["Fast Turnaround", "Large Format Printing", "Variable Data Printing", "Mailing Services"],
    color: "bg-green-500",
  },
  {
    id: "stationery",
    title: "Stationery & Office",
    description: "Professional business stationery including letterheads, envelopes, notepads, and corporate identity materials.",
    icon: FileText,
    features: ["Letterheads & Envelopes", "Business Cards", "Notepads & Diaries", "Corporate Kits"],
    color: "bg-purple-500",
  },
  {
    id: "invitations",
    title: "Invitations & Cards",
    description: "Beautifully crafted wedding invitations, greeting cards, and special occasion stationery with premium finishes.",
    icon: Gift,
    features: ["Wedding Invitations", "Greeting Cards", "Foil Stamping", "Embossing & Debossing"],
    color: "bg-pink-500",
  },
  {
    id: "labels",
    title: "Labels & Stickers",
    description: "Custom labels and stickers for products, branding, and promotional use. Multiple materials and finishes available.",
    icon: Stamp,
    features: ["Product Labels", "Die-Cut Stickers", "Roll Labels", "Waterproof Options"],
    color: "bg-cyan-500",
  },
  {
    id: "business-cards",
    title: "Business Cards",
    description: "Make a lasting impression with premium business cards. Multiple paper stocks, finishes, and specialty options.",
    icon: CreditCard,
    features: ["Standard & Custom Sizes", "Spot UV & Foil", "Textured Papers", "Same Day Available"],
    color: "bg-indigo-500",
  },
  {
    id: "design",
    title: "Design Services",
    description: "Professional graphic design services to bring your vision to life. From concept to print-ready artwork.",
    icon: Palette,
    features: ["Logo Design", "Layout & Typesetting", "Brand Identity", "Prepress Services"],
    color: "bg-rose-500",
  },
];

const processSteps = [
  { step: 1, title: "Consultation", description: "Discuss your requirements with our experts" },
  { step: 2, title: "Quote", description: "Receive a detailed quote within 24 hours" },
  { step: 3, title: "Design", description: "Review and approve your design proofs" },
  { step: 4, title: "Production", description: "Your order goes into production" },
  { step: 5, title: "Delivery", description: "Receive your printed materials" },
];

export default function Services() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-elegant rounded-full mb-4">
              Our Services
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Premium Printing Solutions
            </h1>
            <p className="text-lg text-muted-foreground font-elegant leading-relaxed">
              From books to packaging, we offer comprehensive printing services with 
              unmatched quality and attention to detail. Over 35 years of excellence in Bihar.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-card rounded-2xl border border-border p-6 hover:shadow-xl hover:border-primary/20 transition-all duration-300"
              >
                <div className={`w-14 h-14 ${service.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {service.title}
                </h3>
                
                <p className="text-muted-foreground font-elegant text-sm leading-relaxed mb-4">
                  {service.description}
                </p>
                
                <ul className="space-y-2 mb-5">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="font-elegant">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to={`/products?category=${service.id}`}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-between font-elegant text-primary hover:bg-primary/10 group-hover:translate-x-1 transition-transform"
                  >
                    View Products
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground font-elegant max-w-2xl mx-auto">
              Our streamlined process ensures quality results with minimal hassle
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-0">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center"
              >
                <div className="text-center px-6 py-4">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-display text-xl font-bold mx-auto mb-3">
                    {step.step}
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-elegant max-w-[150px]">
                    {step.description}
                  </p>
                </div>
                {index < processSteps.length - 1 && (
                  <ArrowRight className="hidden md:block w-6 h-6 text-muted-foreground/50" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-primary rounded-3xl p-8 md:p-12 text-center"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-primary-foreground/80 font-elegant mb-8 max-w-2xl mx-auto">
              Get a free quote today and experience the quality that has made us Bihar's trusted printing partner since 1985.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="font-elegant text-lg px-8"
                >
                  Request a Quote
                </Button>
              </Link>
              <Link to="/products">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="font-elegant text-lg px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  Browse Products
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
