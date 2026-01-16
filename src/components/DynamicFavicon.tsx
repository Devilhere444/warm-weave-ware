import { useEffect } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export function DynamicFavicon() {
  const { settings } = useSiteSettings();

  useEffect(() => {
    if (settings.favicon_url) {
      // Find existing favicon link or create one
      let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      
      link.href = settings.favicon_url;
      link.type = settings.favicon_url.endsWith('.svg') ? 'image/svg+xml' : 'image/png';
    }
  }, [settings.favicon_url]);

  return null;
}
