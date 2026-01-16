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

  return (
    <section className="relative py-16 md:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-sand-pattern" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-primary/20 blur-[100px] opacity-15" />
      <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-accent/15 blur-[120px] opacity-10" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 md:mb-20">
          <span className="inline-block text-xs md:text-sm font-body-semibold tracking-[0.15em] md:tracking-[0.2em] uppercase text-primary mb-3 md:mb-4">
            Our Expertise
          </span>
          <h2 className="font-display-bold text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-foreground mb-4 md:mb-6 leading-tight">
            <span className="text-gradient-primary">Featured</span> Products
          </h2>
          <p className="text-muted-foreground font-body-regular text-sm md:text-lg max-w-2xl mx-auto leading-relaxed px-2">
            Discover our range of premium printing solutions crafted with
            precision and excellence.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8 mb-10 md:mb-16">
          {featuredProducts.map((product, index) => (
            <ProductCard key={product.id} {...product} index={index} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/products">
            <Button
              size="lg"
              variant="outline"
              className="group font-display-semibold tracking-wide text-sm md:text-lg px-6 md:px-10 py-5 md:py-6 border-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all duration-200 btn-snappy touch-target"
            >
              View All Products
              <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
