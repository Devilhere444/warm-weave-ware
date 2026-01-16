import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Award, Heart, Shield, Target, Users, Sparkles, Palette, Cog } from "lucide-react";

const timeline = [
  { year: "1965", title: "Foundation", description: "Litho Art Press was established in Patna, Bihar with a vision to bring premium printing to the region." },
  { year: "1975", title: "Expansion", description: "Expanded operations with new machinery and doubled our production capacity." },
  { year: "1985", title: "ISO Certification", description: "Achieved ISO 9001 certification for quality management systems." },
  { year: "2005", title: "Digital Integration", description: "Integrated cutting-edge digital printing technology while preserving traditional techniques." },
  { year: "2023", title: "Industry Leader", description: "Recognized as one of Bihar's leading printing presses with nationwide clientele." },
];

const values = [
  { icon: Heart, title: "Passion", description: "We love what we do, and it shows in every print." },
  { icon: Shield, title: "Quality", description: "Uncompromising standards in materials and craftsmanship." },
  { icon: Users, title: "Partnership", description: "We see our clients as partners in creation." },
  { icon: Target, title: "Precision", description: "Attention to detail in every aspect of our work." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-28 pb-20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        
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
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-elegant text-primary">Our Story</span>
            </motion.div>
            
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
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
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

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-border hidden lg:block" />

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex flex-col lg:flex-row items-center gap-8 ${
                    index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                      <span className="text-2xl font-display font-bold text-primary">
                        {item.year}
                      </span>
                      <h3 className="font-display text-xl font-semibold text-foreground mt-2">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground font-body mt-2">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-primary border-4 border-background shadow-lg z-10" />
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
