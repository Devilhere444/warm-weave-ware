import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";

interface RelatedProductsProps {
  currentProductId: string;
  category: string;
  allProducts: Array<{
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
  }>;
}

export default function RelatedProducts({
  currentProductId,
  category,
  allProducts,
}: RelatedProductsProps) {
  const relatedProducts = allProducts
    .filter((p) => p.category === category && p.id !== currentProductId)
    .slice(0, 4);

  if (relatedProducts.length === 0) return null;

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block text-sm font-elegant tracking-widest uppercase text-accent mb-4">
            More in {category}
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Related <span className="text-gradient-gold">Products</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product, index) => (
            <ProductCard key={product.id} {...product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
