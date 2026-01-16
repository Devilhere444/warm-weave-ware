import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Plus, Trash2, Mail, Bell, Building, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AdminEmail {
  id: string;
  email: string;
}

export default function AdminSettings() {
  const [adminEmails, setAdminEmails] = useState<AdminEmail[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Business settings (stored in localStorage for now)
  const [businessSettings, setBusinessSettings] = useState({
    businessName: "Litho Art Press",
    tagline: "Bihar • Since 1985",
    email: "contact@lithoartpress.com",
    phone: "+91 98765 43210",
    address: "123 Print Street, Patna, Bihar 800001",
    enableEmailNotifications: true,
    enableOrderConfirmations: true,
  });

  useEffect(() => {
    fetchAdminEmails();
    loadBusinessSettings();
  }, []);

  const fetchAdminEmails = async () => {
    try {
      const { data, error } = await supabase
        .from("admin_emails")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      setAdminEmails(data || []);
    } catch (error: any) {
      console.error("Error fetching admin emails:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadBusinessSettings = () => {
    const saved = localStorage.getItem("litho_business_settings");
    if (saved) {
      setBusinessSettings(JSON.parse(saved));
    }
  };

  const handleAddEmail = async () => {
    if (!newEmail || !newEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("admin_emails")
        .insert({ email: newEmail })
        .select()
        .single();

      if (error) throw error;

      setAdminEmails((prev) => [...prev, data]);
      setNewEmail("");
      toast.success("Admin email added successfully");
    } catch (error: any) {
      if (error.code === "23505") {
        toast.error("This email is already added");
      } else {
        toast.error("Failed to add email");
      }
    }
  };

  const handleRemoveEmail = async (id: string) => {
    if (adminEmails.length <= 1) {
      toast.error("You must have at least one admin email");
      return;
    }

    try {
      const { error } = await supabase
        .from("admin_emails")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setAdminEmails((prev) => prev.filter((e) => e.id !== id));
      toast.success("Email removed");
    } catch (error: any) {
      toast.error("Failed to remove email");
    }
  };

  const handleSaveBusinessSettings = () => {
    setSaving(true);
    try {
      localStorage.setItem("litho_business_settings", JSON.stringify(businessSettings));
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
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
    <div className="max-w-3xl space-y-8">
      {/* Business Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card p-6 rounded-xl border border-border"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Building className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold">Business Information</h2>
            <p className="text-sm text-muted-foreground font-elegant">
              Update your business details
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessName" className="font-elegant">Business Name</Label>
              <Input
                id="businessName"
                value={businessSettings.businessName}
                onChange={(e) =>
                  setBusinessSettings((prev) => ({ ...prev, businessName: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline" className="font-elegant">Tagline</Label>
              <Input
                id="tagline"
                value={businessSettings.tagline}
                onChange={(e) =>
                  setBusinessSettings((prev) => ({ ...prev, tagline: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-elegant">Contact Email</Label>
              <Input
                id="email"
                type="email"
                value={businessSettings.email}
                onChange={(e) =>
                  setBusinessSettings((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="font-elegant">Phone Number</Label>
              <Input
                id="phone"
                value={businessSettings.phone}
                onChange={(e) =>
                  setBusinessSettings((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="font-elegant">Business Address</Label>
            <Textarea
              id="address"
              value={businessSettings.address}
              onChange={(e) =>
                setBusinessSettings((prev) => ({ ...prev, address: e.target.value }))
              }
              rows={2}
            />
          </div>
        </div>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card p-6 rounded-xl border border-border"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold">Notification Settings</h2>
            <p className="text-sm text-muted-foreground font-elegant">
              Configure email notifications
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
            <div>
              <p className="font-body font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive email alerts for new quote requests
              </p>
            </div>
            <Switch
              checked={businessSettings.enableEmailNotifications}
              onCheckedChange={(checked) =>
                setBusinessSettings((prev) => ({ ...prev, enableEmailNotifications: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
            <div>
              <p className="font-body font-medium">Order Confirmations</p>
              <p className="text-sm text-muted-foreground">
                Send confirmation emails to customers
              </p>
            </div>
            <Switch
              checked={businessSettings.enableOrderConfirmations}
              onCheckedChange={(checked) =>
                setBusinessSettings((prev) => ({ ...prev, enableOrderConfirmations: checked }))
              }
            />
          </div>
        </div>
      </motion.div>

      {/* Admin Emails */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card p-6 rounded-xl border border-border"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Mail className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold">Admin Notification Emails</h2>
            <p className="text-sm text-muted-foreground font-elegant">
              Emails that receive new order notifications
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Add new email */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter admin email..."
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddEmail()}
            />
            <Button onClick={handleAddEmail}>
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>

          {/* Email list */}
          <div className="space-y-2">
            {adminEmails.map((adminEmail) => (
              <div
                key={adminEmail.id}
                className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
              >
                <span className="font-body">{adminEmail.email}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveEmail(adminEmail.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSaveBusinessSettings}
          disabled={saving}
          className="font-elegant"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
