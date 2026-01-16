import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Mail, Shield, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

export default function AdminSettings() {
  const [adminEmails, setAdminEmails] = useState<AdminEmail[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [addingEmail, setAddingEmail] = useState(false);
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);

      const [emailsRes, rolesRes] = await Promise.all([
        supabase.from("admin_emails").select("*").order("created_at", { ascending: true }),
        supabase.from("user_roles").select("*").eq("role", "admin").order("created_at", { ascending: true })
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
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmail = async () => {
    const trimmedEmail = newEmail.trim().toLowerCase();
    
    if (!trimmedEmail || !trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Check for duplicate locally first
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
      // Find user by email in quote_requests (only way without admin SDK)
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

      // Check if already an admin
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
    <div className="max-w-3xl space-y-8">
      {/* Admin Users Management */}
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
          {/* Add new admin */}
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

          {/* Admin list */}
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

      {/* Admin Notification Emails */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
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
          {/* Add new email */}
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

          {/* Email list */}
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
    </div>
  );
}
