import { motion } from "framer-motion";
import { ArrowRight, Award, Printer, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-wood-pattern">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/50" />

      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-20 right-10 w-72 h-72 rounded-full bg-accent blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.08, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
        className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-primary blur-3xl"
      />

      <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <div className="flex items-center gap-1 px-4 py-2 bg-accent/10 rounded-full border border-accent/20">
                <Star className="w-4 h-4 text-accent fill-accent" />
                <span className="text-sm font-elegant text-accent tracking-wide">
                  Premium Quality Since 1985
                </span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight"
            >
              Crafting
              <span className="block text-gradient-gold">Excellence</span>
              <span className="block">in Print</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted-foreground font-body leading-relaxed max-w-lg"
            >
              Bihar's premier lithographic printing press, delivering
              unparalleled quality in book printing, packaging, and commercial
              print solutions with a timeless wood-finish aesthetic.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/products">
                <Button
                  size="lg"
                  className="group bg-primary hover:bg-primary/90 text-primary-foreground font-elegant tracking-wide text-lg px-8"
                >
                  Explore Products
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="font-elegant tracking-wide text-lg px-8 border-2"
                >
                  Get a Quote
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-border"
            >
              {[
                { value: "38+", label: "Years Experience" },
                { value: "5000+", label: "Projects Completed" },
                { value: "100%", label: "Client Satisfaction" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="font-display text-3xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-elegant">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Content - Hero Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Main Image Container */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl transform rotate-3 transition-transform hover:rotate-0 duration-500" />
              <div className="absolute inset-4 bg-card rounded-2xl shadow-2xl overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
                  <div className="text-center space-y-6 p-8">
                    <Printer className="w-24 h-24 text-primary mx-auto opacity-80" />
                    <div className="space-y-2">
                      <h3 className="font-display text-2xl font-bold text-foreground">
                        Litho Art Press
                      </h3>
                      <p className="font-elegant text-muted-foreground">
                        Where Tradition Meets Innovation
                      </p>
                    </div>
                    <div className="flex justify-center gap-4">
                      <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
                        <Award className="w-5 h-5 text-accent" />
                        <span className="text-sm font-elegant">
                          ISO Certified
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 bg-accent text-accent-foreground p-4 rounded-xl shadow-lg"
              >
                <Star className="w-6 h-6 fill-current" />
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute -bottom-4 -left-4 bg-primary text-primary-foreground p-4 rounded-xl shadow-lg"
              >
                <Printer className="w-6 h-6" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
