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
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: "easeOut" }}
    >
      <Link to={`/products/${id}`} className="group block">
        <motion.div 
          whileHover={{ y: -10 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-2xl bg-card border border-border shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-500"
        >
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
            <motion.img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.6 }}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

            {/* Category Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full"
            >
              <span className="text-xs font-display font-semibold text-primary tracking-wide">
                {category}
              </span>
            </motion.div>

            {/* Floating Arrow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              whileHover={{ scale: 1.1 }}
              className="absolute bottom-4 right-4 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 shadow-lg"
            >
              <ArrowUpRight className="w-5 h-5" />
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-3">
            <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground font-body leading-relaxed line-clamp-2">
              {description}
            </p>
            
            {/* Read More Link */}
            <motion.div 
              className="flex items-center gap-2 text-primary font-body text-sm font-medium pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <span>Learn more</span>
              <ArrowUpRight className="w-4 h-4" />
            </motion.div>
          </div>

          {/* Bottom Accent Line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
          />
        </motion.div>
      </Link>
    </motion.div>
  );
}
