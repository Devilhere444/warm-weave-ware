import { Award, CheckCircle, Users, Zap, Star } from "lucide-react";
import printingPressImage from "@/assets/printing-press.jpg";

const features = [
  {
    icon: Award,
    title: "61+ Years Legacy",
    description:
      "Trusted by generations of businesses across Bihar and beyond.",
  },
  {
    icon: Zap,
    title: "Modern Technology",
    description:
      "State-of-the-art printing machinery combined with traditional craftsmanship.",
  },
  {
    icon: Users,
    title: "Expert Team",
    description:
      "Skilled artisans and technicians dedicated to perfection.",
  },
  {
    icon: CheckCircle,
    title: "Quality Assured",
    description:
      "ISO certified processes ensuring consistent excellence.",
  },
];

export default function About() {
  return (
    <section className="py-16 md:py-24 bg-muted/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.1),transparent_50%)]" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left - Content */}
          <div className="space-y-5 md:space-y-8">
            <span className="inline-block text-xs md:text-sm font-display-light tracking-widest uppercase text-primary">
              About Litho Art Press
            </span>

            <h2 className="font-display-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight">
              A Heritage of
              <span className="block font-display-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-500 to-accent">
                Printing Excellence
              </span>
            </h2>

            <p className="text-muted-foreground font-body-regular leading-relaxed text-base md:text-lg">
              Founded in 1965 in the heart of Bihar, Litho Art Press has grown
              from a modest printing workshop to one of the region's most
              respected printing houses. Proudly serving Katihar and nearby Bihar regions, 
              and across all over India. Our commitment to quality,
              craftsmanship, and customer satisfaction remains unwavering.
            </p>

            <p className="text-muted-foreground font-body-regular leading-relaxed text-sm md:text-base">
              We blend time-honored lithographic techniques with cutting-edge
              digital technology to deliver prints that speak volumes about your
              brand. Every project, whether a single business card or a
              thousand-page book, receives our undivided attention.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 md:gap-6 pt-4 md:pt-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex gap-3 md:gap-4 p-2 md:p-3 rounded-xl hover:bg-card/50 transition-colors duration-200 cursor-default"
                >
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-display-semibold text-sm md:text-base text-foreground mb-0.5 md:mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-xs md:text-sm text-muted-foreground font-body-regular leading-snug">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Visual */}
          <div className="relative">
            <div className="relative">
              {/* Corner Decorative Lines */}
              <div className="absolute -top-8 -left-8 w-24 h-24 hidden lg:block">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary/40 to-transparent" />
                <div className="absolute top-0 left-0 h-full w-[2px] bg-gradient-to-b from-primary/40 to-transparent" />
              </div>
              <div className="absolute -bottom-8 -right-8 w-24 h-24 hidden lg:block">
                <div className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-l from-primary/40 to-transparent" />
                <div className="absolute bottom-0 right-0 h-full w-[2px] bg-gradient-to-t from-primary/40 to-transparent" />
              </div>

              {/* Main Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={printingPressImage}
                  alt="Printing Press"
                  className="w-full aspect-[4/5] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
              </div>

              {/* Years Card */}
              <div
                className="absolute -bottom-6 -left-6 p-5 rounded-xl shadow-2xl backdrop-blur-xl bg-card/80 border border-white/20 dark:border-white/10"
                style={{
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-14 h-14 bg-gradient-to-br from-primary to-orange-500 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <span className="font-display-extrabold text-xl text-primary-foreground">
                      61
                    </span>
                  </div>
                  <div>
                    <p className="font-display-semibold text-lg text-foreground">
                      Years of
                    </p>
                    <p className="text-muted-foreground font-display-light">
                      Excellence
                    </p>
                  </div>
                </div>
              </div>

              {/* Projects Card */}
              <div
                className="absolute -top-4 -right-4 p-4 rounded-xl shadow-2xl backdrop-blur-xl bg-card/80 border border-white/20 dark:border-white/10 hidden sm:block"
                style={{
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                }}
              >
                <div className="flex items-center gap-3">
                  <Star className="w-8 h-8 text-primary fill-primary/20" />
                  <div>
                    <p className="font-display-bold text-2xl text-foreground">1 Lakh+</p>
                    <p className="text-xs text-muted-foreground font-body-medium">Projects Done</p>
                  </div>
                </div>
              </div>

              {/* Decorative Circle */}
              <div className="absolute -top-4 -left-4 w-20 h-20 border-2 border-primary/20 rounded-full hidden lg:block" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
