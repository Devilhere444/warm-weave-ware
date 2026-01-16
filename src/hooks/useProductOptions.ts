import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProductOption {
  id: string;
  option_type: string;
  option_value: string;
  display_order: number;
}

interface ProductOptions {
  finishOptions: string[];
  paperOptions: string[];
  bindingOptions: string[];
}

interface ProductSettings {
  minQuantity: number;
  maxQuantity: number | null;
  leadTime: string;
  priceRange: string;
}

export function useProductOptions(productId: string | undefined) {
  const [options, setOptions] = useState<ProductOptions>({
    finishOptions: [],
    paperOptions: [],
    bindingOptions: [],
  });
  const [settings, setSettings] = useState<ProductSettings>({
    minQuantity: 1,
    maxQuantity: null,
    leadTime: "",
    priceRange: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    const fetchOptions = async () => {
      try {
        // Fetch product settings
        const { data: productData } = await supabase
          .from("products")
          .select("min_quantity, max_quantity, lead_time, price_range")
          .eq("id", productId)
          .maybeSingle();

        if (productData) {
          setSettings({
            minQuantity: productData.min_quantity || 1,
            maxQuantity: productData.max_quantity || null,
            leadTime: productData.lead_time || "",
            priceRange: productData.price_range || "",
          });
        }

        // Fetch customization options
        const { data, error } = await supabase
          .from("product_options")
          .select("*")
          .eq("product_id", productId)
          .order("display_order");

        if (error) {
          console.error("Error fetching product options:", error);
          return;
        }

        const finishOptions: string[] = [];
        const paperOptions: string[] = [];
        const bindingOptions: string[] = [];

        (data || []).forEach((opt: ProductOption) => {
          switch (opt.option_type) {
            case "finish":
              finishOptions.push(opt.option_value);
              break;
            case "paper":
              paperOptions.push(opt.option_value);
              break;
            case "binding":
              bindingOptions.push(opt.option_value);
              break;
          }
        });

        setOptions({
          finishOptions,
          paperOptions,
          bindingOptions,
        });
      } catch (error) {
        console.error("Error fetching product options:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [productId]);

  return { options, settings, loading };
}
