import { ArrowRight, Sparkles, BookOpen, Package, FileText, Truck, Trophy, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function Hero() {
  const { settings } = useSiteSettings();

  // Split hero title for styling
  const heroTitleParts = settings.hero_title.split(" ");
  const firstPart = heroTitleParts.slice(0, Math.ceil(heroTitleParts.length / 2)).join(" ");
  const secondPart = heroTitleParts.slice(Math.ceil(heroTitleParts.length / 2)).join(" ");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-hero-gradient" />
      
      {/* Static Sand Dunes Effect */}
      <div className="absolute inset-0">
        <svg className="absolute bottom-0 w-full h-[40%] opacity-20" viewBox="0 0 1440 400" preserveAspectRatio="none">
          <path
            d="M0,400 C360,300 720,350 1080,280 C1260,240 1380,300 1440,280 L1440,400 L0,400 Z"
            fill="hsl(38 40% 75%)"
          />
        </svg>
        <svg className="absolute bottom-0 w-full h-[30%] opacity-15" viewBox="0 0 1440 300" preserveAspectRatio="none">
          <path
            d="M0,300 C480,200 960,250 1440,180 L1440,300 L0,300 Z"
            fill="hsl(35 35% 70%)"
          />
        </svg>
      </div>

      {/* Static Orbs */}
      <div className="absolute top-20 right-20 w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full bg-gradient-radial from-primary/40 to-transparent blur-[100px] opacity-30" />
      <div className="absolute bottom-20 left-20 w-[350px] h-[350px] md:w-[500px] md:h-[500px] rounded-full bg-gradient-radial from-accent/30 to-transparent blur-[120px] opacity-25" />

      {/* Floating Geometric Shapes - Desktop only */}
      <div className="hidden md:block absolute top-24 left-[12%] w-16 h-16 border-2 border-white/25 rounded-2xl backdrop-blur-sm" />
      <div className="hidden md:block absolute bottom-32 right-[18%] w-24 h-24 border-2 border-white/20 rounded-full backdrop-blur-sm" />
      <div className="hidden lg:block absolute top-1/3 right-[8%] w-14 h-14 bg-white/15 rounded-xl rotate-45 backdrop-blur-sm" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-20 md:pt-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-5 md:space-y-8">
            {/* Badges - Same layout on mobile and desktop */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 md:gap-3">
              {/* Excellence Badge */}
              <div className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white/15 backdrop-blur-md rounded-full border border-white/25 touch-target">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="text-xs md:text-sm font-body-medium text-white/90 tracking-widest uppercase">
                  Excellence Since 1965
                </span>
              </div>
              
              {/* Serving Badge */}
              <div className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-r from-primary/30 to-accent/30 backdrop-blur-md rounded-full border border-white/20 touch-target">
                <MapPin className="w-4 h-4 text-green-400" />
                <span className="text-xs md:text-sm font-body-medium text-white/90 tracking-wide">
                  Proudly Serving Katihar, Bihar & All Over India
                </span>
              </div>
              
              {/* Projects Badge */}
              <div className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-r from-amber-500/30 to-orange-500/30 backdrop-blur-md rounded-full border border-white/20 touch-target">
                <Trophy className="w-4 h-4 text-amber-300" />
                <span className="text-xs md:text-sm font-body-medium text-white/90 tracking-wide">
                  50,000+ Projects Completed
                </span>
              </div>
            </div>

            <h1 className="font-display-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] tracking-tight text-center lg:text-left">
              {firstPart}
              <span className="block mt-2 lg:mt-3 font-display-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-primary-foreground to-orange-200">
                {secondPart}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-white/85 font-body-regular leading-relaxed max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
              {settings.hero_subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link to="/products" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full group bg-white hover:bg-white/95 text-primary font-display-semibold tracking-wide text-base px-6 md:px-8 shadow-lg btn-snappy touch-target"
                >
                  Explore Products
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-100 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/contact" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full font-display-semibold tracking-wide text-base px-6 md:px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg btn-snappy touch-target"
                >
                  Get a Quote
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-6 pt-6 md:pt-8 border-t border-white/20">
              {[
                { value: "61+", label: "Years Experience" },
                { value: "50k+", label: "Projects Completed" },
                { value: "100%", label: "Client Satisfaction" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="font-display-bold text-2xl sm:text-3xl md:text-4xl text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-white/70 font-body-medium mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Service Cards (Desktop only) */}
          <div className="relative hidden lg:block">
            <div className="relative">
              {/* Main Card Container */}
              <div className="relative z-20 bg-white/10 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-white/20 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: BookOpen, label: "Book Printing", desc: "Premium quality books", href: "/products?category=Books" },
                    { icon: Package, label: "Packaging", desc: "Custom solutions", href: "/products?category=Packaging" },
                    { icon: FileText, label: "Commercial", desc: "Business materials", href: "/products?category=Stationery" },
                    { icon: Sparkles, label: "Specialty", desc: "Unique finishes", href: "/products?category=Invitations" },
                  ].map((item, index) => (
                    <Link to={item.href} key={index}>
                      <div className="relative overflow-hidden bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md rounded-2xl p-4 lg:p-5 border border-white/20 cursor-pointer group touch-target transition-all duration-200 ease-out hover:scale-[1.03] hover:-translate-y-1 active:scale-[0.98]">
                        {/* Gradient background on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        
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
              <div className="absolute -top-4 -right-4 z-30">
                <div className="flex items-center gap-2 bg-gradient-to-r from-primary to-orange-500 text-white px-5 py-2.5 rounded-2xl shadow-xl border border-white/20 hover:scale-105 transition-transform duration-200">
                  <Truck className="w-5 h-5" />
                  <span className="text-sm font-display-semibold">Shipping All Over India</span>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/25 rounded-full blur-3xl" />
              <div className="absolute -top-10 -left-10 w-28 h-28 border-2 border-white/15 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Static Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path 
            d="M0 120L60 105C120 90 240 75 360 70C480 65 600 70 720 78C840 86 960 96 1080 98C1200 100 1320 94 1380 91L1440 88V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="hsl(35 30% 96%)"
          />
        </svg>
      </div>

      {/* Scroll Indicator - Desktop only */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-white/60">
        <span className="text-xs font-body-medium uppercase tracking-widest">Scroll</span>
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white/60 rounded-full" />
        </div>
      </div>
    </section>
  );
}
