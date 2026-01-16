import { motion } from "framer-motion";
import { Truck, Shield, Clock, Award, Users, Sparkles } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "60+ Years Experience",
    description: "Trusted expertise since 1965, delivering excellence across generations",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Truck,
    title: "Pan India Delivery",
    description: "Fast & reliable shipping to every corner of the country",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Shield,
    title: "Quality Guarantee",
    description: "Premium materials & meticulous craftsmanship on every project",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Award,
    title: "Competitive Pricing",
    description: "Best value without compromising on print quality",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Users,
    title: "Dedicated Support",
    description: "Personal attention from quote to delivery, every step of the way",
    gradient: "from-rose-500 to-red-500",
  },
  {
    icon: Sparkles,
    title: "Custom Solutions",
    description: "Tailored printing solutions to match your unique requirements",
    gradient: "from-indigo-500 to-violet-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 24,
    },
  },
};

export default function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Why Litho Art Press?
          </span>
          <h2 className="font-display-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Your Trusted Printing Partner
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We combine traditional craftsmanship with modern technology to deliver exceptional print solutions
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              <div className="relative h-full bg-card rounded-2xl p-6 md:p-8 border border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-primary/20 overflow-hidden">
                {/* Gradient hover effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} mb-5 shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="font-display-semibold text-xl text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Decorative corner */}
                <div className={`absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br ${feature.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-300`} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12 md:mt-16"
        >
          <p className="text-muted-foreground mb-4">
            Ready to experience the difference?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Get Your Free Quote
            <Truck className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
