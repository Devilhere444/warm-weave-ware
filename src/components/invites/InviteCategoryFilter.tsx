import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface InviteCategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  categoryLabels: Record<string, string>;
}

export default function InviteCategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
  categoryLabels
}: InviteCategoryFilterProps) {
  return (
    <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-2">
            {categories.map((category) => (
              <motion.div key={category} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => onCategoryChange(category)}
                  className={`rounded-full px-5 transition-all duration-200 ${
                    activeCategory === category 
                      ? "bg-accent hover:bg-accent/90 text-white shadow-lg" 
                      : "hover:bg-accent/10 hover:border-accent/30"
                  }`}
                >
                  {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              </motion.div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
      </div>
    </div>
  );
}
