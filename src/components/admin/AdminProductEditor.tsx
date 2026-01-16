import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Save, Loader2, X, Plus, Trash2, Upload, Image, GripVertical,
  Package, FileText, DollarSign, Clock, Hash, Star, Palette, BookOpen, List
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Product {
  id: string;
  title: string;
  description: string | null;
  full_description: string | null;
  image_url: string | null;
  category: string | null;
  price: number | null;
  is_featured: boolean | null;
  min_quantity: number | null;
  max_quantity: number | null;
  lead_time: string | null;
  price_range: string | null;
}

interface Specification {
  id: string;
  spec_label: string;
  spec_value: string;
  display_order: number;
  isNew?: boolean;
}

interface ProductOption {
  id: string;
  option_type: string;
  option_value: string;
  display_order: number;
  isNew?: boolean;
}

const CATEGORIES = ["Books", "Packaging", "Stationery", "Invitations", "Commercial", "Labels"];

interface AdminProductEditorProps {
  productId: string | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function AdminProductEditor({ productId, onClose, onSaved }: AdminProductEditorProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [product, setProduct] = useState<Partial<Product>>({
    title: "",
    description: "",
    full_description: "",
    image_url: "",
    category: "",
    price: null,
    is_featured: false,
    min_quantity: 1,
    max_quantity: null,
    lead_time: "",
    price_range: "",
  });

  const [specifications, setSpecifications] = useState<Specification[]>([]);
  const [options, setOptions] = useState<ProductOption[]>([]);
  const [newSpec, setNewSpec] = useState({ label: "", value: "" });
  const [newOption, setNewOption] = useState({ type: "finish", value: "" });

  useEffect(() => {
    if (productId) {
      fetchProduct();
    } else {
      setLoading(false);
    }
  }, [productId]);

  const fetchProduct = async () => {
    if (!productId) return;

    try {
      const [productRes, specsRes, optionsRes] = await Promise.all([
        supabase.from("products").select("*").eq("id", productId).single(),
        supabase.from("product_specifications").select("*").eq("product_id", productId).order("display_order"),
        supabase.from("product_options").select("*").eq("product_id", productId).order("display_order"),
      ]);

      if (productRes.error) throw productRes.error;
      setProduct(productRes.data);

      if (specsRes.data) {
        setSpecifications(specsRes.data);
      }

      if (optionsRes.data) {
        setOptions(optionsRes.data);
      }
    } catch (error: any) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!product.title?.trim()) {
      toast.error("Product title is required");
      return;
    }

    setSaving(true);
    try {
      let savedProductId = productId;

      // Save product
      if (productId) {
        const { error } = await supabase
          .from("products")
          .update({
            title: product.title,
            description: product.description,
            full_description: product.full_description,
            image_url: product.image_url,
            category: product.category,
            price: product.price,
            is_featured: product.is_featured,
            min_quantity: product.min_quantity,
            max_quantity: product.max_quantity,
            lead_time: product.lead_time,
            price_range: product.price_range,
          })
          .eq("id", productId);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("products")
          .insert({
            title: product.title,
            description: product.description,
            full_description: product.full_description,
            image_url: product.image_url,
            category: product.category,
            price: product.price,
            is_featured: product.is_featured,
            min_quantity: product.min_quantity,
            max_quantity: product.max_quantity,
            lead_time: product.lead_time,
            price_range: product.price_range,
          })
          .select()
          .single();

        if (error) throw error;
        savedProductId = data.id;
      }

      // Save specifications
      if (savedProductId) {
        // Delete removed specs
        const existingSpecIds = specifications.filter(s => !s.isNew).map(s => s.id);
        if (productId) {
          await supabase
            .from("product_specifications")
            .delete()
            .eq("product_id", productId)
            .not("id", "in", `(${existingSpecIds.join(",")})`);
        }

        // Upsert specs
        for (const spec of specifications) {
          if (spec.isNew) {
            await supabase.from("product_specifications").insert({
              product_id: savedProductId,
              spec_label: spec.spec_label,
              spec_value: spec.spec_value,
              display_order: spec.display_order,
            });
          } else {
            await supabase
              .from("product_specifications")
              .update({
                spec_label: spec.spec_label,
                spec_value: spec.spec_value,
                display_order: spec.display_order,
              })
              .eq("id", spec.id);
          }
        }

        // Save options
        const existingOptionIds = options.filter(o => !o.isNew).map(o => o.id);
        if (productId) {
          await supabase
            .from("product_options")
            .delete()
            .eq("product_id", productId)
            .not("id", "in", `(${existingOptionIds.join(",")})`);
        }

        for (const opt of options) {
          if (opt.isNew) {
            await supabase.from("product_options").insert({
              product_id: savedProductId,
              option_type: opt.option_type,
              option_value: opt.option_value,
              display_order: opt.display_order,
            });
          } else {
            await supabase
              .from("product_options")
              .update({
                option_type: opt.option_type,
                option_value: opt.option_value,
                display_order: opt.display_order,
              })
              .eq("id", opt.id);
          }
        }
      }

      toast.success(productId ? "Product updated!" : "Product created!");
      onSaved();
      onClose();
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `product-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      setProduct(prev => ({ ...prev, image_url: publicUrl }));
      toast.success("Image uploaded!");
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const addSpecification = () => {
    if (!newSpec.label.trim() || !newSpec.value.trim()) {
      toast.error("Both label and value are required");
      return;
    }

    setSpecifications(prev => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        spec_label: newSpec.label,
        spec_value: newSpec.value,
        display_order: prev.length,
        isNew: true,
      },
    ]);
    setNewSpec({ label: "", value: "" });
  };

  const removeSpecification = (id: string) => {
    setSpecifications(prev => prev.filter(s => s.id !== id));
  };

  const updateSpecification = (id: string, field: "spec_label" | "spec_value", value: string) => {
    setSpecifications(prev =>
      prev.map(s => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const addOption = () => {
    if (!newOption.value.trim()) {
      toast.error("Option value is required");
      return;
    }

    setOptions(prev => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        option_type: newOption.type,
        option_value: newOption.value,
        display_order: prev.filter(o => o.option_type === newOption.type).length,
        isNew: true,
      },
    ]);
    setNewOption(prev => ({ ...prev, value: "" }));
  };

  const removeOption = (id: string) => {
    setOptions(prev => prev.filter(o => o.id !== id));
  };

  const getOptionsByType = (type: string) => options.filter(o => o.option_type === type);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 overflow-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto py-8 px-4 max-w-5xl"
      >
        <div className="bg-card rounded-2xl border border-border shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="font-display text-2xl font-bold">
                {productId ? "Edit Product" : "Add New Product"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Configure all product details, specifications, and quote options
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} disabled={saving}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Product
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="basic" className="font-elegant">Basic Info</TabsTrigger>
                <TabsTrigger value="pricing" className="font-elegant">Pricing & Quantity</TabsTrigger>
                <TabsTrigger value="specs" className="font-elegant">Specifications</TabsTrigger>
                <TabsTrigger value="options" className="font-elegant">Quote Options</TabsTrigger>
              </TabsList>

              {/* Basic Info Tab */}
              <TabsContent value="basic" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-primary" />
                        Product Title *
                      </Label>
                      <Input
                        value={product.title || ""}
                        onChange={(e) => setProduct(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Premium Book Printing"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select
                        value={product.category || ""}
                        onValueChange={(val) => setProduct(prev => ({ ...prev, category: val }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Short Description</Label>
                      <Textarea
                        value={product.description || ""}
                        onChange={(e) => setProduct(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief description for product cards..."
                        rows={3}
                      />
                      <p className="text-xs text-muted-foreground">
                        {(product.description?.length || 0)}/200 characters
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Full Description</Label>
                      <Textarea
                        value={product.full_description || ""}
                        onChange={(e) => setProduct(prev => ({ ...prev, full_description: e.target.value }))}
                        placeholder="Detailed product description for the product page..."
                        rows={5}
                      />
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
                      <Switch
                        checked={product.is_featured || false}
                        onCheckedChange={(checked) => setProduct(prev => ({ ...prev, is_featured: checked }))}
                      />
                      <div>
                        <Label className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          Featured Product
                        </Label>
                        <p className="text-xs text-muted-foreground">Show on homepage</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Image */}
                  <div className="space-y-4">
                    <Label className="flex items-center gap-2">
                      <Image className="w-4 h-4 text-primary" />
                      Product Image
                    </Label>

                    <div className="border-2 border-dashed border-border rounded-xl p-4 text-center">
                      {product.image_url ? (
                        <div className="relative">
                          <img
                            src={product.image_url}
                            alt="Product"
                            className="w-full h-64 object-cover rounded-lg"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => setProduct(prev => ({ ...prev, image_url: "" }))}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="py-12">
                          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-sm text-muted-foreground mb-4">
                            Upload an image or enter URL
                          </p>
                          <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                          >
                            {uploading ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Upload className="w-4 h-4 mr-2" />
                            )}
                            Upload Image
                          </Button>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Or enter image URL</Label>
                      <Input
                        value={product.image_url || ""}
                        onChange={(e) => setProduct(prev => ({ ...prev, image_url: e.target.value }))}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Pricing & Quantity Tab */}
              <TabsContent value="pricing" className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-primary" />
                      Price Range Display
                    </Label>
                    <Input
                      value={product.price_range || ""}
                      onChange={(e) => setProduct(prev => ({ ...prev, price_range: e.target.value }))}
                      placeholder="e.g., Starting from ₹150/copy"
                    />
                    <p className="text-xs text-muted-foreground">Text shown to customers</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-primary" />
                      Base Price (₹)
                    </Label>
                    <Input
                      type="number"
                      value={product.price || ""}
                      onChange={(e) => setProduct(prev => ({ ...prev, price: parseFloat(e.target.value) || null }))}
                      placeholder="e.g., 150"
                    />
                    <p className="text-xs text-muted-foreground">Internal reference price</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      Lead Time
                    </Label>
                    <Input
                      value={product.lead_time || ""}
                      onChange={(e) => setProduct(prev => ({ ...prev, lead_time: e.target.value }))}
                      placeholder="e.g., 7-14 business days"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-primary" />
                      Minimum Quantity
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      value={product.min_quantity || 1}
                      onChange={(e) => setProduct(prev => ({ ...prev, min_quantity: parseInt(e.target.value) || 1 }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-primary" />
                      Maximum Quantity
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      value={product.max_quantity || ""}
                      onChange={(e) => setProduct(prev => ({ ...prev, max_quantity: parseInt(e.target.value) || null }))}
                      placeholder="No limit"
                    />
                    <p className="text-xs text-muted-foreground">Leave empty for no limit</p>
                  </div>
                </div>
              </TabsContent>

              {/* Specifications Tab */}
              <TabsContent value="specs" className="space-y-6">
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
                    <List className="w-4 h-4 text-primary" />
                    Product Specifications
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add specifications like "Material Options", "Print Quality", "Page Count", etc.
                  </p>

                  {/* Existing Specifications */}
                  <div className="space-y-2 mb-4">
                    {specifications.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic py-4 text-center">
                        No specifications added yet
                      </p>
                    ) : (
                      specifications.map((spec) => (
                        <div
                          key={spec.id}
                          className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border group"
                        >
                          <GripVertical className="w-4 h-4 text-muted-foreground" />
                          <Input
                            value={spec.spec_label}
                            onChange={(e) => updateSpecification(spec.id, "spec_label", e.target.value)}
                            placeholder="Label"
                            className="flex-1"
                          />
                          <Input
                            value={spec.spec_value}
                            onChange={(e) => updateSpecification(spec.id, "spec_value", e.target.value)}
                            placeholder="Value"
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 text-destructive"
                            onClick={() => removeSpecification(spec.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add New Specification */}
                  <div className="flex gap-2">
                    <Input
                      value={newSpec.label}
                      onChange={(e) => setNewSpec(prev => ({ ...prev, label: e.target.value }))}
                      placeholder="Label (e.g., Print Quality)"
                      className="flex-1"
                    />
                    <Input
                      value={newSpec.value}
                      onChange={(e) => setNewSpec(prev => ({ ...prev, value: e.target.value }))}
                      placeholder="Value (e.g., 300 DPI)"
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSpecification();
                        }
                      }}
                    />
                    <Button onClick={addSpecification}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Quote Options Tab */}
              <TabsContent value="options" className="space-y-6">
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-primary" />
                    Quote Customization Options
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add options that customers can select when requesting a quote.
                  </p>

                  <Accordion type="multiple" defaultValue={["finish", "paper", "binding"]} className="space-y-4">
                    {[
                      { type: "finish", label: "Finish Options", icon: Palette },
                      { type: "paper", label: "Paper Stock", icon: FileText },
                      { type: "binding", label: "Binding Options", icon: BookOpen },
                    ].map(({ type, label, icon: Icon }) => (
                      <AccordionItem key={type} value={type} className="border rounded-lg px-4 bg-card">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3">
                            <Icon className="w-4 h-4 text-primary" />
                            <span className="font-display font-semibold">{label}</span>
                            <span className="text-sm text-muted-foreground">
                              ({getOptionsByType(type).length})
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 pb-2">
                          <div className="space-y-2 mb-4">
                            {getOptionsByType(type).length === 0 ? (
                              <p className="text-sm text-muted-foreground italic py-2">
                                No options added
                              </p>
                            ) : (
                              getOptionsByType(type).map((opt) => (
                                <div
                                  key={opt.id}
                                  className="flex items-center gap-3 p-2 bg-secondary/50 rounded group"
                                >
                                  <span className="flex-1">{opt.option_value}</span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100 h-8 w-8 text-destructive"
                                    onClick={() => removeOption(opt.id)}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              ))
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Input
                              value={newOption.type === type ? newOption.value : ""}
                              onChange={(e) => setNewOption({ type, value: e.target.value })}
                              placeholder={`Add ${label.toLowerCase().replace(" options", "").replace(" stock", "")}...`}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && newOption.type === type) {
                                  e.preventDefault();
                                  addOption();
                                }
                              }}
                            />
                            <Button
                              onClick={() => {
                                setNewOption(prev => ({ ...prev, type }));
                                if (newOption.type === type && newOption.value) {
                                  addOption();
                                }
                              }}
                              disabled={newOption.type !== type || !newOption.value}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
