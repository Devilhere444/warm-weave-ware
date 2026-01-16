import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Palette, Globe, Check, Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BrandingColors {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  textPrimary?: string;
  textSecondary?: string;
}

interface BrandingData {
  colorScheme?: string;
  logo?: string;
  colors?: BrandingColors;
  fonts?: { family: string }[];
  typography?: {
    fontFamilies?: { primary?: string; heading?: string; code?: string };
    fontSizes?: Record<string, string>;
    fontWeights?: Record<string, number>;
  };
}

interface ExtractedBrand {
  branding?: BrandingData;
  screenshot?: string;
  metadata?: {
    title?: string;
    description?: string;
    sourceURL?: string;
  };
}

interface BrandExtractorProps {
  onApplyColors?: (colors: BrandingColors) => void;
}

export function BrandExtractor({ onApplyColors }: BrandExtractorProps) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ExtractedBrand | null>(null);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('extract-brand', {
        body: { url: url.trim() },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.success) {
        setResult(data);
        toast.success("Brand extracted successfully!");
      } else {
        toast.error(data.error || "Failed to extract brand");
      }
    } catch (error) {
      console.error('Error extracting brand:', error);
      toast.error("Failed to extract brand. Please check the URL and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyColor = (color: string, name: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(name);
    toast.success(`Copied ${name}: ${color}`);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const handleApplyColors = () => {
    if (result?.branding?.colors && onApplyColors) {
      onApplyColors(result.branding.colors);
      toast.success("Colors applied to site settings!");
    }
  };

  const renderColorSwatch = (color: string | undefined, name: string) => {
    if (!color) return null;
    
    return (
      <button
        onClick={() => copyColor(color, name)}
        className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors group"
      >
        <div
          className="w-10 h-10 rounded-md border shadow-sm flex-shrink-0"
          style={{ backgroundColor: color }}
        />
        <div className="text-left flex-1">
          <p className="text-sm font-medium capitalize">{name}</p>
          <p className="text-xs text-muted-foreground font-mono">{color}</p>
        </div>
        {copiedColor === name ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4 opacity-0 group-hover:opacity-50" />
        )}
      </button>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Extract Brand Theme
        </CardTitle>
        <CardDescription>
          Enter a website URL to extract its color scheme, fonts, and branding elements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleExtract} className="flex gap-3">
          <div className="relative flex-1">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="pl-10"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" disabled={isLoading || !url.trim()}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Extracting...
              </>
            ) : (
              "Extract"
            )}
          </Button>
        </form>

        {result && (
          <div className="space-y-6">
            {/* Screenshot Preview */}
            {result.screenshot && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Website Preview</h4>
                <div className="rounded-lg border overflow-hidden">
                  <img 
                    src={`data:image/png;base64,${result.screenshot}`} 
                    alt="Website screenshot"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            )}

            {/* Color Scheme */}
            {result.branding?.colors && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Extracted Colors</h4>
                  {result.branding.colorScheme && (
                    <span className="text-xs px-2 py-1 rounded-full bg-muted capitalize">
                      {result.branding.colorScheme} theme
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {renderColorSwatch(result.branding.colors.primary, "primary")}
                  {renderColorSwatch(result.branding.colors.secondary, "secondary")}
                  {renderColorSwatch(result.branding.colors.accent, "accent")}
                  {renderColorSwatch(result.branding.colors.background, "background")}
                  {renderColorSwatch(result.branding.colors.textPrimary, "textPrimary")}
                  {renderColorSwatch(result.branding.colors.textSecondary, "textSecondary")}
                </div>
                {onApplyColors && (
                  <Button onClick={handleApplyColors} variant="outline" className="w-full mt-3">
                    <Palette className="mr-2 h-4 w-4" />
                    Apply Colors to Site
                  </Button>
                )}
              </div>
            )}

            {/* Fonts */}
            {result.branding?.fonts && result.branding.fonts.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Fonts Used</h4>
                <div className="flex flex-wrap gap-2">
                  {result.branding.fonts.map((font, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-full bg-muted text-sm font-medium"
                      style={{ fontFamily: font.family }}
                    >
                      {font.family}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Typography Details */}
            {result.branding?.typography?.fontFamilies && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Typography</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {result.branding.typography.fontFamilies.primary && (
                    <div className="p-3 rounded-lg border bg-card">
                      <p className="text-xs text-muted-foreground">Primary</p>
                      <p className="font-medium">{result.branding.typography.fontFamilies.primary}</p>
                    </div>
                  )}
                  {result.branding.typography.fontFamilies.heading && (
                    <div className="p-3 rounded-lg border bg-card">
                      <p className="text-xs text-muted-foreground">Heading</p>
                      <p className="font-medium">{result.branding.typography.fontFamilies.heading}</p>
                    </div>
                  )}
                  {result.branding.typography.fontFamilies.code && (
                    <div className="p-3 rounded-lg border bg-card">
                      <p className="text-xs text-muted-foreground">Code</p>
                      <p className="font-medium font-mono">{result.branding.typography.fontFamilies.code}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Logo */}
            {result.branding?.logo && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Logo</h4>
                <div className="p-4 rounded-lg border bg-card">
                  <img 
                    src={result.branding.logo} 
                    alt="Extracted logo" 
                    className="max-h-16 object-contain"
                  />
                </div>
              </div>
            )}

            {/* Metadata */}
            {result.metadata && (
              <div className="space-y-2 pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  Source: {result.metadata.sourceURL}
                </p>
                {result.metadata.title && (
                  <p className="text-sm font-medium">{result.metadata.title}</p>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
