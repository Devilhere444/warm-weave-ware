import { motion, useScroll, useTransform, type Transition } from "framer-motion";
import { ArrowRight, Sparkles, BookOpen, Package, FileText, Truck, Trophy, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

// Snappy spring-like transition
const snappyTransition: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 25
};

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { settings } = useSiteSettings();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  // Split hero title for styling
  const heroTitleParts = settings.hero_title.split(" ");
  const firstPart = heroTitleParts.slice(0, Math.ceil(heroTitleParts.length / 2)).join(" ");
  const secondPart = heroTitleParts.slice(Math.ceil(heroTitleParts.length / 2)).join(" ");

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background with Parallax - GPU Accelerated */}
      <motion.div style={{ y }} className="absolute inset-0 bg-hero-gradient gpu-accelerated" />
      
      {/* Subtle Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] gpu-accelerated" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        mixBlendMode: 'overlay'
      }} />
      
      {/* Gradient Mesh Overlay for depth */}
      <div className="absolute inset-0 gpu-accelerated" style={{
        background: `
          radial-gradient(ellipse 80% 50% at 20% 40%, hsl(35 60% 50% / 0.15) 0%, transparent 50%),
          radial-gradient(ellipse 60% 40% at 80% 20%, hsl(25 70% 55% / 0.12) 0%, transparent 45%),
          radial-gradient(ellipse 50% 60% at 70% 80%, hsl(30 50% 45% / 0.1) 0%, transparent 50%),
          radial-gradient(ellipse 40% 30% at 10% 80%, hsl(40 45% 60% / 0.08) 0%, transparent 40%)
        `
      }} />
      
      {/* Static Sand Dunes Effect - Better performance */}
      <div className="absolute inset-0 gpu-accelerated">
        <svg className="absolute bottom-0 w-full h-[40%] opacity-20" viewBox="0 0 1440 400" preserveAspectRatio="none">
          <defs>
            <linearGradient id="duneGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(38 40% 70%)" />
              <stop offset="50%" stopColor="hsl(35 45% 75%)" />
              <stop offset="100%" stopColor="hsl(38 40% 70%)" />
            </linearGradient>
          </defs>
          <path
            d="M0,400 C360,300 720,350 1080,280 C1260,240 1380,300 1440,280 L1440,400 L0,400 Z"
            fill="url(#duneGradient1)"
          />
        </svg>
        <svg className="absolute bottom-0 w-full h-[30%] opacity-15" viewBox="0 0 1440 300" preserveAspectRatio="none">
          <defs>
            <linearGradient id="duneGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(30 35% 65%)" />
              <stop offset="50%" stopColor="hsl(35 40% 72%)" />
              <stop offset="100%" stopColor="hsl(30 35% 65%)" />
            </linearGradient>
          </defs>
          <path
            d="M0,300 C480,200 960,250 1440,180 L1440,300 L0,300 Z"
            fill="url(#duneGradient2)"
          />
        </svg>
      </div>
      
      {/* Vignette Effect */}
      <div className="absolute inset-0 gpu-accelerated pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 40%, hsl(25 40% 20% / 0.15) 100%)'
      }} />

      {/* Simplified Orbs - CSS animations for better performance */}
      <div className="absolute top-20 right-20 w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full bg-gradient-radial from-primary/40 to-transparent blur-[100px] opacity-35 gpu-accelerated animate-pulse-slow" />
      <div className="absolute bottom-20 left-20 w-[350px] h-[350px] md:w-[500px] md:h-[500px] rounded-full bg-gradient-radial from-accent/30 to-transparent blur-[120px] opacity-30 gpu-accelerated animate-pulse-slow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full bg-gradient-radial from-orange-400/10 to-transparent blur-[150px] opacity-25 gpu-accelerated" />

      {/* Floating Geometric Shapes - CSS animations - Desktop only */}
      <div className="hidden lg:block absolute top-24 left-[12%] w-16 h-16 border-2 border-white/25 rounded-2xl backdrop-blur-sm gpu-accelerated animate-float" />
      <div className="hidden lg:block absolute bottom-32 right-[18%] w-24 h-24 border-2 border-white/20 rounded-full backdrop-blur-sm gpu-accelerated animate-float-delayed" />
      <div className="hidden lg:block absolute top-1/3 right-[8%] w-14 h-14 bg-white/15 rounded-xl rotate-45 backdrop-blur-sm gpu-accelerated animate-float" style={{ animationDelay: '1s' }} />

      <motion.div 
        style={{ opacity, scale }} 
        className="container mx-auto px-4 lg:px-8 relative z-10 pt-20 md:pt-24"
      >
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-5 md:space-y-8">
            {/* Desktop Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={snappyTransition}
              className="hidden md:flex flex-wrap items-center justify-center lg:justify-start gap-3"
            >
              {/* Excellence Badge */}
              <div className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md rounded-full border border-white/25 touch-target">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="text-sm font-body-medium text-white/90 tracking-widest uppercase">
                  Excellence Since 1965
                </span>
              </div>
              
              {/* Serving Badge */}
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...snappyTransition, delay: 0.1 }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/30 to-accent/30 backdrop-blur-md rounded-full border border-white/20 touch-target"
              >
                <MapPin className="w-4 h-4 text-green-400" />
                <span className="text-sm font-body-medium text-white/90 tracking-wide">
                  Proudly Serving Katihar, Bihar & All Over India
                </span>
              </motion.div>
              
              {/* Projects Badge */}
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...snappyTransition, delay: 0.2 }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/30 to-orange-500/30 backdrop-blur-md rounded-full border border-white/20 touch-target"
              >
                <Trophy className="w-4 h-4 text-amber-300" />
                <span className="text-sm font-body-medium text-white/90 tracking-wide">
                  50,000+ Projects Completed
                </span>
              </motion.div>
            </motion.div>

            {/* Mobile Marquee Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={snappyTransition}
              className="md:hidden overflow-hidden relative"
            >
              {/* Gradient masks for smooth fade */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-primary/80 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-primary/80 to-transparent z-10 pointer-events-none" />
              
              {/* Scrolling container */}
              <div className="flex animate-marquee">
                {/* First set of badges */}
                <div className="flex gap-3 shrink-0 pr-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md rounded-full border border-white/25 whitespace-nowrap">
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    <span className="text-sm font-body-medium text-white/90 tracking-wide uppercase">
                      Excellence Since 1965
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/30 to-accent/30 backdrop-blur-md rounded-full border border-white/20 whitespace-nowrap">
                    <MapPin className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-body-medium text-white/90 tracking-wide">
                      Proudly Serving Katihar, Bihar & All Over India
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/30 to-orange-500/30 backdrop-blur-md rounded-full border border-white/20 whitespace-nowrap">
                    <Trophy className="w-4 h-4 text-amber-300" />
                    <span className="text-sm font-body-medium text-white/90 tracking-wide">
                      50,000+ Projects Completed
                    </span>
                  </div>
                </div>
                
                {/* Duplicate set for seamless loop */}
                <div className="flex gap-3 shrink-0 pr-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md rounded-full border border-white/25 whitespace-nowrap">
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    <span className="text-sm font-body-medium text-white/90 tracking-wide uppercase">
                      Excellence Since 1965
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/30 to-accent/30 backdrop-blur-md rounded-full border border-white/20 whitespace-nowrap">
                    <MapPin className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-body-medium text-white/90 tracking-wide">
                      Proudly Serving Katihar, Bihar & All Over India
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/30 to-orange-500/30 backdrop-blur-md rounded-full border border-white/20 whitespace-nowrap">
                    <Trophy className="w-4 h-4 text-amber-300" />
                    <span className="text-sm font-body-medium text-white/90 tracking-wide">
                      50,000+ Projects Completed
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...snappyTransition, delay: 0.1 }}
              className="font-display-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] tracking-tight"
            >
              {firstPart}
              <span className="block mt-2 lg:mt-3 font-display-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-primary-foreground to-orange-200">
                {secondPart}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...snappyTransition, delay: 0.2 }}
              className="text-base sm:text-lg text-white/85 font-body-regular leading-relaxed max-w-lg"
            >
              {settings.hero_subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...snappyTransition, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <Link to="/products">
                <Button
                  size="lg"
                  className="w-full sm:w-auto group bg-white hover:bg-white/95 text-primary font-display-semibold tracking-wide text-base px-6 md:px-8 shadow-lg btn-snappy touch-target"
                >
                  Explore Products
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  size="lg"
                  className="w-full sm:w-auto font-display-semibold tracking-wide text-base px-6 md:px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg btn-snappy touch-target"
                >
                  Get a Quote
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...snappyTransition, delay: 0.4 }}
              className="grid grid-cols-3 gap-4 md:gap-6 pt-6 md:pt-8 border-t border-white/20"
            >
              {[
                { value: "61+", label: "Years Experience" },
                { value: "50k+", label: "Projects Completed" },
                { value: "100%", label: "Client Satisfaction" },
              ].map((stat, index) => (
                <div 
                  key={index} 
                  className="text-center card-snappy"
                >
                  <div className="font-display-bold text-2xl sm:text-3xl md:text-4xl text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-white/70 font-body-medium mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Content - Interactive Service Cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Main Card Container */}
              <div className="relative z-20 bg-white/10 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-white/20 shadow-2xl gpu-accelerated">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: BookOpen, label: "Book Printing", desc: "Premium quality books", href: "/products?category=Books" },
                    { icon: Package, label: "Packaging", desc: "Custom solutions", href: "/products?category=Packaging" },
                    { icon: FileText, label: "Commercial", desc: "Business materials", href: "/products?category=Stationery" },
                    { icon: Sparkles, label: "Specialty", desc: "Unique finishes", href: "/products?category=Invitations" },
                  ].map((item, index) => (
                    <Link to={item.href} key={index}>
                      <div
                        className="relative overflow-hidden bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md rounded-2xl p-4 lg:p-5 border border-white/20 cursor-pointer group touch-target gpu-accelerated transition-all duration-200 ease-out hover:scale-[1.03] hover:-translate-y-1 active:scale-[0.98]"
                        style={{ 
                          animationDelay: `${0.4 + index * 0.1}s`,
                          transform: 'translateZ(0)'
                        }}
                      >
                        {/* Gradient background on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out" />
                        
                        {/* Icon */}
                        <div className="relative z-10 mb-3">
                          <item.icon className="w-8 h-8 lg:w-9 lg:h-9 text-white group-hover:text-primary-foreground transition-colors duration-200" />
                        </div>
                        
                        <h3 className="font-display-semibold text-base lg:text-lg text-white relative z-10 group-hover:text-primary-foreground transition-colors duration-200">
                          {item.label}
                        </h3>
                        <p className="text-xs lg:text-sm text-white/70 font-body-regular mt-1 relative z-10 group-hover:text-white/90 transition-colors duration-200">
                          {item.desc}
                        </p>
                        
                        {/* Arrow indicator */}
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0">
                          <ArrowRight className="w-4 h-4 text-white/80" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Floating Shipping Badge */}
              <motion.div 
                className="absolute -top-4 -right-4 z-30"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.8 }}
              >
                <div className="flex items-center gap-2 bg-gradient-to-r from-primary to-orange-500 text-white px-5 py-2.5 rounded-2xl shadow-xl border border-white/20 hover:scale-105 transition-transform duration-200">
                  <Truck className="w-5 h-5 animate-[bounce_2s_ease-in-out_infinite]" style={{ animationDuration: '2s' }} />
                  <span className="text-sm font-display-semibold">Shipping All Over India</span>
                </div>
              </motion.div>

              {/* Decorative Elements */}
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/25 rounded-full blur-3xl gpu-accelerated animate-pulse-slow" />
              <div className="absolute -top-10 -left-10 w-28 h-28 border-2 border-white/15 rounded-full gpu-accelerated" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Static Bottom Wave - No animation for better performance */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path 
            d="M0 120L60 105C120 90 240 75 360 70C480 65 600 70 720 78C840 86 960 96 1080 98C1200 100 1320 94 1380 91L1440 88V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="hsl(35 30% 96%)"
          />
        </svg>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <button
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          className="flex flex-col items-center gap-2 touch-target btn-snappy"
          aria-label="Scroll down"
        >
          <span className="text-xs text-white/60 font-body-medium tracking-widest uppercase">Scroll</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-bounce" />
          </div>
        </button>
      </motion.div>
    </section>
  );
}
