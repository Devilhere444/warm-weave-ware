import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface InviteTemplate {
  id: string;
  category: string;
  title: string;
  description: string | null;
  price: string | null;
  video_url: string;
  thumbnail_url: string | null;
  display_order: number | null;
  is_active: boolean;
}

const categories = [
  "wedding",
  "birthday",
  "anniversary",
  "upnayan",
  "engagement",
  "housewarming",
  "mundan",
  "baby_shower",
  "graduation",
  "other"
];

const categoryLabels: Record<string, string> = {
  wedding: "Wedding",
  birthday: "Birthday",
  anniversary: "Anniversary",
  upnayan: "Upnayan",
  engagement: "Engagement",
  housewarming: "Housewarming",
  mundan: "Mundan",
  baby_shower: "Baby Shower",
  graduation: "Graduation",
  other: "Other"
};

export default function AdminInvites() {
  const [templates, setTemplates] = useState<InviteTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<InviteTemplate | null>(null);
  
  const [formData, setFormData] = useState({
    category: "wedding",
    title: "",
    description: "",
    price: "",
    video_url: "",
    thumbnail_url: "",
    display_order: 0,
    is_active: true
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from("invite_templates")
        .select("*")
        .order("category")
        .order("display_order");

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast.error("Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      category: "wedding",
      title: "",
      description: "",
      price: "",
      video_url: "",
      thumbnail_url: "",
      display_order: 0,
      is_active: true
    });
    setEditingTemplate(null);
  };

  const handleEdit = (template: InviteTemplate) => {
    setEditingTemplate(template);
    setFormData({
      category: template.category,
      title: template.title,
      description: template.description || "",
      price: template.price || "",
      video_url: template.video_url,
      thumbnail_url: template.thumbnail_url || "",
      display_order: template.display_order || 0,
      is_active: template.is_active
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.video_url) {
      toast.error("Title and Video URL are required");
      return;
    }

    setSaving(true);
    try {
      if (editingTemplate) {
        const { error } = await supabase
          .from("invite_templates")
          .update({
            category: formData.category,
            title: formData.title,
            description: formData.description || null,
            price: formData.price || null,
            video_url: formData.video_url,
            thumbnail_url: formData.thumbnail_url || null,
            display_order: formData.display_order,
            is_active: formData.is_active
          })
          .eq("id", editingTemplate.id);

        if (error) throw error;
        toast.success("Template updated successfully");
      } else {
        const { error } = await supabase
          .from("invite_templates")
          .insert({
            category: formData.category,
            title: formData.title,
            description: formData.description || null,
            price: formData.price || null,
            video_url: formData.video_url,
            thumbnail_url: formData.thumbnail_url || null,
            display_order: formData.display_order,
            is_active: formData.is_active
          });

        if (error) throw error;
        toast.success("Template created successfully");
      }

      setDialogOpen(false);
      resetForm();
      fetchTemplates();
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Failed to save template");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;

    try {
      const { error } = await supabase
        .from("invite_templates")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Template deleted successfully");
      fetchTemplates();
    } catch (error) {
      console.error("Error deleting template:", error);
      toast.error("Failed to delete template");
    }
  };

  const toggleActive = async (template: InviteTemplate) => {
    try {
      const { error } = await supabase
        .from("invite_templates")
        .update({ is_active: !template.is_active })
        .eq("id", template.id);

      if (error) throw error;
      fetchTemplates();
    } catch (error) {
      console.error("Error toggling active state:", error);
      toast.error("Failed to update template");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Video Invitations</h2>
          <p className="text-muted-foreground">Manage your video invitation templates</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTemplate ? "Edit Template" : "Add New Template"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {categoryLabels[cat]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Royal Elegance"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Traditional golden theme with elegant animations..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Price</Label>
                <Input
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="₹1,499"
                />
              </div>

              <div className="space-y-2">
                <Label>Video URL (YouTube Shorts) *</Label>
                <Input
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://www.youtube.com/shorts/xxxxx"
                />
                <p className="text-xs text-muted-foreground">
                  Paste YouTube Shorts URL (e.g., youtube.com/shorts/VIDEO_ID)
                </p>
              </div>

              <div className="space-y-2">
                <Label>Thumbnail URL</Label>
                <Input
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  placeholder="https://example.com/thumbnail.jpg"
                />
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label>Active (visible to customers)</Label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave} disabled={saving} className="flex-1">
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingTemplate ? "Update" : "Create"} Template
                </Button>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Preview</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>
                    <img
                      src={template.thumbnail_url || "https://via.placeholder.com/60x107"}
                      alt={template.title}
                      className="w-12 h-20 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{template.title}</TableCell>
                  <TableCell>
                    <span className="capitalize">{categoryLabels[template.category] || template.category}</span>
                  </TableCell>
                  <TableCell>{template.price || "-"}</TableCell>
                  <TableCell>{template.display_order}</TableCell>
                  <TableCell>
                    <Switch
                      checked={template.is_active}
                      onCheckedChange={() => toggleActive(template)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(template.video_url, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(template)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(template.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {templates.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    No templates yet. Click "Add Template" to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
