import { motion } from "framer-motion";
import { Award, CheckCircle, Users, Zap } from "lucide-react";

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

export default function About() {
  return (
    <section className="py-24 bg-background wood-grain-bg">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <div className="space-y-8">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-sm font-elegant tracking-widest uppercase text-accent"
            >
              About Litho Art Press
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight"
            >
              A Heritage of
              <span className="text-gradient-gold block">Printing Excellence</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground font-body leading-relaxed text-lg"
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
              className="text-muted-foreground font-body leading-relaxed"
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
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-foreground mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-muted-foreground font-body">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1588412079929-790b9f593d8e?w=800&q=80"
                  alt="Printing Press"
                  className="w-full aspect-[4/5] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
              </div>

              {/* Floating Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-xl border border-border"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                    <span className="font-display text-2xl font-bold text-accent-foreground">
                      38
                    </span>
                  </div>
                  <div>
                    <p className="font-display text-lg font-semibold text-foreground">
                      Years of
                    </p>
                    <p className="text-muted-foreground font-elegant">
                      Excellence
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Decorative */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-2xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
