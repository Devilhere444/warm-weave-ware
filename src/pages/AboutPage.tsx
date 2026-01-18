import { motion } from "framer-motion";
import { useRef, useState, useEffect, memo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Heart, Shield, Target, Users, Sparkles, Palette, Cog, Award } from "lucide-react";

// Optimized animation variants for faster page loads
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const timeline = [
  { 
    year: "1965", 
    title: "Foundation", 
    description: "Litho Art Press was established in Katihar, Bihar with a vision to bring premium printing to the region.",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80"
  },
  { 
    year: "1975", 
    title: "Expansion", 
    description: "Expanded operations with new machinery and doubled our production capacity.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80"
  },
  { 
    year: "1985", 
    title: "Regional Growth", 
    description: "Extended our services across nearby Bihar regions, building strong partnerships with local businesses.",
    image: "https://images.unsplash.com/photo-1553484771-371a605b060b?w=400&q=80"
  },
  { 
    year: "1995", 
    title: "Quality Excellence", 
    description: "Implemented rigorous quality control systems and earned recognition for outstanding print quality.",
    image: "https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=400&q=80"
  },
  { 
    year: "2005", 
    title: "Digital Integration", 
    description: "Integrated cutting-edge digital printing technology while preserving traditional techniques.",
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&q=80"
  },
  { 
    year: "2015", 
    title: "Nationwide Reach", 
    description: "Expanded delivery network to serve customers across all of India with reliable shipping.",
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&q=80"
  },
  { 
    year: "2020", 
    title: "1 Lakh+ Milestone", 
    description: "Celebrated the milestone of completing over 1 Lakh printing projects for our valued customers.",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&q=80"
  },
  { 
    year: "2024", 
    title: "Industry Leader", 
    description: "Recognized as one of Bihar's leading printing presses with nationwide clientele and 61+ years of excellence.",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&q=80"
  },
];

const values = [
  { icon: Heart, title: "Passion", description: "We love what we do, and it shows in every print." },
  { icon: Shield, title: "Quality", description: "Uncompromising standards in materials and craftsmanship." },
  { icon: Users, title: "Partnership", description: "We see our clients as partners in creation." },
  { icon: Target, title: "Precision", description: "Attention to detail in every aspect of our work." },
];

export default function AboutPage() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const timelineItemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Track which timeline item is in view
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    
    timelineItemRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveIndex(index);
              }
            });
          },
          { threshold: 0.5, rootMargin: "-20% 0px -40% 0px" }
        );
        observer.observe(ref);
        observers.push(observer);
      }
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  const scrollToItem = (index: number) => {
    timelineItemRefs.current[index]?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-28 pb-20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl will-change-transform" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl will-change-transform" />
        
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-elegant text-primary">Our Story</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Crafting Excellence
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Since 1965
              </span>
            </h1>
            <p className="text-muted-foreground font-body text-lg">
              A legacy of quality, innovation, and unwavering commitment to the
              art of printing.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Journey
            </h2>
            <p className="text-muted-foreground font-body max-w-2xl mx-auto">
              From humble beginnings to industry leadership, here's how we've grown.
            </p>
          </motion.div>

          {/* Sticky Timeline Navigation */}
          <div className="hidden lg:block sticky top-24 z-20 mb-12">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-4 shadow-lg max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-between gap-2">
                {timeline.map((item, index) => (
                  <button
                    key={item.year}
                    onClick={() => scrollToItem(index)}
                    className="relative flex-1 group"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <motion.div
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          activeIndex === index 
                            ? 'bg-primary scale-125' 
                            : 'bg-muted-foreground/30 group-hover:bg-primary/50'
                        }`}
                        layoutId="timeline-dot"
                      />
                      <span className={`text-xs font-display font-semibold transition-colors duration-300 ${
                        activeIndex === index ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                      }`}>
                        {item.year}
                      </span>
                      <span className={`text-[10px] font-body transition-all duration-300 ${
                        activeIndex === index 
                          ? 'text-foreground opacity-100' 
                          : 'text-muted-foreground opacity-0 group-hover:opacity-70'
                      }`}>
                        {item.title}
                      </span>
                    </div>
                    
                    {/* Active indicator line */}
                    {activeIndex === index && (
                      <motion.div
                        layoutId="active-indicator"
                        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>
              
              {/* Progress bar */}
              <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${((activeIndex + 1) / timeline.length) * 100}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              </div>
            </motion.div>
          </div>

          <div className="relative" ref={timelineRef}>
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-border hidden lg:block" />

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  ref={(el) => (timelineItemRefs.current[index] = el)}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className={`flex flex-col lg:flex-row items-center gap-8 ${
                    index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                    <motion.div 
                      className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300"
                      whileHover={{ y: -5 }}
                    >
                      {/* Image */}
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                        <span className="absolute bottom-3 left-4 text-3xl font-display font-bold text-primary drop-shadow-lg">
                          {item.year}
                        </span>
                      </div>
                      
                      {/* Content */}
                      <div className="p-5">
                        <h3 className="font-display text-xl font-semibold text-foreground">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground font-body mt-2 text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="relative">
                    <motion.div 
                      className="w-5 h-5 rounded-full bg-primary border-4 border-background shadow-lg z-10"
                      whileInView={{ scale: [0, 1.2, 1] }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.08 + 0.2 }}
                    />
                    <div className="absolute top-1/2 -translate-y-1/2 w-8 h-0.5 bg-primary/30 hidden lg:block" 
                      style={{ [index % 2 === 0 ? 'right' : 'left']: '100%' }} 
                    />
                  </div>
                  
                  <div className="flex-1 hidden lg:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Values
            </h2>
            <p className="text-muted-foreground font-body max-w-2xl mx-auto">
              The principles that guide everything we do.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground font-body text-sm">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Craftsmanship Section - Replaces Team */}
      <section className="py-24 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
              A Team of
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Master Craftsmen
              </span>
            </h2>
            <p className="text-muted-foreground font-body text-lg leading-relaxed mb-4">
              Behind every exceptional print is a team of dedicated artisans who pour their heart 
              and soul into their craft. With decades of combined experience, our craftsmen blend 
              traditional techniques with modern precision.
            </p>
            <p className="text-muted-foreground font-body text-lg leading-relaxed">
              Every project, from a single business card to a thousand-page hardcover, 
              receives the same unwavering attention to detail that has defined our legacy.
            </p>
          </motion.div>

          {/* Visual Elements Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-card p-8 rounded-3xl border border-border text-center group hover:shadow-xl transition-all duration-300"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Palette className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                Artistic Vision
              </h3>
              <p className="text-muted-foreground font-body text-sm">
                Our designers transform ideas into stunning visual masterpieces that capture attention.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-card p-8 rounded-3xl border border-border text-center group hover:shadow-xl transition-all duration-300"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent/80 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Cog className="w-10 h-10 text-accent-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                Technical Excellence
              </h3>
              <p className="text-muted-foreground font-body text-sm">
                State-of-the-art machinery operated by skilled technicians ensures flawless results.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-card p-8 rounded-3xl border border-border text-center group hover:shadow-xl transition-all duration-300"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                Quality Assurance
              </h3>
              <p className="text-muted-foreground font-body text-sm">
                Rigorous quality checks at every stage guarantee prints that exceed expectations.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
