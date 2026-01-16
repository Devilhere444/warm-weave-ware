import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Save, Loader2, Palette, FileText, BookOpen, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Product {
  id: string;
  title: string;
  category: string | null;
}

interface ProductOption {
  id: string;
  product_id: string;
  option_type: string;
  option_value: string;
  display_order: number;
}

const OPTION_TYPES = [
  { value: "finish", label: "Finish Options", icon: Palette },
  { value: "paper", label: "Paper Stock", icon: FileText },
  { value: "binding", label: "Binding Options", icon: BookOpen },
];

export default function AdminProductOptions() {
  const [products, setProducts] = useState<Product[]>([]);
  const [options, setOptions] = useState<ProductOption[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newOptions, setNewOptions] = useState<{ [key: string]: string }>({
    finish: "",
    paper: "",
    binding: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      fetchProductOptions(selectedProduct);
    }
  }, [selectedProduct]);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("id, title, category")
        .order("title");

      if (error) throw error;
      setProducts(data || []);
      
      if (data && data.length > 0) {
        setSelectedProduct(data[0].id);
      }
    } catch (error: any) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchProductOptions = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from("product_options")
        .select("*")
        .eq("product_id", productId)
        .order("option_type")
        .order("display_order");

      if (error) throw error;
      setOptions(data || []);
    } catch (error: any) {
      console.error("Error fetching options:", error);
      toast.error("Failed to load product options");
    }
  };

  const handleAddOption = async (optionType: string) => {
    const value = newOptions[optionType]?.trim();
    if (!value) {
      toast.error("Please enter an option value");
      return;
    }

    if (!selectedProduct) {
      toast.error("Please select a product first");
      return;
    }

    setSaving(true);
    try {
      const maxOrder = options
        .filter((o) => o.option_type === optionType)
        .reduce((max, o) => Math.max(max, o.display_order), -1);

      const { data, error } = await supabase
        .from("product_options")
        .insert({
          product_id: selectedProduct,
          option_type: optionType,
          option_value: value,
          display_order: maxOrder + 1,
        })
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          toast.error("This option already exists for this product");
        } else {
          throw error;
        }
        return;
      }

      setOptions((prev) => [...prev, data]);
      setNewOptions((prev) => ({ ...prev, [optionType]: "" }));
      toast.success("Option added successfully");
    } catch (error: any) {
      console.error("Error adding option:", error);
      toast.error("Failed to add option: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteOption = async (optionId: string) => {
    try {
      const { error } = await supabase
        .from("product_options")
        .delete()
        .eq("id", optionId);

      if (error) throw error;

      setOptions((prev) => prev.filter((o) => o.id !== optionId));
      toast.success("Option deleted");
    } catch (error: any) {
      console.error("Error deleting option:", error);
      toast.error("Failed to delete option");
    }
  };

  const handleCopyOptions = async (fromProductId: string) => {
    if (!selectedProduct || selectedProduct === fromProductId) return;

    setSaving(true);
    try {
      // Fetch options from source product
      const { data: sourceOptions, error: fetchError } = await supabase
        .from("product_options")
        .select("option_type, option_value, display_order")
        .eq("product_id", fromProductId);

      if (fetchError) throw fetchError;
      if (!sourceOptions || sourceOptions.length === 0) {
        toast.error("Source product has no options to copy");
        return;
      }

      // Insert options for target product
      const newOptionsData = sourceOptions.map((opt) => ({
        product_id: selectedProduct,
        option_type: opt.option_type,
        option_value: opt.option_value,
        display_order: opt.display_order,
      }));

      const { error: insertError } = await supabase
        .from("product_options")
        .upsert(newOptionsData, { 
          onConflict: "product_id,option_type,option_value",
          ignoreDuplicates: true 
        });

      if (insertError) throw insertError;

      await fetchProductOptions(selectedProduct);
      toast.success("Options copied successfully");
    } catch (error: any) {
      console.error("Error copying options:", error);
      toast.error("Failed to copy options: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const getOptionsForType = (type: string) => {
    return options.filter((o) => o.option_type === type);
  };

  const selectedProductData = products.find((p) => p.id === selectedProduct);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Product Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card p-6 rounded-xl border border-border"
      >
        <h2 className="font-display text-lg font-semibold mb-4">Select Product</h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Product</Label>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger>
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.title} {product.category && `(${product.category})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Copy Options From</Label>
            <Select onValueChange={handleCopyOptions}>
              <SelectTrigger>
                <SelectValue placeholder="Copy from another product..." />
              </SelectTrigger>
              <SelectContent>
                {products
                  .filter((p) => p.id !== selectedProduct)
                  .map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.title}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedProductData && (
          <p className="mt-4 text-sm text-muted-foreground">
            Managing quote options for: <strong>{selectedProductData.title}</strong>
          </p>
        )}
      </motion.div>

      {/* Options Management */}
      {selectedProduct && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card p-6 rounded-xl border border-border"
        >
          <h2 className="font-display text-lg font-semibold mb-4">Quote Customization Options</h2>

          <Accordion type="multiple" defaultValue={["finish", "paper", "binding"]} className="space-y-4">
            {OPTION_TYPES.map(({ value: optionType, label, icon: Icon }) => (
              <AccordionItem key={optionType} value={optionType} className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-left">
                      <span className="font-display font-semibold">{label}</span>
                      <span className="ml-2 text-sm text-muted-foreground">
                        ({getOptionsForType(optionType).length} options)
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-2">
                  {/* Existing Options */}
                  <div className="space-y-2 mb-4">
                    {getOptionsForType(optionType).length === 0 ? (
                      <p className="text-sm text-muted-foreground italic py-2">
                        No {label.toLowerCase()} added yet
                      </p>
                    ) : (
                      getOptionsForType(optionType).map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg group"
                        >
                          <GripVertical className="w-4 h-4 text-muted-foreground" />
                          <span className="flex-1 font-body">{option.option_value}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                            onClick={() => handleDeleteOption(option.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add New Option */}
                  <div className="flex gap-2">
                    <Input
                      placeholder={`Add new ${label.toLowerCase().replace(" options", "").replace(" stock", "")} option...`}
                      value={newOptions[optionType]}
                      onChange={(e) =>
                        setNewOptions((prev) => ({ ...prev, [optionType]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddOption(optionType);
                        }
                      }}
                    />
                    <Button
                      onClick={() => handleAddOption(optionType)}
                      disabled={saving || !newOptions[optionType]?.trim()}
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      )}

      {/* Quick Add Templates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card p-6 rounded-xl border border-border"
      >
        <h2 className="font-display text-lg font-semibold mb-4">Quick Templates</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Add common options quickly. These will be added to the currently selected product.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="h-auto py-4 flex-col gap-2"
            disabled={!selectedProduct || saving}
            onClick={async () => {
              if (!selectedProduct) return;
              setSaving(true);
              try {
                const finishOptions = [
                  "Matte Lamination",
                  "Gloss Lamination",
                  "Soft-touch",
                  "Spot UV",
                  "Foil Stamping",
                ];
                await supabase.from("product_options").upsert(
                  finishOptions.map((opt, i) => ({
                    product_id: selectedProduct,
                    option_type: "finish",
                    option_value: opt,
                    display_order: i,
                  })),
                  { onConflict: "product_id,option_type,option_value", ignoreDuplicates: true }
                );
                await fetchProductOptions(selectedProduct);
                toast.success("Finish options added");
              } catch (e: any) {
                toast.error("Failed to add options");
              } finally {
                setSaving(false);
              }
            }}
          >
            <Palette className="w-6 h-6 text-primary" />
            <span className="font-display">Standard Finishes</span>
            <span className="text-xs text-muted-foreground">5 common options</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4 flex-col gap-2"
            disabled={!selectedProduct || saving}
            onClick={async () => {
              if (!selectedProduct) return;
              setSaving(true);
              try {
                const paperOptions = [
                  "80gsm Uncoated",
                  "100gsm Silk",
                  "120gsm Gloss",
                  "150gsm Matte Art",
                  "170gsm Premium",
                ];
                await supabase.from("product_options").upsert(
                  paperOptions.map((opt, i) => ({
                    product_id: selectedProduct,
                    option_type: "paper",
                    option_value: opt,
                    display_order: i,
                  })),
                  { onConflict: "product_id,option_type,option_value", ignoreDuplicates: true }
                );
                await fetchProductOptions(selectedProduct);
                toast.success("Paper options added");
              } catch (e: any) {
                toast.error("Failed to add options");
              } finally {
                setSaving(false);
              }
            }}
          >
            <FileText className="w-6 h-6 text-primary" />
            <span className="font-display">Standard Papers</span>
            <span className="text-xs text-muted-foreground">5 common options</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4 flex-col gap-2"
            disabled={!selectedProduct || saving}
            onClick={async () => {
              if (!selectedProduct) return;
              setSaving(true);
              try {
                const bindingOptions = [
                  "Perfect Bound",
                  "Saddle Stitch",
                  "Spiral Bound",
                  "Case Bound",
                  "Wire-O",
                ];
                await supabase.from("product_options").upsert(
                  bindingOptions.map((opt, i) => ({
                    product_id: selectedProduct,
                    option_type: "binding",
                    option_value: opt,
                    display_order: i,
                  })),
                  { onConflict: "product_id,option_type,option_value", ignoreDuplicates: true }
                );
                await fetchProductOptions(selectedProduct);
                toast.success("Binding options added");
              } catch (e: any) {
                toast.error("Failed to add options");
              } finally {
                setSaving(false);
              }
            }}
          >
            <BookOpen className="w-6 h-6 text-primary" />
            <span className="font-display">Standard Bindings</span>
            <span className="text-xs text-muted-foreground">5 common options</span>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

