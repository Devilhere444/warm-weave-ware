import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  index: number;
}

export default function ProductCard({
  id,
  title,
  description,
  image,
  category,
  index,
}: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/products/${id}`} className="group block">
        <div className="relative overflow-hidden rounded-2xl bg-card border border-border transition-all duration-500 hover:shadow-xl hover:border-accent/30">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Floating Arrow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              className="absolute bottom-4 right-4 w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0"
            >
              <ArrowUpRight className="w-5 h-5" />
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-3">
            <span className="text-xs font-elegant tracking-widest uppercase text-accent">
              {category}
            </span>
            <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground font-body leading-relaxed line-clamp-2">
              {description}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
