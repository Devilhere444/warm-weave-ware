import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit2, MoreVertical, Plus, Trash2, Star, Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Product {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  category: string | null;
  price: number | null;
  is_featured: boolean | null;
  created_at: string;
  updated_at: string;
}

const CATEGORIES = [
  { value: "Books", label: "Books" },
  { value: "Packaging", label: "Packaging" },
  { value: "Stationery", label: "Stationery" },
  { value: "Invitations", label: "Invitations" },
  { value: "Commercial", label: "Commercial" },
  { value: "Labels", label: "Labels & Stickers" },
];

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    category: "",
    price: "",
    is_featured: false,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast.error("Error fetching products: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (!formData.title.trim()) {
        toast.error("Product title is required");
        setSaving(false);
        return;
      }

      const productData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        image_url: formData.image_url.trim() || null,
        category: formData.category || null,
        price: formData.price ? parseFloat(formData.price) : null,
        is_featured: formData.is_featured,
      };

      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);

        if (error) throw error;
        toast.success("Product updated successfully");
      } else {
        const { error } = await supabase.from("products").insert([productData]);

        if (error) throw error;
        toast.success("Product added successfully");
      }

      setDialogOpen(false);
      resetForm();
      fetchProducts();
    } catch (error: any) {
      toast.error("Error saving product: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setImagePreview(null);
    setFormData({
      title: "",
      description: "",
      image_url: "",
      category: "",
      price: "",
      is_featured: false,
    });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setImagePreview(product.image_url);
    setFormData({
      title: product.title,
      description: product.description || "",
      image_url: product.image_url || "",
      category: product.category || "",
      price: product.price?.toString() || "",
      is_featured: product.is_featured || false,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error: any) {
      toast.error("Error deleting product: " + error.message);
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ is_featured: !product.is_featured })
        .eq("id", product.id);

      if (error) throw error;
      toast.success(
        product.is_featured
          ? "Product removed from featured"
          : "Product marked as featured"
      );
      fetchProducts();
    } catch (error: any) {
      toast.error("Error updating product: " + error.message);
    }
  };

  const openNewProductDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleImageUrlChange = (url: string) => {
    setFormData({ ...formData, image_url: url });
    setImagePreview(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-muted-foreground font-body">
            Manage your product catalog ({products.length} products)
          </p>
        </div>
        <Button onClick={openNewProductDialog} className="gap-2 font-elegant">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {/* Product Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            {/* Image Preview */}
            <div className="space-y-3">
              <Label className="text-sm font-elegant text-foreground">
                Product Image
              </Label>
              <div className="flex gap-4">
                <div className="w-32 h-32 bg-muted rounded-xl border-2 border-dashed border-border flex items-center justify-center overflow-hidden flex-shrink-0">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => setImagePreview(null)}
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <Input
                    value={formData.image_url}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="font-body"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter an image URL. The image will be displayed as a preview.
                  </p>
                  {imagePreview && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFormData({ ...formData, image_url: "" });
                        setImagePreview(null);
                      }}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Remove Image
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label className="text-sm font-elegant text-foreground">
                Product Title <span className="text-destructive">*</span>
              </Label>
              <Input
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter product title"
                className="font-body"
              />
            </div>

            {/* Category & Price Row */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-elegant text-foreground">
                  Category
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="font-body">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-elegant text-foreground">
                  Price (₹)
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  className="font-body"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-sm font-elegant text-foreground">
                Description
              </Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter a detailed product description..."
                rows={4}
                className="font-body resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {formData.description.length}/500 characters
              </p>
            </div>

            {/* Featured Toggle */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
              <div className="space-y-0.5">
                <Label className="text-sm font-elegant text-foreground">
                  Featured Product
                </Label>
                <p className="text-xs text-muted-foreground">
                  Featured products appear on the homepage
                </p>
              </div>
              <Switch
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="flex-1 font-elegant"
                disabled={saving}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 font-elegant"
                disabled={saving}
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  <>{editingProduct ? "Update" : "Add"} Product</>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Products Grid */}
      {products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-card p-12 rounded-xl border border-border text-center"
        >
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
            No products yet
          </h3>
          <p className="text-muted-foreground font-body mb-4">
            Add your first product to get started.
          </p>
          <Button onClick={openNewProductDialog} className="font-elegant">
            Add Product
          </Button>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="bg-card rounded-xl border border-border overflow-hidden group hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-[4/3] bg-muted">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-muted-foreground/50" />
                  </div>
                )}
                
                {/* Featured Badge */}
                {product.is_featured && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 bg-primary text-primary-foreground px-2 py-1 rounded-lg text-xs font-elegant">
                    <Star className="w-3 h-3 fill-current" />
                    Featured
                  </div>
                )}

                {/* Actions Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="absolute top-3 right-3 w-8 h-8 bg-card/90 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card">
                      <MoreVertical className="w-4 h-4 text-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(product)}>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleToggleFeatured(product)}>
                      <Star className="w-4 h-4 mr-2" />
                      {product.is_featured ? "Remove from Featured" : "Mark as Featured"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(product.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    {product.category && (
                      <span className="text-xs font-elegant tracking-widest uppercase text-primary">
                        {product.category}
                      </span>
                    )}
                    <h3 className="font-display font-semibold text-foreground mt-1 truncate">
                      {product.title}
                    </h3>
                  </div>
                </div>
                
                {product.description && (
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                    {product.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  {product.price ? (
                    <span className="text-primary font-display font-bold">
                      ₹{product.price.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-sm font-body">
                      Price on request
                    </span>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(product)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
