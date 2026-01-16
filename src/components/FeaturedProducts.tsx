import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";

const featuredProducts = [
  {
    id: "1",
    title: "Premium Book Printing",
    description:
      "High-quality hardcover and softcover book printing with premium paper stock and binding options.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
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
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-sm font-elegant tracking-widest uppercase text-accent mb-4"
          >
            Our Expertise
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6"
          >
            Featured Products
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground font-body max-w-2xl mx-auto"
          >
            Discover our range of premium printing solutions crafted with
            precision and excellence.
          </motion.p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredProducts.map((product, index) => (
            <ProductCard key={product.id} {...product} index={index} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link to="/products">
            <Button
              size="lg"
              variant="outline"
              className="group font-elegant tracking-wide text-lg px-8 border-2"
            >
              View All Products
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
