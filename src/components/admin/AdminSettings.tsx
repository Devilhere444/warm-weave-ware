import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Plus, Trash2, Mail, Shield, UserPlus, Save, 
  Building, Phone, Globe, MessageCircle, Clock,
  FileText, Type, Image, Upload, X, Settings2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminProductOptions from "./AdminProductOptions";

interface AdminEmail {
  id: string;
  email: string;
}

interface AdminUser {
  id: string;
  user_id: string;
  role: string;
  email?: string;
}

interface SiteSettings {
  [key: string]: string;
}

export default function AdminSettings() {
  const [adminEmails, setAdminEmails] = useState<AdminEmail[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [addingEmail, setAddingEmail] = useState(false);
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  // Site settings
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({});
  const [savingSettings, setSavingSettings] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);

      const [emailsRes, rolesRes, settingsRes] = await Promise.all([
        supabase.from("admin_emails").select("*").order("created_at", { ascending: true }),
        supabase.from("user_roles").select("*").eq("role", "admin").order("created_at", { ascending: true }),
        supabase.from("site_settings").select("*")
      ]);

      if (emailsRes.error) {
        console.error("Error fetching admin emails:", emailsRes.error);
      } else {
        setAdminEmails(emailsRes.data || []);
      }
      
      if (rolesRes.error) {
        console.error("Error fetching admin users:", rolesRes.error);
      } else {
        setAdminUsers(rolesRes.data || []);
      }

      if (settingsRes.error) {
        console.error("Error fetching site settings:", settingsRes.error);
      } else {
        const settings: SiteSettings = {};
        settingsRes.data?.forEach((item: any) => {
          settings[item.key] = item.value || "";
        });
        setSiteSettings(settings);
      }
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      const updates = Object.entries(siteSettings).map(([key, value]) => ({
        key,
        value
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from("site_settings")
          .update({ value: update.value })
          .eq("key", update.key);
        
        if (error) {
          console.error("Error updating setting:", update.key, error);
          throw error;
        }
      }

      toast.success("Settings saved successfully!");
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings: " + error.message);
    } finally {
      setSavingSettings(false);
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSiteSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }

    setUploadingLogo(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        toast.error("Failed to upload logo: " + uploadError.message);
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);

      // Update site settings
      updateSetting('logo_url', publicUrl);
      
      // Save to database
      const { error: updateError } = await supabase
        .from("site_settings")
        .upsert({ key: 'logo_url', value: publicUrl }, { onConflict: 'key' });

      if (updateError) {
        console.error("Error saving logo URL:", updateError);
        toast.error("Failed to save logo URL");
        return;
      }

      toast.success("Logo uploaded successfully!");
    } catch (error: any) {
      console.error("Error uploading logo:", error);
      toast.error("Failed to upload logo");
    } finally {
      setUploadingLogo(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveLogo = async () => {
    try {
      updateSetting('logo_url', '');
      
      const { error } = await supabase
        .from("site_settings")
        .update({ value: '' })
        .eq("key", "logo_url");

      if (error) {
        console.error("Error removing logo:", error);
        toast.error("Failed to remove logo");
        return;
      }

      toast.success("Logo removed");
    } catch (error: any) {
      console.error("Error removing logo:", error);
      toast.error("Failed to remove logo");
    }
  };

  const handleFaviconUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 1MB for favicon)
    if (file.size > 1 * 1024 * 1024) {
      toast.error("Favicon must be less than 1MB");
      return;
    }

    setUploadingFavicon(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `favicon-${Date.now()}.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        toast.error("Failed to upload favicon: " + uploadError.message);
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);

      // Update site settings
      updateSetting('favicon_url', publicUrl);
      
      // Save to database
      const { error: updateError } = await supabase
        .from("site_settings")
        .upsert({ key: 'favicon_url', value: publicUrl }, { onConflict: 'key' });

      if (updateError) {
        console.error("Error saving favicon URL:", updateError);
        toast.error("Failed to save favicon URL");
        return;
      }

      toast.success("Favicon uploaded successfully!");
    } catch (error: any) {
      console.error("Error uploading favicon:", error);
      toast.error("Failed to upload favicon");
    } finally {
      setUploadingFavicon(false);
      if (faviconInputRef.current) {
        faviconInputRef.current.value = '';
      }
    }
  };

  const handleRemoveFavicon = async () => {
    try {
      updateSetting('favicon_url', '');
      
      const { error } = await supabase
        .from("site_settings")
        .update({ value: '' })
        .eq("key", "favicon_url");

      if (error) {
        console.error("Error removing favicon:", error);
        toast.error("Failed to remove favicon");
        return;
      }

      toast.success("Favicon removed");
    } catch (error: any) {
      console.error("Error removing favicon:", error);
      toast.error("Failed to remove favicon");
    }
  };

  const handleAddEmail = async () => {
    const trimmedEmail = newEmail.trim().toLowerCase();
    
    if (!trimmedEmail || !trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (adminEmails.some(e => e.email.toLowerCase() === trimmedEmail)) {
      toast.error("This email is already added");
      return;
    }

    setAddingEmail(true);
    try {
      const { data, error } = await supabase
        .from("admin_emails")
        .insert({ email: trimmedEmail })
        .select()
        .single();

      if (error) {
        console.error("Error adding email:", error);
        if (error.code === "23505") {
          toast.error("This email is already added");
        } else if (error.code === "42501") {
          toast.error("Permission denied. You must be an admin to add emails.");
        } else {
          toast.error("Failed to add email: " + error.message);
        }
        return;
      }

      setAdminEmails((prev) => [...prev, data]);
      setNewEmail("");
      toast.success("Admin notification email added successfully");
    } catch (error: any) {
      console.error("Error adding email:", error);
      toast.error("Failed to add email");
    } finally {
      setAddingEmail(false);
    }
  };

  const handleRemoveEmail = async (id: string) => {
    if (adminEmails.length <= 1) {
      toast.error("You must have at least one admin notification email");
      return;
    }

    try {
      const { error } = await supabase
        .from("admin_emails")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error removing email:", error);
        toast.error("Failed to remove email: " + error.message);
        return;
      }

      setAdminEmails((prev) => prev.filter((e) => e.id !== id));
      toast.success("Email removed");
    } catch (error: any) {
      console.error("Error removing email:", error);
      toast.error("Failed to remove email");
    }
  };

  const handleAddAdmin = async () => {
    const trimmedEmail = newAdminEmail.trim().toLowerCase();
    
    if (!trimmedEmail || !trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setAddingAdmin(true);
    try {
      const { data: quoteData, error: quoteError } = await supabase
        .from("quote_requests")
        .select("user_id")
        .eq("email", trimmedEmail)
        .not("user_id", "is", null)
        .limit(1)
        .maybeSingle();

      if (quoteError) {
        console.error("Error finding user:", quoteError);
        toast.error("Error looking up user");
        return;
      }

      if (!quoteData?.user_id) {
        toast.error("User not found. They must sign up and submit a quote request first.");
        return;
      }

      const existingAdmin = adminUsers.find(a => a.user_id === quoteData.user_id);
      if (existingAdmin) {
        toast.error("This user is already an admin");
        return;
      }

      const { data, error } = await supabase
        .from("user_roles")
        .insert({ user_id: quoteData.user_id, role: "admin" })
        .select()
        .single();

      if (error) {
        console.error("Error adding admin:", error);
        if (error.code === "23505") {
          toast.error("This user is already an admin");
        } else {
          toast.error("Failed to add admin: " + error.message);
        }
        return;
      }

      setAdminUsers((prev) => [...prev, { ...data, email: trimmedEmail }]);
      setNewAdminEmail("");
      toast.success("Admin added successfully");
    } catch (error: any) {
      console.error("Error adding admin:", error);
      toast.error("Failed to add admin");
    } finally {
      setAddingAdmin(false);
    }
  };

  const handleRemoveAdmin = async (adminUser: AdminUser) => {
    if (adminUser.user_id === currentUserId) {
      toast.error("You cannot remove yourself as admin");
      return;
    }

    if (adminUsers.length <= 1) {
      toast.error("You must have at least one admin");
      return;
    }

    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("id", adminUser.id);

      if (error) {
        console.error("Error removing admin:", error);
        toast.error("Failed to remove admin: " + error.message);
        return;
      }

      setAdminUsers((prev) => prev.filter((a) => a.id !== adminUser.id));
      toast.success("Admin removed");
    } catch (error: any) {
      console.error("Error removing admin:", error);
      toast.error("Failed to remove admin");
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
    <div className="max-w-4xl">
      <Tabs defaultValue="website" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="website" className="font-elegant">Website</TabsTrigger>
          <TabsTrigger value="quote-options" className="font-elegant">Quote Options</TabsTrigger>
          <TabsTrigger value="admins" className="font-elegant">Admins</TabsTrigger>
          <TabsTrigger value="notifications" className="font-elegant">Notifications</TabsTrigger>
        </TabsList>

        {/* Quote Options Tab */}
        <TabsContent value="quote-options">
          <AdminProductOptions />
        </TabsContent>

        {/* Website Settings */}
        <TabsContent value="website" className="space-y-6">
          {/* Logo Upload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card p-6 rounded-xl border border-border"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Image className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold">Logo</h2>
                <p className="text-sm text-muted-foreground font-elegant">
                  Upload your website logo (max 2MB)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {siteSettings.logo_url ? (
                <div className="relative group">
                  <img
                    src={siteSettings.logo_url}
                    alt="Current logo"
                    className="w-24 h-24 object-contain rounded-lg border border-border bg-background"
                  />
                  <button
                    onClick={handleRemoveLogo}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted/50">
                  <Image className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingLogo}
                  className="gap-2"
                >
                  {uploadingLogo ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      {siteSettings.logo_url ? 'Change Logo' : 'Upload Logo'}
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  PNG, JPG or SVG recommended
                </p>
              </div>
            </div>
          </motion.div>

          {/* Favicon Upload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.025 }}
            className="bg-card p-6 rounded-xl border border-border"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Image className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold">Favicon</h2>
                <p className="text-sm text-muted-foreground font-elegant">
                  Upload your browser tab icon (max 1MB, 32x32 or 64x64 recommended)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {siteSettings.favicon_url ? (
                <div className="relative group">
                  <img
                    src={siteSettings.favicon_url}
                    alt="Current favicon"
                    className="w-16 h-16 object-contain rounded-lg border border-border bg-background"
                  />
                  <button
                    onClick={handleRemoveFavicon}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted/50">
                  <Image className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
              <div>
                <input
                  ref={faviconInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFaviconUpload}
                  className="hidden"
                  id="favicon-upload"
                />
                <Button
                  variant="outline"
                  onClick={() => faviconInputRef.current?.click()}
                  disabled={uploadingFavicon}
                  className="gap-2"
                >
                  {uploadingFavicon ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      {siteSettings.favicon_url ? 'Change Favicon' : 'Upload Favicon'}
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  PNG, ICO or SVG recommended
                </p>
              </div>
            </div>
          </motion.div>

          {/* Branding */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-card p-6 rounded-xl border border-border"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Type className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold">Branding</h2>
                <p className="text-sm text-muted-foreground font-elegant">
                  Site name, tagline, and hero content
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              <div>
                <label className="text-sm font-elegant text-foreground mb-1 block">Site Name</label>
                <Input
                  value={siteSettings.site_name || ""}
                  onChange={(e) => updateSetting("site_name", e.target.value)}
                  placeholder="Your business name"
                  className="touch-target"
                />
              </div>
              <div>
                <label className="text-sm font-elegant text-foreground mb-1 block">Tagline</label>
                <Input
                  value={siteSettings.site_tagline || ""}
                  onChange={(e) => updateSetting("site_tagline", e.target.value)}
                  placeholder="A short description of your business"
                  className="touch-target"
                />
              </div>
              <div>
                <label className="text-sm font-elegant text-foreground mb-1 block">Hero Title</label>
                <Input
                  value={siteSettings.hero_title || ""}
                  onChange={(e) => updateSetting("hero_title", e.target.value)}
                  placeholder="Main homepage headline"
                  className="touch-target"
                />
              </div>
              <div>
                <label className="text-sm font-elegant text-foreground mb-1 block">Hero Subtitle</label>
                <Textarea
                  value={siteSettings.hero_subtitle || ""}
                  onChange={(e) => updateSetting("hero_subtitle", e.target.value)}
                  placeholder="Homepage subtitle text"
                  rows={2}
                  className="touch-target"
                />
              </div>
              <div>
                <label className="text-sm font-elegant text-foreground mb-1 block">Footer Text</label>
                <Input
                  value={siteSettings.footer_text || ""}
                  onChange={(e) => updateSetting("footer_text", e.target.value)}
                  placeholder="Footer description"
                  className="touch-target"
                />
              </div>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card p-6 rounded-xl border border-border"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold">Contact Information</h2>
                <p className="text-sm text-muted-foreground font-elegant">
                  Business contact details shown on the website
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-elegant text-foreground mb-1 block">
                  <Mail className="w-4 h-4 inline mr-1" /> Contact Email
                </label>
                <Input
                  type="email"
                  value={siteSettings.contact_email || ""}
                  onChange={(e) => updateSetting("contact_email", e.target.value)}
                  placeholder="contact@example.com"
                  className="touch-target"
                />
              </div>
              <div>
                <label className="text-sm font-elegant text-foreground mb-1 block">
                  <Phone className="w-4 h-4 inline mr-1" /> Phone Number
                </label>
                <Input
                  value={siteSettings.contact_phone || ""}
                  onChange={(e) => updateSetting("contact_phone", e.target.value)}
                  placeholder="+1 234 567 8900"
                  className="touch-target"
                />
              </div>
              <div>
                <label className="text-sm font-elegant text-foreground mb-1 block">
                  <MessageCircle className="w-4 h-4 inline mr-1" /> WhatsApp Number
                </label>
                <Input
                  value={siteSettings.whatsapp_number || ""}
                  onChange={(e) => updateSetting("whatsapp_number", e.target.value)}
                  placeholder="+1234567890 (no spaces)"
                  className="touch-target"
                />
              </div>
              <div>
                <label className="text-sm font-elegant text-foreground mb-1 block">
                  <Clock className="w-4 h-4 inline mr-1" /> Business Hours
                </label>
                <Input
                  value={siteSettings.business_hours || ""}
                  onChange={(e) => updateSetting("business_hours", e.target.value)}
                  placeholder="Mon-Fri: 9AM-6PM"
                  className="touch-target"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-elegant text-foreground mb-1 block">Address</label>
                <Textarea
                  value={siteSettings.contact_address || ""}
                  onChange={(e) => updateSetting("contact_address", e.target.value)}
                  placeholder="Your business address"
                  rows={2}
                  className="touch-target"
                />
              </div>
            </div>
          </motion.div>

          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card p-6 rounded-xl border border-border"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold">Social Media Links</h2>
                <p className="text-sm text-muted-foreground font-elegant">
                  Links to your social media profiles
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-sm font-elegant text-foreground mb-1 block">Facebook URL</label>
                <Input
                  value={siteSettings.facebook_url || ""}
                  onChange={(e) => updateSetting("facebook_url", e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="touch-target"
                />
              </div>
              <div>
                <label className="text-sm font-elegant text-foreground mb-1 block">Instagram URL</label>
                <Input
                  value={siteSettings.instagram_url || ""}
                  onChange={(e) => updateSetting("instagram_url", e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="touch-target"
                />
              </div>
              <div>
                <label className="text-sm font-elegant text-foreground mb-1 block">Twitter/X URL</label>
                <Input
                  value={siteSettings.twitter_url || ""}
                  onChange={(e) => updateSetting("twitter_url", e.target.value)}
                  placeholder="https://twitter.com/..."
                  className="touch-target"
                />
              </div>
            </div>
          </motion.div>

          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card p-6 rounded-xl border border-border"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold">About Section</h2>
                <p className="text-sm text-muted-foreground font-elegant">
                  Content for your about page
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-elegant text-foreground mb-1 block">About Text</label>
              <Textarea
                value={siteSettings.about_text || ""}
                onChange={(e) => updateSetting("about_text", e.target.value)}
                placeholder="Tell visitors about your business, history, values..."
                rows={5}
                className="touch-target"
              />
            </div>
          </motion.div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSaveSettings} 
              disabled={savingSettings}
              size="lg"
              className="gap-2 btn-snappy"
            >
              <Save className="w-4 h-4" />
              {savingSettings ? "Saving..." : "Save All Changes"}
            </Button>
          </div>
        </TabsContent>

        {/* Admin Users Tab */}
        <TabsContent value="admins">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card p-6 rounded-xl border border-border"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold">Admin Users</h2>
                <p className="text-sm text-muted-foreground font-elegant">
                  Manage who has admin access to the dashboard
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter user email to add as admin..."
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !addingAdmin && handleAddAdmin()}
                  disabled={addingAdmin}
                  className="touch-target"
                />
                <Button 
                  onClick={handleAddAdmin} 
                  disabled={addingAdmin}
                  className="btn-snappy touch-target"
                >
                  <UserPlus className="w-4 h-4 mr-1" />
                  {addingAdmin ? "Adding..." : "Add"}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Note: The user must have signed up and submitted at least one quote request to be found.
              </p>

              <div className="space-y-2">
                {adminUsers.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No admin users configured yet
                  </p>
                ) : (
                  adminUsers.map((adminUser) => (
                    <div
                      key={adminUser.id}
                      className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary" />
                        <span className="font-body font-mono text-sm">
                          {adminUser.user_id.slice(0, 8)}...
                        </span>
                        {adminUser.user_id === currentUserId && (
                          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                            You
                          </span>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveAdmin(adminUser)}
                        disabled={adminUser.user_id === currentUserId}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 disabled:opacity-50 touch-target"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card p-6 rounded-xl border border-border"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold">Admin Notification Emails</h2>
                <p className="text-sm text-muted-foreground font-elegant">
                  Email addresses that receive new order notifications
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter notification email..."
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !addingEmail && handleAddEmail()}
                  disabled={addingEmail}
                  className="touch-target"
                />
                <Button 
                  onClick={handleAddEmail} 
                  disabled={addingEmail}
                  className="btn-snappy touch-target"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  {addingEmail ? "Adding..." : "Add"}
                </Button>
              </div>

              <div className="space-y-2">
                {adminEmails.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No notification emails configured yet
                  </p>
                ) : (
                  adminEmails.map((adminEmail) => (
                    <div
                      key={adminEmail.id}
                      className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
                    >
                      <span className="font-body">{adminEmail.email}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveEmail(adminEmail.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 touch-target"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
