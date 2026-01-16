import { motion } from "framer-motion";
import { ArrowRight, Sparkles, BookOpen, Package, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-hero-gradient" />
      
      {/* Animated Orbs */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-20 w-96 h-96 rounded-full bg-accent/30 blur-[100px]"
      />
      <motion.div
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 left-20 w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px]"
      />
      <motion.div
        animate={{ 
          x: [0, 50, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/3 w-72 h-72 rounded-full bg-white/10 blur-[80px]"
      />

      {/* Floating Shapes */}
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-32 left-[15%] w-16 h-16 border-2 border-white/20 rounded-xl"
      />
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-40 right-[20%] w-20 h-20 border-2 border-white/15 rounded-full"
      />
      <motion.div
        animate={{ y: [0, -25, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/2 right-[10%] w-12 h-12 bg-white/10 rounded-lg rotate-45"
      />

      <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <div className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-sm font-elegant text-white tracking-wide">
                  Excellence Since 1985
                </span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
            >
              Where Art Meets
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-accent/80">
                Precision Printing
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-white/80 font-body leading-relaxed max-w-lg"
            >
              Bihar's premier lithographic printing press, delivering 
              unparalleled quality in book printing, packaging, and commercial 
              print solutions that leave lasting impressions.
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
                  className="group bg-white hover:bg-white/90 text-primary font-elegant tracking-wide text-lg px-8"
                >
                  Explore Products
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="font-elegant tracking-wide text-lg px-8 border-2 border-white/30 text-white hover:bg-white/10 hover:text-white"
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
              className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20"
            >
              {[
                { value: "38+", label: "Years Experience" },
                { value: "5000+", label: "Projects Completed" },
                { value: "100%", label: "Client Satisfaction" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="font-display text-3xl md:text-4xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/70 font-elegant mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Content - Service Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Main Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-20 bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl"
              >
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: BookOpen, label: "Book Printing", desc: "Premium quality books" },
                    { icon: Package, label: "Packaging", desc: "Custom solutions" },
                    { icon: FileText, label: "Commercial", desc: "Business materials" },
                    { icon: Sparkles, label: "Specialty", desc: "Unique finishes" },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 cursor-pointer transition-all hover:bg-white/20"
                    >
                      <item.icon className="w-8 h-8 text-white mb-3" />
                      <h3 className="font-display text-lg font-semibold text-white">
                        {item.label}
                      </h3>
                      <p className="text-sm text-white/70 font-elegant mt-1">
                        {item.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 z-30 bg-accent text-white px-6 py-3 rounded-2xl shadow-lg font-elegant"
              >
                <span className="text-sm font-semibold">ISO Certified</span>
              </motion.div>

              {/* Decorative Elements */}
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
              <div className="absolute -top-8 -left-8 w-24 h-24 border-2 border-white/10 rounded-full" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path 
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
            fill="hsl(270 30% 98%)"
          />
        </svg>
      </div>
    </section>
  );
}