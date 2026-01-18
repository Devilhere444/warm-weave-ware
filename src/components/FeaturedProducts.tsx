import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";
import { useRef } from "react";

const featuredProducts = [
  {
    id: "1",
    title: "Premium Book Printing",
    description:
      "High-quality hardcover and softcover book printing with premium paper stock and binding options.",
    image: "https://images.unsplash.com/photo-544716278-ca5e3f4abd8c?w=800&q=80",
    category: "Books",
  },
  {
    id: "2",
    title: "Luxury Packaging",
    description:
      "Custom designed packaging solutions with elegant finishes, embossing, and foil stamping.",
    image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&q=80",
    category: "Packaging",
  },
  {
    id: "3",
    title: "Business Stationery",
    description:
      "Professional letterheads, business cards, and envelopes with sophisticated designs.",
    image: "https://images.unsplash.com/photo-1586953208270-767889fa9b8f?w=800&q=80",
    category: "Stationery",
  },
  {
    id: "4",
    title: "Wedding Invitations",
    description:
      "Bespoke wedding cards and invitations with traditional and modern artistic elements.",
    image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&q=80",
    category: "Invitations",
  },
];

export default function FeaturedProducts() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section ref={sectionRef} className="relative py-28 overflow-hidden">
      {/* Animated Background */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 bg-ocean-pattern"
      />
      
      {/* Decorative Elements - Blue theme */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.2, scale: 1 }}
        viewport={{ once: true }}
        className="absolute top-20 right-10 w-72 h-72 rounded-full bg-primary/25 blur-[100px]"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.15, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-cyan-400/15 blur-[120px]"
      />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.1 }}
        viewport={{ once: true }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-secondary/20 blur-[150px]"
      />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header with Stagger Animation */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-sm font-body-semibold tracking-[0.2em] uppercase text-primary mb-4"
          >
            Our Expertise
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display-bold text-4xl md:text-5xl lg:text-6xl text-foreground mb-6"
          >
            <span className="text-gradient-primary">Featured</span> Products
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground font-body-regular text-lg max-w-2xl mx-auto"
          >
            Discover our range of premium printing solutions crafted with
            precision and excellence.
          </motion.p>
        </div>

        {/* Products Grid with Staggered Animation */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {featuredProducts.map((product, index) => (
            <ProductCard key={product.id} {...product} index={index} />
          ))}
        </div>

        {/* CTA with Hover Effect */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link to="/products">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                variant="outline"
                className="group font-display-semibold tracking-wide text-lg px-10 py-6 border-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all duration-300"
              >
                View All Products
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1.5" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
