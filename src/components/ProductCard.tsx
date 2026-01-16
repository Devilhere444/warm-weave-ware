import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { hapticFeedback } from "@/hooks/useHapticFeedback";

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
  const handleClick = () => {
    hapticFeedback('light');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <Link to={`/products/${id}`} className="group block" onClick={handleClick}>
        <div className="relative overflow-hidden rounded-2xl bg-card border border-border shadow-sm card-snappy gpu-accelerated hover:shadow-xl hover:border-primary/20">
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
            <img
              src={image}
              alt={title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Category Badge */}
            <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full">
              <span className="text-xs font-display font-semibold text-primary tracking-wide">
                {category}
              </span>
            </div>

            {/* Floating Arrow */}
            <div className="absolute bottom-4 right-4 w-11 h-11 md:w-12 md:h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-4 group-hover:translate-y-0 shadow-lg touch-target">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>

          {/* Content */}
          <div className="p-5 md:p-6 space-y-2 md:space-y-3">
            <h3 className="font-display text-lg md:text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground font-body leading-relaxed line-clamp-2">
              {description}
            </p>
            
            {/* Read More Link */}
            <div className="flex items-center gap-2 text-primary font-body text-sm font-medium pt-1 md:pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span>Learn more</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          {/* Bottom Accent Line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        </div>
      </Link>
    </motion.div>
  );
}
