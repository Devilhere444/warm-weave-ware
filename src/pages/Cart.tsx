import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ArrowLeft, Send, ShoppingCart, MessageCircle, Edit2, Check, X } from "lucide-react";
import { z } from "zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart, CartItem } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().max(20).optional(),
  notes: z.string().trim().max(2000).optional(),
});

export default function Cart() {
  const { items, removeItem, updateItem, clearCart } = useCart();
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<CartItem>>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const startEditing = (item: CartItem) => {
    setEditingItem(item.productId);
    setEditForm({
      quantity: item.quantity,
      finishOption: item.finishOption,
      paperOption: item.paperOption,
      bindingOption: item.bindingOption,
      specialRequirements: item.specialRequirements,
    });
  };

  const cancelEditing = () => {
    setEditingItem(null);
    setEditForm({});
  };

  const saveEditing = (productId: string) => {
    updateItem(productId, editForm);
    setEditingItem(null);
    setEditForm({});
    toast({
      title: "Item Updated",
      description: "Your customization options have been saved.",
    });
  };

  const generateWhatsAppMessage = () => {
    let message = `*Quote Request*\n\n`;
    message += `*Customer Details:*\n`;
    message += `Name: ${formData.name || "Not provided"}\n`;
    message += `Email: ${formData.email || "Not provided"}\n`;
    message += `Phone: ${formData.phone || "Not provided"}\n\n`;
    
    message += `*Items (${items.length}):*\n`;
    message += `${"─".repeat(20)}\n`;
    
    items.forEach((item, index) => {
      message += `\n*${index + 1}. ${item.productTitle}*\n`;
      message += `   Category: ${item.category}\n`;
      message += `   Quantity: ${item.quantity}\n`;
      if (item.finishOption) message += `   Finish: ${item.finishOption}\n`;
      if (item.paperOption) message += `   Paper: ${item.paperOption}\n`;
      if (item.bindingOption) message += `   Binding: ${item.bindingOption}\n`;
      if (item.specialRequirements) message += `   Notes: ${item.specialRequirements}\n`;
    });
    
    if (formData.notes) {
      message += `\n${"─".repeat(20)}\n`;
      message += `*Additional Notes:*\n${formData.notes}`;
    }
    
    return encodeURIComponent(message);
  };

  const handleWhatsAppQuote = () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add some products to your quote request.",
        variant: "destructive",
      });
      return;
    }

    const whatsappNumber = settings.whatsapp_number?.replace(/[^0-9]/g, "") || "";
    if (!whatsappNumber) {
      toast({
        title: "WhatsApp not configured",
        description: "Please use the email submission instead.",
        variant: "destructive",
      });
      return;
    }

    const message = generateWhatsAppMessage();
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add some products to your quote request.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current user if logged in
      const { data: { user } } = await supabase.auth.getUser();

      // Create quote request
      const { data: quoteRequest, error: quoteError } = await supabase
        .from("quote_requests")
        .insert({
          email: formData.email,
          name: formData.name,
          phone: formData.phone || null,
          notes: formData.notes || null,
          user_id: user?.id || null,
        })
        .select()
        .single();

      if (quoteError) throw quoteError;

      // Insert quote items
      const itemsToInsert = items.map((item) => ({
        quote_request_id: quoteRequest.id,
        product_id: item.productId,
        product_title: item.productTitle,
        quantity: item.quantity,
        finish_option: item.finishOption || null,
        paper_option: item.paperOption || null,
        binding_option: item.bindingOption || null,
        special_requirements: item.specialRequirements || null,
      }));

      const { error: itemsError } = await supabase
        .from("quote_request_items")
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      // Send verification email (no auth required)
      try {
        const { data, error: emailError } = await supabase.functions.invoke("send-verification-email", {
          body: {
            quoteId: quoteRequest.id,
            email: formData.email,
            customerName: formData.name,
          },
        });

        if (emailError) {
          console.error("Verification email failed:", emailError);
          // Still clear cart - quote is saved
        }
      } catch (emailError) {
        console.error("Verification email failed:", emailError);
        // Don't fail the whole request if email fails
      }

      clearCart();
      toast({
        title: "Check Your Email!",
        description: "We've sent a verification link to complete your quote request.",
      });
      navigate("/");
    } catch (error: any) {
      console.error("Error submitting quote:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-12 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block text-sm font-elegant tracking-widest uppercase text-accent mb-4">
              Your Selection
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Quote <span className="text-gradient-gold">Cart</span>
            </h1>
            <p className="text-muted-foreground font-body">
              Review your selections and submit a combined quote request.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8">
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Your cart is empty
              </h2>
              <p className="text-muted-foreground font-body mb-8">
                Browse our products and add items to request a quote.
              </p>
              <Link to="/products">
                <Button className="font-elegant">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Browse Products
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
                  Items ({items.length})
                </h2>
                {items.map((item, index) => (
                  <motion.div
                    key={item.productId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-card rounded-xl border border-border"
                  >
                    <div className="flex gap-4">
                      <img
                        src={item.productImage}
                        alt={item.productTitle}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className="text-xs font-elegant text-accent uppercase tracking-wide">
                              {item.category}
                            </span>
                            <h3 className="font-display text-lg font-semibold text-foreground">
                              {item.productTitle}
                            </h3>
                          </div>
                          <div className="flex gap-1">
                            {editingItem !== item.productId && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => startEditing(item)}
                                className="text-muted-foreground hover:text-primary"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.productId)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {editingItem === item.productId ? (
                          <div className="mt-4 space-y-3 p-3 bg-secondary/50 rounded-lg">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs">Quantity</Label>
                                <Input
                                  type="number"
                                  value={editForm.quantity || 1}
                                  onChange={(e) => setEditForm(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                                  className="h-8 text-sm"
                                  min={1}
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Finish Option</Label>
                                <Input
                                  value={editForm.finishOption || ""}
                                  onChange={(e) => setEditForm(prev => ({ ...prev, finishOption: e.target.value }))}
                                  className="h-8 text-sm"
                                  placeholder="e.g., Matte Lamination"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Paper Option</Label>
                                <Input
                                  value={editForm.paperOption || ""}
                                  onChange={(e) => setEditForm(prev => ({ ...prev, paperOption: e.target.value }))}
                                  className="h-8 text-sm"
                                  placeholder="e.g., 100gsm Silk"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Binding Option</Label>
                                <Input
                                  value={editForm.bindingOption || ""}
                                  onChange={(e) => setEditForm(prev => ({ ...prev, bindingOption: e.target.value }))}
                                  className="h-8 text-sm"
                                  placeholder="e.g., Perfect Bound"
                                />
                              </div>
                            </div>
                            <div>
                              <Label className="text-xs">Special Requirements</Label>
                              <Textarea
                                value={editForm.specialRequirements || ""}
                                onChange={(e) => setEditForm(prev => ({ ...prev, specialRequirements: e.target.value }))}
                                className="text-sm min-h-[60px]"
                                placeholder="Any special notes..."
                              />
                            </div>
                            <div className="flex gap-2 justify-end">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={cancelEditing}
                              >
                                <X className="w-3 h-3 mr-1" />
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => saveEditing(item.productId)}
                              >
                                <Check className="w-3 h-3 mr-1" />
                                Save
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="mt-2 flex flex-wrap gap-2 text-sm font-body text-muted-foreground">
                              <span className="px-2 py-1 bg-secondary rounded">
                                Qty: {item.quantity}
                              </span>
                              {item.finishOption && (
                                <span className="px-2 py-1 bg-secondary rounded">
                                  {item.finishOption}
                                </span>
                              )}
                              {item.paperOption && (
                                <span className="px-2 py-1 bg-secondary rounded">
                                  {item.paperOption}
                                </span>
                              )}
                              {item.bindingOption && (
                                <span className="px-2 py-1 bg-secondary rounded">
                                  {item.bindingOption}
                                </span>
                              )}
                            </div>
                            {item.specialRequirements && (
                              <p className="mt-2 text-sm text-muted-foreground italic">
                                "{item.specialRequirements}"
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                <Link to="/products">
                  <Button variant="outline" className="font-elegant mt-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Add More Products
                  </Button>
                </Link>
              </div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1"
              >
                <div className="sticky top-28 p-6 bg-card rounded-2xl border border-border shadow-lg">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-6">
                    Your Details
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="font-body">
                        Name *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        className={errors.name ? "border-destructive" : ""}
                      />
                      {errors.name && (
                        <p className="text-xs text-destructive">{errors.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-body">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        className={errors.email ? "border-destructive" : ""}
                      />
                      {errors.email && (
                        <p className="text-xs text-destructive">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="font-body">
                        Phone (optional)
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes" className="font-body">
                        Additional Notes
                      </Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Any specific requirements for your order..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-3">
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full font-elegant"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          "Submitting..."
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Submit Quote Request
                          </>
                        )}
                      </Button>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-card px-2 text-muted-foreground">or</span>
                        </div>
                      </div>

                      <Button
                        type="button"
                        size="lg"
                        variant="outline"
                        className="w-full font-elegant bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] text-white border-0"
                        onClick={handleWhatsAppQuote}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Send via WhatsApp
                      </Button>
                    </div>

                    <p className="text-xs text-center text-muted-foreground font-body">
                      Email submission includes verification • WhatsApp is instant
                    </p>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
