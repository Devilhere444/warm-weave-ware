import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, BookOpen, Package, FileText, Star, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background with Parallax */}
      <motion.div style={{ y }} className="absolute inset-0 bg-hero-gradient" />
      
      {/* Animated Sand Dunes Effect */}
      <motion.div 
        style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "15%"]) }}
        className="absolute inset-0"
      >
        <svg className="absolute bottom-0 w-full h-[40%] opacity-20" viewBox="0 0 1440 400" preserveAspectRatio="none">
          <motion.path
            initial={{ d: "M0,400 C360,300 720,350 1080,280 C1260,240 1380,300 1440,280 L1440,400 L0,400 Z" }}
            animate={{ 
              d: [
                "M0,400 C360,300 720,350 1080,280 C1260,240 1380,300 1440,280 L1440,400 L0,400 Z",
                "M0,400 C360,320 720,290 1080,310 C1260,320 1380,280 1440,300 L1440,400 L0,400 Z",
                "M0,400 C360,300 720,350 1080,280 C1260,240 1380,300 1440,280 L1440,400 L0,400 Z"
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            fill="hsl(38 40% 75%)"
          />
        </svg>
        <svg className="absolute bottom-0 w-full h-[30%] opacity-15" viewBox="0 0 1440 300" preserveAspectRatio="none">
          <motion.path
            initial={{ d: "M0,300 C480,200 960,250 1440,180 L1440,300 L0,300 Z" }}
            animate={{ 
              d: [
                "M0,300 C480,200 960,250 1440,180 L1440,300 L0,300 Z",
                "M0,300 C480,230 960,190 1440,220 L1440,300 L0,300 Z",
                "M0,300 C480,200 960,250 1440,180 L1440,300 L0,300 Z"
              ]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            fill="hsl(35 35% 70%)"
          />
        </svg>
      </motion.div>

      {/* Animated Orbs with Warm Colors */}
      <motion.div
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.25, 0.4, 0.25]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-20 w-[400px] h-[400px] rounded-full bg-gradient-radial from-primary/40 to-transparent blur-[100px]"
      />
      <motion.div
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.35, 0.2]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 left-20 w-[500px] h-[500px] rounded-full bg-gradient-radial from-accent/30 to-transparent blur-[120px]"
      />
      <motion.div
        animate={{ 
          x: [0, 60, 0],
          y: [0, -40, 0]
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/3 w-80 h-80 rounded-full bg-white/10 blur-[100px]"
      />

      {/* Floating Geometric Shapes */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-24 left-[12%] w-16 h-16 border-2 border-white/25 rounded-2xl backdrop-blur-sm"
      />
      <motion.div
        animate={{ y: [0, 25, 0], rotate: [0, -15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute bottom-32 right-[18%] w-24 h-24 border-2 border-white/20 rounded-full backdrop-blur-sm"
      />
      <motion.div
        animate={{ y: [0, -30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
        className="absolute top-1/3 right-[8%] w-14 h-14 bg-white/15 rounded-xl rotate-45 backdrop-blur-sm"
      />
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute bottom-1/4 left-[8%] w-20 h-20 border border-primary/30 rounded-3xl backdrop-blur-sm"
      />

      {/* Floating Stars */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ 
            opacity: [0.4, 1, 0.4],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{ 
            duration: 3 + i, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: i * 0.5
          }}
          className="absolute"
          style={{
            top: `${15 + i * 15}%`,
            left: `${5 + i * 20}%`,
          }}
        >
          <Star className="w-4 h-4 text-white/40 fill-white/20" />
        </motion.div>
      ))}

      <motion.div 
        style={{ opacity, scale }} 
        className="container mx-auto px-4 lg:px-8 relative z-10 pt-24"
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex items-center gap-3"
            >
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-md rounded-full border border-white/25 cursor-default"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-sm font-body text-white tracking-wide">
                  Excellence Since 1985
                </span>
              </motion.div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1]"
            >
              Where Art Meets
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="block mt-3 text-transparent bg-clip-text bg-gradient-to-r from-white via-primary-foreground to-orange-200"
              >
                Precision Printing
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
              className="text-lg text-white/85 font-body leading-relaxed max-w-lg"
            >
              Bihar's premier lithographic printing press, delivering 
              unparalleled quality in book printing, packaging, and commercial 
              print solutions that leave lasting impressions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/products">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    className="group bg-white hover:bg-white/95 text-primary font-display font-semibold tracking-wide text-base px-8 shadow-lg"
                  >
                    Explore Products
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1.5" />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/contact">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="font-display font-medium tracking-wide text-base px-8 border-2 border-white/35 text-white hover:bg-white/15 hover:text-white hover:border-white/50"
                  >
                    Get a Quote
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Stats with Micro-interactions */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45, ease: "easeOut" }}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20"
            >
              {[
                { value: "38+", label: "Years Experience" },
                { value: "5000+", label: "Projects Completed" },
                { value: "100%", label: "Client Satisfaction" },
              ].map((stat, index) => (
                <motion.div 
                  key={index} 
                  className="text-center cursor-default"
                  whileHover={{ scale: 1.05, y: -3 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div 
                    className="font-display text-3xl md:text-4xl font-bold text-white"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm text-white/70 font-body mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Content - Interactive Service Cards */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Main Card with Floating Effect */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-20 bg-white/12 backdrop-blur-xl rounded-3xl p-8 border border-white/25 shadow-2xl"
              >
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: BookOpen, label: "Book Printing", desc: "Premium quality books", color: "from-orange-400/20 to-orange-600/20" },
                    { icon: Package, label: "Packaging", desc: "Custom solutions", color: "from-amber-400/20 to-amber-600/20" },
                    { icon: FileText, label: "Commercial", desc: "Business materials", color: "from-red-400/20 to-red-600/20" },
                    { icon: Sparkles, label: "Specialty", desc: "Unique finishes", color: "from-yellow-400/20 to-yellow-600/20" },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                      whileHover={{ 
                        scale: 1.08, 
                        y: -8,
                        transition: { duration: 0.2 }
                      }}
                      className={`relative overflow-hidden bg-gradient-to-br ${item.color} backdrop-blur-md rounded-2xl p-5 border border-white/15 cursor-pointer group`}
                    >
                      {/* Shimmer effect on hover */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                      />
                      <item.icon className="w-8 h-8 text-white mb-3 relative z-10" />
                      <h3 className="font-display text-lg font-semibold text-white relative z-10">
                        {item.label}
                      </h3>
                      <p className="text-sm text-white/75 font-body mt-1 relative z-10">
                        {item.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Floating Award Badge */}
              <motion.div
                animate={{ 
                  y: [0, -18, 0], 
                  rotate: [0, 8, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 z-30"
              >
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-2xl shadow-xl cursor-default"
                >
                  <Award className="w-5 h-5" />
                  <span className="text-sm font-display font-semibold">ISO Certified</span>
                </motion.div>
              </motion.div>

              {/* Decorative Elements */}
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/25 rounded-full blur-3xl" 
              />
              <motion.div 
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute -top-10 -left-10 w-28 h-28 border-2 border-white/15 rounded-full" 
              />
              <motion.div 
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-6 -right-10 w-20 h-20 border border-primary/30 rounded-full" 
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Animated Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <motion.path 
            initial={{ d: "M0 120L60 105C120 90 240 75 360 70C480 65 600 70 720 78C840 86 960 96 1080 98C1200 100 1320 94 1380 91L1440 88V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" }}
            animate={{
              d: [
                "M0 120L60 105C120 90 240 75 360 70C480 65 600 70 720 78C840 86 960 96 1080 98C1200 100 1320 94 1380 91L1440 88V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z",
                "M0 120L60 98C120 76 240 82 360 78C480 74 600 80 720 86C840 92 960 98 1080 95C1200 92 1320 80 1380 74L1440 68V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z",
                "M0 120L60 105C120 90 240 75 360 70C480 65 600 70 720 78C840 86 960 96 1080 98C1200 100 1320 94 1380 91L1440 88V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            fill="hsl(35 30% 96%)"
          />
        </svg>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 cursor-pointer"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <span className="text-xs text-white/60 font-body tracking-widest uppercase">Scroll</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-3 bg-white/60 rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
