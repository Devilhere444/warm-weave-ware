import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit2, MoreVertical, Plus, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AdminProductEditor from "./AdminProductEditor";

interface Product {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  category: string | null;
  price: number | null;
  is_featured: boolean | null;
  created_at: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

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

  const handleEdit = (product: Product) => {
    setEditingProductId(product.id);
    setEditorOpen(true);
  };

  const handleAdd = () => {
    setEditingProductId(null);
    setEditorOpen(true);
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Delete "${product.title}"?`)) return;

    try {
      const { error } = await supabase.from("products").delete().eq("id", product.id);
      if (error) throw error;
      setProducts(prev => prev.filter(p => p.id !== product.id));
      toast.success("Product deleted");
    } catch (error: any) {
      toast.error("Error deleting product: " + error.message);
    }
  };

  const toggleFeatured = async (product: Product) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ is_featured: !product.is_featured })
        .eq("id", product.id);

      if (error) throw error;
      setProducts(prev =>
        prev.map(p => (p.id === product.id ? { ...p, is_featured: !p.is_featured } : p))
      );
      toast.success(product.is_featured ? "Removed from featured" : "Added to featured");
    } catch (error: any) {
      toast.error("Error updating product");
    }
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
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">All Products ({products.length})</h2>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No products yet. Add your first product!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card rounded-xl border border-border overflow-hidden group hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-[4/3] bg-secondary">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No image
                  </div>
                )}
                {product.is_featured && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-500 text-yellow-950 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Featured
                  </div>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(product)}>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Product
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleFeatured(product)}>
                      <Star className="w-4 h-4 mr-2" />
                      {product.is_featured ? "Remove Featured" : "Make Featured"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDelete(product)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="p-4">
                {product.category && (
                  <span className="text-xs font-elegant text-accent uppercase tracking-wide">
                    {product.category}
                  </span>
                )}
                <h3 className="font-display font-semibold text-foreground mt-1 line-clamp-1">
                  {product.title}
                </h3>
                {product.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {product.description}
                  </p>
                )}
                {product.price && (
                  <p className="text-sm font-semibold text-primary mt-2">
                    ₹{product.price.toLocaleString()}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {editorOpen && (
        <AdminProductEditor
          productId={editingProductId}
          onClose={() => setEditorOpen(false)}
          onSaved={fetchProducts}
        />
      )}
    </div>
  );
}
