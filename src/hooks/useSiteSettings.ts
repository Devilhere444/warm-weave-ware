import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SiteSettings {
  site_name: string;
  site_tagline: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  whatsapp_number: string;
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  business_hours: string;
  hero_title: string;
  hero_subtitle: string;
  about_text: string;
  footer_text: string;
  logo_url: string;
}

const defaultSettings: SiteSettings = {
  site_name: "Litho Art Press",
  site_tagline: "Premium Printing Solutions",
  contact_email: "",
  contact_phone: "",
  contact_address: "",
  whatsapp_number: "",
  facebook_url: "",
  instagram_url: "",
  twitter_url: "",
  business_hours: "Mon-Fri: 9AM-6PM",
  hero_title: "Where Art Meets Precision Printing",
  hero_subtitle: "Bihar's premier lithographic printing press, delivering unparalleled quality in book printing, packaging, and commercial print solutions.",
  about_text: "",
  footer_text: "Quality printing services for all your needs",
  logo_url: ""
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("key, value");

        if (error) {
          console.error("Error fetching site settings:", error);
          return;
        }

        if (data) {
          const fetchedSettings: Partial<SiteSettings> = {};
          data.forEach((item: { key: string; value: string | null }) => {
            if (item.key in defaultSettings) {
              (fetchedSettings as any)[item.key] = item.value || defaultSettings[item.key as keyof SiteSettings];
            }
          });
          setSettings({ ...defaultSettings, ...fetchedSettings });
        }
      } catch (error) {
        console.error("Error fetching site settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading };
}
