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
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <Link to={`/products/${id}`} className="group block">
        <div className="relative overflow-hidden rounded-2xl bg-card border border-border shadow-sm gpu-accelerated transition-all duration-200 ease-out hover:shadow-xl hover:border-primary/30 hover:-translate-y-2 active:scale-[0.98]">
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
            <img
              src={image}
              alt={title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-110"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />

            {/* Category Badge */}
            <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-full shadow-sm transition-transform duration-200 group-hover:scale-105">
              <span className="text-xs font-display-semibold text-primary tracking-wide uppercase">
                {category}
              </span>
            </div>

            {/* Floating Arrow */}
            <div className="absolute bottom-4 right-4 w-11 h-11 md:w-12 md:h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 ease-out translate-y-4 group-hover:translate-y-0 shadow-lg touch-target">
              <ArrowUpRight className="w-5 h-5 transition-transform duration-200 group-hover:rotate-45" />
            </div>
          </div>

          {/* Content */}
          <div className="p-5 md:p-6 space-y-2 md:space-y-3">
            <h3 className="font-display-semibold text-lg md:text-xl text-foreground group-hover:text-primary transition-colors duration-200">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground font-body-regular leading-relaxed line-clamp-2">
              {description}
            </p>
            
            {/* Read More Link */}
            <div className="flex items-center gap-2 text-primary font-body-medium text-sm pt-1 md:pt-2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
              <span>Learn more</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>

          {/* Bottom Accent Line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        </div>
      </Link>
    </motion.div>
  );
}