import { motion, useScroll, useTransform } from "framer-motion";
import { Award, CheckCircle, Users, Zap, Printer, BookOpen, Palette, Star } from "lucide-react";
import { useRef } from "react";
import printingPressImage from "@/assets/printing-press.jpg";

const features = [
  {
    icon: Award,
    title: "38+ Years Legacy",
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

const floatingIcons = [
  { icon: Printer, delay: 0, x: "10%", y: "20%" },
  { icon: BookOpen, delay: 0.5, x: "85%", y: "15%" },
  { icon: Palette, delay: 1, x: "75%", y: "70%" },
  { icon: Star, delay: 1.5, x: "15%", y: "75%" },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
  const imageRotate = useTransform(scrollYProgress, [0, 1], [-3, 3]);

  return (
    <section ref={sectionRef} className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 opacity-30"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.1),transparent_50%)]" />
      </motion.div>

      {/* Floating Icons */}
      {floatingIcons.map((item, index) => (
        <motion.div
          key={index}
          className="absolute hidden lg:block"
          style={{ left: item.x, top: item.y }}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 0.15, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: item.delay, duration: 0.5 }}
        >
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 4 + index, 
              ease: "easeInOut",
              delay: item.delay 
            }}
          >
            <item.icon className="w-16 h-16 text-primary/40" strokeWidth={1} />
          </motion.div>
        </motion.div>
      ))}

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <div className="space-y-8">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-sm font-display-light tracking-widest uppercase text-primary"
            >
              About Litho Art Press
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display-bold text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight"
            >
              A Heritage of
              <motion.span 
                className="block font-display-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-500 to-accent"
                initial={{ backgroundPosition: "0% 50%" }}
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                style={{ backgroundSize: "200% auto" }}
              >
                Printing Excellence
              </motion.span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground font-body-regular leading-relaxed text-lg"
            >
              Founded in 1985 in the heart of Bihar, Litho Art Press has grown
              from a modest printing workshop to one of the region's most
              respected printing houses. Our commitment to quality,
              craftsmanship, and customer satisfaction remains unwavering.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground font-body-regular leading-relaxed"
            >
              We blend time-honored lithographic techniques with cutting-edge
              digital technology to deliver prints that speak volumes about your
              brand. Every project, whether a single business card or a
              thousand-page book, receives our undivided attention.
            </motion.p>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="grid sm:grid-cols-2 gap-6 pt-6"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex gap-4 p-3 rounded-xl hover:bg-card/50 transition-colors duration-300 cursor-default"
                >
                  <motion.div 
                    className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon className="w-6 h-6 text-primary" />
                  </motion.div>
                  <div>
                    <h4 className="font-display-semibold text-foreground mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-muted-foreground font-body-regular">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right - Visual with Outstanding Animations */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative">
              
              {/* Corner Decorative Lines */}
              <div className="absolute -top-8 -left-8 w-24 h-24">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary/40 to-transparent" />
                <div className="absolute top-0 left-0 h-full w-[2px] bg-gradient-to-b from-primary/40 to-transparent" />
              </div>
              <div className="absolute -bottom-8 -right-8 w-24 h-24">
                <div className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-l from-primary/40 to-transparent" />
                <div className="absolute bottom-0 right-0 h-full w-[2px] bg-gradient-to-t from-primary/40 to-transparent" />
              </div>

              {/* Geometric Shapes */}
              <div className="absolute -top-6 right-1/4 w-8 h-8 border border-primary/20 rotate-45" />
              <div className="absolute -bottom-4 left-1/3 w-6 h-6 border border-accent/25 rotate-12" />
              
              {/* Glowing Orbs */}
              <motion.div
                className="absolute -top-10 -right-10 w-32 h-32 bg-primary/30 rounded-full blur-3xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/25 rounded-full blur-3xl"
                animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />

              {/* Dotted Pattern Accents */}
              <div className="absolute -right-12 top-1/4 flex flex-col gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/30" />
                ))}
              </div>
              <div className="absolute -left-10 bottom-1/4 flex flex-col gap-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-accent/30" />
                ))}
              </div>

              {/* Main Image with Parallax */}
              <motion.div 
                style={{ scale: imageScale }}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative rounded-2xl overflow-hidden shadow-2xl"
              >
                <motion.img
                  src={printingPressImage}
                  alt="Printing Press"
                  className="w-full aspect-[4/5] object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
                
                {/* Animated Overlay Pattern */}
                <motion.div 
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `repeating-linear-gradient(
                      45deg,
                      transparent,
                      transparent 10px,
                      hsl(var(--primary)) 10px,
                      hsl(var(--primary)) 11px
                    )`
                  }}
                  animate={{ backgroundPosition: ["0px 0px", "20px 20px"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>

              {/* Floating Stats Cards - Glassmorphism with fast CSS transitions */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="absolute -bottom-6 -left-6 p-5 rounded-xl shadow-2xl backdrop-blur-xl bg-card/80 border border-white/20 dark:border-white/10 transition-transform duration-150 ease-out hover:scale-105 hover:-translate-y-1 will-change-transform"
                style={{
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  transform: 'translateZ(0)'
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-14 h-14 bg-gradient-to-br from-primary to-orange-500 rounded-full flex items-center justify-center shadow-lg"
                    style={{
                      boxShadow: '0 4px 15px rgba(var(--primary), 0.4)'
                    }}
                  >
                    <span className="font-display-extrabold text-xl text-primary-foreground">
                      38
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
              </motion.div>

              {/* Second Floating Card - Glassmorphism with fast CSS transitions */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.4 }}
                className="absolute -top-4 -right-4 p-4 rounded-xl shadow-2xl backdrop-blur-xl bg-card/80 border border-white/20 dark:border-white/10 transition-transform duration-150 ease-out hover:scale-105 hover:-translate-y-1 will-change-transform"
                style={{
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  transform: 'translateZ(0)'
                }}
              >
                <div className="flex items-center gap-3">
                  <Star className="w-8 h-8 text-primary fill-primary/20" />
                  <div>
                    <p className="font-display-bold text-2xl text-foreground">5000+</p>
                    <p className="text-xs text-muted-foreground font-body-medium">Projects Done</p>
                  </div>
                </div>
              </motion.div>

              {/* Decorative Circles */}
              <div className="absolute -top-4 -left-4 w-20 h-20 border-2 border-primary/20 rounded-full" />
              <motion.div 
                className="absolute top-1/2 -right-8 w-4 h-4 bg-primary rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div 
                className="absolute bottom-1/3 -left-6 w-3 h-3 bg-accent rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              />

              {/* Plus Signs */}
              <div className="absolute -top-12 left-1/4 text-primary/20 text-2xl font-light">+</div>
              <div className="absolute -bottom-10 right-1/4 text-accent/25 text-xl font-light">+</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}