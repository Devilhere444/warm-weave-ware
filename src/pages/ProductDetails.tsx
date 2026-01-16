import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Package, Truck, Shield, Clock, Plus, Minus, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RelatedProducts from "@/components/RelatedProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { useProductOptions } from "@/hooks/useProductOptions";

// Extended product data with specifications
const productsData: Record<string, {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  fullDescription: string;
  specifications: { label: string; value: string }[];
  finishOptions: string[];
  paperOptions: string[];
  bindingOptions?: string[];
  minQuantity: number;
  leadTime: string;
  priceRange: string;
}> = {
  "1": {
    id: "1",
    title: "Premium Book Printing",
    description: "High-quality hardcover and softcover book printing with premium paper stock and binding options.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
    category: "Books",
    fullDescription: "Our premium book printing service delivers exceptional quality for authors, publishers, and businesses. Using state-of-the-art printing technology and the finest materials, we create books that look and feel extraordinary. From coffee table books to novels, we handle projects of all sizes with the same attention to detail.",
    specifications: [
      { label: "Print Quality", value: "300 DPI / Offset Lithography" },
      { label: "Color Options", value: "Full Color CMYK / Pantone Matching" },
      { label: "Page Count", value: "24 - 500+ pages" },
      { label: "Trim Sizes", value: "5x8, 6x9, 8.5x11, Custom" },
      { label: "Cover Options", value: "Matte, Gloss, Soft-touch Lamination" },
    ],
    finishOptions: ["Matte Lamination", "Gloss Lamination", "Soft-touch", "Spot UV", "Foil Stamping"],
    paperOptions: ["80gsm Uncoated", "100gsm Silk", "120gsm Gloss", "150gsm Premium Matte"],
    bindingOptions: ["Perfect Bound", "Case Bound", "Saddle Stitch", "Spiral Bound", "Lay-flat Binding"],
    minQuantity: 25,
    leadTime: "7-14 business days",
    priceRange: "Starting from ₹150/copy",
  },
  "2": {
    id: "2",
    title: "Luxury Packaging",
    description: "Custom designed packaging solutions with elegant finishes, embossing, and foil stamping.",
    image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&q=80",
    category: "Packaging",
    fullDescription: "Elevate your brand with our luxury packaging solutions. We combine innovative design with premium materials to create packaging that makes a lasting impression. Our expert craftsmen specialize in embossing, foil stamping, and custom finishes that transform ordinary boxes into extraordinary experiences.",
    specifications: [
      { label: "Material Options", value: "Rigid Board, Corrugated, Kraft" },
      { label: "Printing", value: "Offset / Digital / Screen Print" },
      { label: "Thickness", value: "1.5mm - 3mm Rigid Board" },
      { label: "Custom Shapes", value: "Available" },
      { label: "Inserts", value: "EVA Foam, Velvet, Custom Die-cut" },
    ],
    finishOptions: ["Embossing", "Debossing", "Hot Foil Stamping", "Spot UV", "Texture Coating"],
    paperOptions: ["Art Paper Wrap", "Specialty Paper", "Kraft", "Velvet Touch"],
    minQuantity: 100,
    leadTime: "10-21 business days",
    priceRange: "Starting from ₹85/piece",
  },
  "3": {
    id: "3",
    title: "Business Stationery",
    description: "Professional letterheads, business cards, and envelopes with sophisticated designs.",
    image: "https://images.unsplash.com/photo-1586953208270-767889fa9b8f?w=800&q=80",
    category: "Stationery",
    fullDescription: "Make every correspondence count with our premium business stationery. From letterheads to business cards, we create cohesive brand materials that reflect your professionalism. Our attention to detail ensures every piece meets the highest standards of quality.",
    specifications: [
      { label: "Business Cards", value: "350gsm - 600gsm" },
      { label: "Letterheads", value: "100gsm - 120gsm Premium" },
      { label: "Envelopes", value: "DL, C5, C4, Custom" },
      { label: "Print Method", value: "Offset / Letterpress" },
      { label: "Color Accuracy", value: "Pantone Certified" },
    ],
    finishOptions: ["Matte", "Gloss", "Uncoated", "Textured", "Metallic"],
    paperOptions: ["Cotton Rag", "Laid", "Wove", "Recycled Premium"],
    minQuantity: 250,
    leadTime: "5-10 business days",
    priceRange: "Starting from ₹3/piece",
  },
  "4": {
    id: "4",
    title: "Wedding Invitations",
    description: "Bespoke wedding cards and invitations with traditional and modern artistic elements.",
    image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&q=80",
    category: "Invitations",
    fullDescription: "Your wedding invitation sets the tone for your special day. Our artisans blend traditional craftsmanship with contemporary design to create invitations that are as unique as your love story. From laser-cut details to hand-applied embellishments, every element is crafted with care.",
    specifications: [
      { label: "Card Size", value: "5x7, 6x6, A5, Custom" },
      { label: "Paper Weight", value: "300gsm - 600gsm" },
      { label: "Envelope Style", value: "Pocket, Classic, Box" },
      { label: "Inserts", value: "RSVP, Map, Itinerary" },
      { label: "Customization", value: "Full Design Service" },
    ],
    finishOptions: ["Letterpress", "Foil Stamping", "Laser Cut", "Wax Seal", "Ribbon Tie"],
    paperOptions: ["Handmade Cotton", "Italian Felt", "Pearl Shimmer", "Vellum"],
    minQuantity: 50,
    leadTime: "14-28 business days",
    priceRange: "Starting from ₹200/set",
  },
  "5": {
    id: "5",
    title: "Coffee Table Books",
    description: "Stunning coffee table books with premium photo printing and archival quality.",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80",
    category: "Books",
    fullDescription: "Create a visual masterpiece with our coffee table book printing. Perfect for photographers, artists, and brands who want to showcase their work in stunning detail. Our archival-quality printing ensures your images look breathtaking for generations.",
    specifications: [
      { label: "Print Quality", value: "Giclée / Fine Art Printing" },
      { label: "Paper Options", value: "Museum Grade Papers" },
      { label: "Standard Sizes", value: "10x10, 12x12, A3 Landscape" },
      { label: "Page Count", value: "40 - 200 pages" },
      { label: "Cover", value: "Cloth, Leather, Custom Print" },
    ],
    finishOptions: ["Dust Jacket", "Slipcase", "Debossed Cover", "Gilded Edges"],
    paperOptions: ["170gsm Silk", "200gsm Matte Art", "150gsm Mohawk Superfine"],
    bindingOptions: ["Lay-flat Binding", "Smyth Sewn", "Section Sewn"],
    minQuantity: 10,
    leadTime: "14-21 business days",
    priceRange: "Starting from ₹2,500/copy",
  },
  "6": {
    id: "6",
    title: "Product Boxes",
    description: "Custom product packaging that enhances brand perception and product value.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    category: "Packaging",
    fullDescription: "Transform your product presentation with custom packaging that tells your brand story. Our product boxes are designed to protect, display, and elevate your merchandise. From e-commerce mailers to retail-ready packaging, we deliver solutions that drive sales.",
    specifications: [
      { label: "Box Types", value: "Tuck End, Sleeve, Magnetic" },
      { label: "Materials", value: "E-Flute, B-Flute, Rigid" },
      { label: "Printing", value: "Flexo / Offset / Digital" },
      { label: "Size Range", value: "Custom to specification" },
      { label: "Eco Options", value: "100% Recyclable Available" },
    ],
    finishOptions: ["Matte", "Gloss", "Aqueous Coating", "Soft-touch", "Window Patch"],
    paperOptions: ["White SBS", "Kraft", "Coated Duplex", "Corrugated"],
    minQuantity: 250,
    leadTime: "7-14 business days",
    priceRange: "Starting from ₹25/piece",
  },
  "7": {
    id: "7",
    title: "Corporate Folders",
    description: "Professional presentation folders with pockets and custom finishing options.",
    image: "https://images.unsplash.com/photo-1568205631071-2b29ab9c83cb?w=800&q=80",
    category: "Stationery",
    fullDescription: "Present your proposals and documents with confidence using our premium corporate folders. Custom designed to match your brand identity, our folders feature practical pockets, business card slots, and premium finishes that impress clients.",
    specifications: [
      { label: "Size", value: "A4, Letter, Legal" },
      { label: "Paper Stock", value: "300gsm - 400gsm" },
      { label: "Pockets", value: "1-2 Interior Pockets" },
      { label: "Card Slot", value: "Optional Business Card Holder" },
      { label: "Spine Width", value: "0mm - 10mm Options" },
    ],
    finishOptions: ["Gloss Lamination", "Matte Lamination", "Spot UV", "Foil Blocking"],
    paperOptions: ["Silk Art Board", "Uncoated", "Textured Stock"],
    minQuantity: 100,
    leadTime: "5-10 business days",
    priceRange: "Starting from ₹45/piece",
  },
  "8": {
    id: "8",
    title: "Brochures & Catalogs",
    description: "High-impact brochures and catalogs that showcase your products beautifully.",
    image: "https://images.unsplash.com/photo-1572883454114-1cf0031ede2a?w=800&q=80",
    category: "Commercial",
    fullDescription: "Tell your brand story with beautifully printed brochures and catalogs. Whether you need a tri-fold leaflet or a comprehensive product catalog, our printing expertise ensures vibrant colors, sharp details, and professional presentation.",
    specifications: [
      { label: "Fold Types", value: "Bi-fold, Tri-fold, Gate, Z-fold" },
      { label: "Catalog Pages", value: "8 - 100+ pages" },
      { label: "Print Quality", value: "175 LPI Offset" },
      { label: "Bleed", value: "3mm Standard" },
      { label: "Binding", value: "Saddle Stitch, Perfect Bound" },
    ],
    finishOptions: ["Gloss", "Silk", "Matte", "Soft-touch"],
    paperOptions: ["130gsm Gloss Art", "150gsm Silk", "170gsm Matte"],
    minQuantity: 500,
    leadTime: "5-7 business days",
    priceRange: "Starting from ₹8/piece",
  },
  "9": {
    id: "9",
    title: "Posters & Banners",
    description: "Large format printing for posters, banners, and exhibition displays.",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80",
    category: "Commercial",
    fullDescription: "Make a big impact with our large format printing services. From vibrant posters to durable outdoor banners, we produce eye-catching displays that demand attention. Perfect for events, retail, exhibitions, and outdoor advertising.",
    specifications: [
      { label: "Max Width", value: "Up to 5 meters" },
      { label: "Resolution", value: "720-1440 DPI" },
      { label: "Poster Sizes", value: "A3, A2, A1, A0, Custom" },
      { label: "Banner Materials", value: "Vinyl, Mesh, Fabric" },
      { label: "Durability", value: "Indoor/Outdoor Options" },
    ],
    finishOptions: ["Grommets", "Pole Pockets", "Hem & Eyelets", "Retractable"],
    paperOptions: ["Photo Satin", "Canvas", "Backlit Film", "Self-adhesive Vinyl"],
    minQuantity: 1,
    leadTime: "2-5 business days",
    priceRange: "Starting from ₹150/sq.ft",
  },
  "10": {
    id: "10",
    title: "Annual Reports",
    description: "Professional annual report printing with binding and finishing options.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
    category: "Commercial",
    fullDescription: "Present your company's achievements with professionally printed annual reports. We understand the importance of accuracy, quality, and timely delivery for these critical business documents. Our team ensures every report reflects your corporate excellence.",
    specifications: [
      { label: "Page Count", value: "20 - 200+ pages" },
      { label: "Size Options", value: "A4, US Letter, Custom" },
      { label: "Color Profile", value: "CMYK with Pantone Matching" },
      { label: "Proofing", value: "Digital + Hard Copy Proofs" },
      { label: "Archival", value: "Acid-free Options Available" },
    ],
    finishOptions: ["Matte Lamination", "Spot UV", "Embossing", "Foil Title"],
    paperOptions: ["120gsm Silk", "150gsm Matte Art", "Premium Uncoated"],
    bindingOptions: ["Perfect Bound", "Wire-O", "Case Bound", "Lay-flat"],
    minQuantity: 50,
    leadTime: "7-14 business days",
    priceRange: "Starting from ₹180/copy",
  },
  "11": {
    id: "11",
    title: "Gift Boxes",
    description: "Elegant gift packaging with custom inserts and premium finishing.",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80",
    category: "Packaging",
    fullDescription: "Create unforgettable gifting experiences with our bespoke gift boxes. Perfect for corporate gifts, product launches, and special occasions. Our expert craftsmen combine premium materials with exquisite finishing to deliver packaging that delights.",
    specifications: [
      { label: "Box Style", value: "Magnetic, Lift-off, Drawer" },
      { label: "Board Thickness", value: "2mm - 3mm Rigid Board" },
      { label: "Interior", value: "Velvet, Satin, EVA Foam" },
      { label: "Ribbon", value: "Satin, Grosgrain Options" },
      { label: "Custom Shapes", value: "Heart, Hexagon, Custom" },
    ],
    finishOptions: ["Soft-touch", "Metallic Foil", "Debossing", "Ribbon Closure"],
    paperOptions: ["Leatherette", "Specialty Texture", "Shimmer Paper"],
    minQuantity: 50,
    leadTime: "14-21 business days",
    priceRange: "Starting from ₹250/piece",
  },
  "12": {
    id: "12",
    title: "Event Invitations",
    description: "Custom event invitations for corporate and social occasions.",
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80",
    category: "Invitations",
    fullDescription: "Set the perfect tone for your event with our custom invitation designs. From corporate galas to birthday celebrations, we create invitations that excite and engage your guests. Our design team works with you to capture the essence of your event.",
    specifications: [
      { label: "Card Sizes", value: "4x6, 5x7, A5, Custom" },
      { label: "Paper Weight", value: "280gsm - 400gsm" },
      { label: "Envelope", value: "Matching Envelope Included" },
      { label: "Digital Version", value: "E-invite Option Available" },
      { label: "Design Service", value: "Custom Design Included" },
    ],
    finishOptions: ["Thermography", "Foil Accent", "Letterpress", "Die-cut"],
    paperOptions: ["Cotton", "Linen Texture", "Smooth Matte", "Pearl"],
    minQuantity: 25,
    leadTime: "7-14 business days",
    priceRange: "Starting from ₹75/piece",
  },
};

// All products array for related products
const allProductsArray = Object.values(productsData).map((p) => ({
  id: p.id,
  title: p.title,
  description: p.description,
  image: p.image,
  category: p.category,
}));

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedFinish, setSelectedFinish] = useState("");
  const [selectedPaper, setSelectedPaper] = useState("");
  const [selectedBinding, setSelectedBinding] = useState("");
  const [notes, setNotes] = useState("");
  const [dbProduct, setDbProduct] = useState<{ id: string } | null>(null);

  const product = id ? productsData[id] : null;
  
  // Fetch product from DB to get its UUID for options
  useEffect(() => {
    const fetchDbProduct = async () => {
      if (!product) return;
      
      const { data } = await supabase
        .from("products")
        .select("id")
        .eq("title", product.title)
        .maybeSingle();
      
      if (data) {
        setDbProduct(data);
      }
    };
    
    fetchDbProduct();
  }, [product?.title]);

  // Fetch custom options from database
  const { options: dbOptions, settings: dbSettings, loading: optionsLoading } = useProductOptions(dbProduct?.id);

  // Use DB options if available, otherwise fall back to hardcoded options
  const finishOptions = dbOptions.finishOptions.length > 0 ? dbOptions.finishOptions : product?.finishOptions || [];
  const paperOptions = dbOptions.paperOptions.length > 0 ? dbOptions.paperOptions : product?.paperOptions || [];
  const bindingOptions = dbOptions.bindingOptions.length > 0 ? dbOptions.bindingOptions : product?.bindingOptions || [];

  // Use DB settings if available, otherwise fall back to hardcoded values
  const minQuantity = dbSettings.minQuantity > 1 ? dbSettings.minQuantity : product?.minQuantity || 1;
  const leadTime = dbSettings.leadTime || product?.leadTime || "";
  const priceRange = dbSettings.priceRange || product?.priceRange || "";

  // Set initial quantity to min quantity
  useEffect(() => {
    setQuantity(minQuantity);
  }, [minQuantity]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="font-display text-3xl text-foreground mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist.</p>
          <Link to="/products">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleQuantityChange = (delta: number) => {
    const newQty = Math.max(minQuantity, quantity + delta);
    setQuantity(newQty);
  };

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productTitle: product.title,
      productImage: product.image,
      category: product.category,
      quantity,
      finishOption: selectedFinish,
      paperOption: selectedPaper,
      bindingOption: selectedBinding,
      specialRequirements: notes,
    });
    toast({
      title: "Added to Quote Cart!",
      description: `${product.title} has been added to your quote request.`,
    });
  };

  const handleAddToCartAndCheckout = () => {
    handleAddToCart();
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="pt-28 pb-4 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm font-body"
          >
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/products" className="text-muted-foreground hover:text-primary transition-colors">
              Products
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{product.title}</span>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative rounded-3xl overflow-hidden bg-secondary aspect-[4/3] shadow-premium">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 px-4 py-2 bg-primary text-primary-foreground rounded-full">
                  <span className="text-sm font-display font-semibold">{product.category}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
              >
                {[
                  { icon: Package, label: "Premium Quality" },
                  { icon: Truck, label: "Pan-India Delivery" },
                  { icon: Shield, label: "Secure Packaging" },
                  { icon: Clock, label: product.leadTime },
                ].map((badge, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-2 p-4 bg-card rounded-xl border border-border text-center"
                  >
                    <badge.icon className="w-6 h-6 text-primary" />
                    <span className="text-xs font-body text-muted-foreground">{badge.label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <span className="text-sm font-elegant tracking-widest uppercase text-accent">
                  {product.category}
                </span>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
                  {product.title}
                </h1>
                <p className="font-body text-lg text-muted-foreground leading-relaxed">
                  {product.fullDescription}
                </p>
              </div>

              {/* Price & Lead Time */}
              <div className="flex flex-wrap items-center gap-6 p-6 bg-secondary/50 rounded-2xl">
                <div>
                  <p className="text-sm text-muted-foreground font-body">Starting Price</p>
                  <p className="font-display text-2xl font-bold text-primary">{priceRange || product.priceRange}</p>
                </div>
                <div className="w-px h-12 bg-border hidden md:block" />
                <div>
                  <p className="text-sm text-muted-foreground font-body">Lead Time</p>
                  <p className="font-display text-xl font-semibold text-foreground">{leadTime || product.leadTime}</p>
                </div>
                <div className="w-px h-12 bg-border hidden md:block" />
                <div>
                  <p className="text-sm text-muted-foreground font-body">Min. Order</p>
                  <p className="font-display text-xl font-semibold text-foreground">{minQuantity} units</p>
                </div>
              </div>

              {/* Specifications */}
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-4">Specifications</h3>
                <div className="grid gap-3">
                  {product.specifications.map((spec, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-card rounded-lg border border-border"
                    >
                      <span className="font-body text-muted-foreground">{spec.label}</span>
                      <span className="font-body font-medium text-foreground">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Order Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 p-8 bg-card rounded-3xl border border-border shadow-lg"
          >
            <h2 className="font-display text-3xl font-bold text-foreground mb-8 text-center">
              Request a Quote
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Options */}
              <div className="space-y-6">
                <h3 className="font-display text-xl font-semibold text-foreground">Customize Your Order</h3>
                
                {/* Quantity */}
                <div className="space-y-2">
                  <Label className="font-body">Quantity (Min: {minQuantity})</Label>
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(-10)}
                      disabled={quantity <= minQuantity}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(minQuantity, parseInt(e.target.value) || minQuantity))}
                      className="w-24 text-center font-display text-lg"
                      min={minQuantity}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(10)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Finish */}
                {finishOptions.length > 0 && (
                  <div className="space-y-2">
                    <Label className="font-body">Finish Options</Label>
                    <Select value={selectedFinish} onValueChange={setSelectedFinish}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select finish" />
                      </SelectTrigger>
                      <SelectContent>
                        {finishOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Paper */}
                {paperOptions.length > 0 && (
                  <div className="space-y-2">
                    <Label className="font-body">Paper Stock</Label>
                    <Select value={selectedPaper} onValueChange={setSelectedPaper}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select paper" />
                      </SelectTrigger>
                      <SelectContent>
                        {paperOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Binding (if available) */}
                {bindingOptions.length > 0 && (
                  <div className="space-y-2">
                    <Label className="font-body">Binding Style</Label>
                    <Select value={selectedBinding} onValueChange={setSelectedBinding}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select binding" />
                      </SelectTrigger>
                      <SelectContent>
                        {bindingOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Right Column - Contact & Notes */}
              <div className="space-y-6">
                <h3 className="font-display text-xl font-semibold text-foreground">Project Details</h3>

                <div className="space-y-2">
                  <Label className="font-body">Special Requirements</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe any specific requirements, custom sizes, or special finishing you need..."
                    className="min-h-[120px]"
                  />
                </div>

                {/* Features List */}
                <div className="p-4 bg-secondary/50 rounded-xl">
                  <p className="font-display font-semibold text-foreground mb-3">What's Included:</p>
                  <ul className="space-y-2">
                    {[
                      "Free design consultation",
                      "Digital proof approval",
                      "Quality inspection",
                      "Secure packaging",
                      "Tracking & delivery updates",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm font-body text-muted-foreground">
                        <Check className="w-4 h-4 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <Button
                    type="button"
                    size="lg"
                    className="w-full font-elegant tracking-wide"
                    onClick={handleAddToCartAndCheckout}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Request Quote Now
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full font-elegant tracking-wide"
                    onClick={handleAddToCart}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Cart & Continue Shopping
                  </Button>
                </div>

                <p className="text-xs text-center text-muted-foreground font-body">
                  We'll respond within 24 hours with a detailed quote
                </p>
              </div>
            </div>
          </motion.div>

          {/* Back Button */}
          <div className="mt-12 text-center">
            <Link to="/products">
              <Button variant="outline" className="font-elegant">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <RelatedProducts
        currentProductId={product.id}
        category={product.category}
        allProducts={allProductsArray}
      />

      <Footer />
    </div>
  );
}
