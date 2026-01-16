import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const services = [
  {
    id: "book-printing",
    title: "Book Printing",
    description: "Premium quality book printing for publishers, authors, and educational institutions.",
    features: ["Offset & Digital", "Custom Binding", "Premium Paper"],
    gradient: "from-blue-500 to-indigo-600",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80",
  },
  {
    id: "packaging",
    title: "Packaging",
    description: "Custom packaging that protects your products and elevates your brand.",
    features: ["Custom Design", "Eco-Friendly", "Food-Grade"],
    gradient: "from-amber-500 to-orange-600",
    image: "https://images.unsplash.com/photo-1607166452427-7e4477079cb9?w=600&q=80",
  },
  {
    id: "commercial",
    title: "Commercial",
    description: "High-volume commercial printing for businesses and marketing.",
    features: ["Fast Turnaround", "Large Format", "Bulk Orders"],
    gradient: "from-emerald-500 to-teal-600",
    image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&q=80",
  },
  {
    id: "stationery",
    title: "Stationery",
    description: "Professional business stationery and corporate identity materials.",
    features: ["Letterheads", "Business Cards", "Envelopes"],
    gradient: "from-violet-500 to-purple-600",
    image: "https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=600&q=80",
  },
  {
    id: "invitations",
    title: "Invitations",
    description: "Beautifully crafted wedding invitations and special occasion cards.",
    features: ["Foil Stamping", "Embossing", "Custom Design"],
    gradient: "from-pink-500 to-rose-600",
    image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=600&q=80",
  },
  {
    id: "labels",
    title: "Labels & Stickers",
    description: "Custom labels and stickers for products and promotional use.",
    features: ["Die-Cut", "Waterproof", "Roll Labels"],
    gradient: "from-cyan-500 to-sky-600",
    image: "https://images.unsplash.com/photo-1635405074683-96d6921a2a68?w=600&q=80",
  },
];

const processSteps = [
  { step: 1, title: "Consult", description: "Discuss your vision" },
  { step: 2, title: "Quote", description: "Get pricing in 24hrs" },
  { step: 3, title: "Design", description: "Approve your proofs" },
  { step: 4, title: "Print", description: "Production begins" },
  { step: 5, title: "Deliver", description: "Receive your order" },
];

export default function Services() {
  const navigate = useNavigate();

  const handleExplore = (serviceId: string) => {
    navigate(`/products?category=${serviceId}`);
  };

  const handleGetQuote = () => {
    navigate('/contact');
  };

  const handleViewProducts = () => {
    navigate('/products');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-elegant text-primary">Premium Printing Services</span>
            </motion.div>
            
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Crafting Your Vision
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Into Reality
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground font-elegant max-w-2xl mx-auto mb-8">
              From books to packaging, we deliver comprehensive printing solutions with 
              unmatched quality. Proudly serving Katihar, nearby Bihar regions, and across all over India since 1965 with over 1 Lakh+ projects completed.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                className="font-elegant gap-2 rounded-full px-8"
                onClick={handleGetQuote}
              >
                Get a Quote
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="font-elegant rounded-full px-8"
                onClick={handleViewProducts}
              >
                View Products
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid with Images */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="group relative bg-card rounded-3xl border border-border overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer"
                onClick={() => handleExplore(service.id)}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${service.gradient} opacity-40`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                </div>
                
                <div className="p-6 -mt-8 relative z-10">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {service.title}
                  </h3>
                  
                  <p className="text-muted-foreground font-elegant text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.features.map((feature, i) => (
                      <span
                        key={i}
                        className="text-xs font-elegant px-3 py-1 bg-muted rounded-full text-muted-foreground"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <button 
                    className="inline-flex items-center gap-2 text-sm font-elegant text-primary hover:text-primary/80 transition-colors group/btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExplore(service.id);
                    }}
                  >
                    Explore Products
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section - Horizontal Timeline */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              How It Works
            </h2>
            <p className="text-muted-foreground font-elegant">
              Simple steps to bring your project to life
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center relative"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center font-display text-xl font-bold mx-auto mb-4 shadow-lg shadow-primary/20 relative z-10"
                  >
                    {step.step}
                  </motion.div>
                  <h3 className="font-display font-semibold text-foreground mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs text-muted-foreground font-elegant">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
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
            className="relative bg-gradient-to-br from-primary via-primary to-primary/80 rounded-3xl p-10 md:p-14 overflow-hidden"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-2xl" />
            
            <div className="relative text-center max-w-2xl mx-auto">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Ready to Start Your Project?
              </h2>
              <p className="text-primary-foreground/80 font-elegant mb-8">
                Get a free quote today and experience the quality that has made us Bihar's trusted printing partner, proudly serving Katihar and across all over India with 1 Lakh+ successful projects.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="font-elegant text-lg px-8 rounded-full"
                  onClick={handleGetQuote}
                >
                  Request a Quote
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="font-elegant text-lg px-8 rounded-full bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                  onClick={handleViewProducts}
                >
                  Browse Products
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
