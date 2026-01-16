import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

// Map service IDs to product categories
const categoryMapping: Record<string, string> = {
  "book-printing": "Books",
  "packaging": "Packaging",
  "commercial": "Commercial",
  "stationery": "Stationery",
  "invitations": "Invitations",
  "labels": "Labels",
};

const categories = ["All", "Books", "Packaging", "Stationery", "Invitations", "Commercial", "Labels"];

const allProducts = [
  {
    id: "1",
    title: "Premium Book Printing",
    description: "High-quality hardcover and softcover book printing with premium paper stock and binding options.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
    category: "Books",
  },
  {
    id: "2",
    title: "Luxury Packaging",
    description: "Custom designed packaging solutions with elegant finishes, embossing, and foil stamping.",
    image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&q=80",
    category: "Packaging",
  },
  {
    id: "3",
    title: "Business Stationery",
    description: "Professional letterheads, business cards, and envelopes with sophisticated designs.",
    image: "https://images.unsplash.com/photo-1586953208270-767889fa9b8f?w=800&q=80",
    category: "Stationery",
  },
  {
    id: "4",
    title: "Wedding Invitations",
    description: "Bespoke wedding cards and invitations with traditional and modern artistic elements.",
    image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&q=80",
    category: "Invitations",
  },
  {
    id: "5",
    title: "Coffee Table Books",
    description: "Stunning coffee table books with premium photo printing and archival quality.",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80",
    category: "Books",
  },
  {
    id: "6",
    title: "Product Boxes",
    description: "Custom product packaging that enhances brand perception and product value.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    category: "Packaging",
  },
  {
    id: "7",
    title: "Corporate Folders",
    description: "Professional presentation folders with pockets and custom finishing options.",
    image: "https://images.unsplash.com/photo-1568205631071-2b29ab9c83cb?w=800&q=80",
    category: "Stationery",
  },
  {
    id: "8",
    title: "Brochures & Catalogs",
    description: "High-impact brochures and catalogs that showcase your products beautifully.",
    image: "https://images.unsplash.com/photo-1572883454114-1cf0031ede2a?w=800&q=80",
    category: "Commercial",
  },
  {
    id: "9",
    title: "Posters & Banners",
    description: "Large format printing for posters, banners, and exhibition displays.",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80",
    category: "Commercial",
  },
  {
    id: "10",
    title: "Annual Reports",
    description: "Professional annual report printing with binding and finishing options.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
    category: "Commercial",
  },
  {
    id: "11",
    title: "Gift Boxes",
    description: "Elegant gift packaging with custom inserts and premium finishing.",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80",
    category: "Packaging",
  },
  {
    id: "12",
    title: "Event Invitations",
    description: "Custom event invitations for corporate and social occasions.",
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80",
    category: "Invitations",
  },
  {
    id: "13",
    title: "Product Labels",
    description: "Custom die-cut labels and stickers for branding and product identification.",
    image: "https://images.unsplash.com/photo-1635405074683-96d6921a2a68?w=800&q=80",
    category: "Labels",
  },
  {
    id: "14",
    title: "Roll Labels",
    description: "High-volume roll labels for industrial and retail applications.",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80",
    category: "Labels",
  },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("All");

  // Read category from URL on mount and when URL changes
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      // Map the service ID to the category name
      const mappedCategory = categoryMapping[categoryParam];
      if (mappedCategory && categories.includes(mappedCategory)) {
        setActiveCategory(mappedCategory);
      }
    }
  }, [searchParams]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    // Update URL when category changes
    if (category === "All") {
      setSearchParams({});
    } else {
      // Find the service ID for this category
      const serviceId = Object.entries(categoryMapping).find(([, cat]) => cat === category)?.[0];
      if (serviceId) {
        setSearchParams({ category: serviceId });
      }
    }
  };

  const filteredProducts = activeCategory === "All"
    ? allProducts
    : allProducts.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block text-sm font-elegant tracking-widest uppercase text-primary mb-4">
              Our Collection
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Premium Print
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Solutions</span>
            </h1>
            <p className="text-muted-foreground font-body text-lg">
              Explore our comprehensive range of printing services, each crafted
              with precision and excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border sticky top-20 bg-background/95 backdrop-blur-sm z-40">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                onClick={() => handleCategoryChange(category)}
                className="font-elegant tracking-wide"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} {...product} index={index} />
            ))}
          </motion.div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground font-elegant text-lg">
                No products found in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
