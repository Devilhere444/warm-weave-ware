import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Package, LogOut, Clock, Mail, Phone, FileText, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { format } from "date-fns";

interface QuoteRequest {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  status: string;
  email_verified: boolean;
  created_at: string;
  notes: string | null;
  items: QuoteRequestItem[];
}

interface QuoteRequestItem {
  id: string;
  product_title: string;
  quantity: number;
  finish_option: string | null;
  paper_option: string | null;
  binding_option: string | null;
  special_requirements: string | null;
}

export default function Account() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [loadingQuotes, setLoadingQuotes] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchQuoteRequests = async (userId: string) => {
      try {
        const { data: quotes, error: quotesError } = await supabase
          .from("quote_requests")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (quotesError) throw quotesError;

        // Fetch items for each quote
        const quotesWithItems: QuoteRequest[] = [];
        for (const quote of quotes || []) {
          const { data: items } = await supabase
            .from("quote_request_items")
            .select("*")
            .eq("quote_request_id", quote.id);

          quotesWithItems.push({
            ...quote,
            items: items || [],
          });
        }

        if (isMounted) {
          setQuoteRequests(quotesWithItems);
        }
      } catch (error) {
        console.error("Error fetching quote requests:", error);
      } finally {
        if (isMounted) {
          setLoadingQuotes(false);
        }
      }
    };

    // Check session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;

      if (session?.user) {
        setUser(session.user);
        setLoading(false);
        fetchQuoteRequests(session.user.id);
      } else {
        navigate("/auth");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) return;

        if (event === "SIGNED_OUT") {
          navigate("/auth");
        } else if (session?.user) {
          setUser(session.user);
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "reviewed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "quoted":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-28 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Profile Header */}
            <div className="bg-card rounded-2xl border border-border p-6 md:p-8 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                    <User className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="font-display text-2xl font-bold text-foreground">
                      My Account
                    </h1>
                    <p className="text-muted-foreground font-elegant flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {user?.email}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="gap-2 font-elegant"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </div>

            {/* Quote Requests Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Package className="w-6 h-6 text-primary" />
                <h2 className="font-display text-xl font-semibold text-foreground">
                  My Quote Requests
                </h2>
              </div>

              {loadingQuotes ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardHeader>
                        <Skeleton className="h-6 w-48" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : quoteRequests.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                      No Quote Requests Yet
                    </h3>
                    <p className="text-muted-foreground font-body mb-6">
                      You haven't submitted any quote requests yet.
                    </p>
                    <Button
                      onClick={() => navigate("/products")}
                      className="font-elegant"
                    >
                      Browse Products
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {quoteRequests.map((quote) => (
                    <motion.div
                      key={quote.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground font-body">
                                {format(new Date(quote.created_at), "MMM d, yyyy 'at' h:mm a")}
                              </span>
                            </div>
                            <Badge
                              variant="outline"
                              className={`capitalize ${getStatusColor(quote.status)}`}
                            >
                              {quote.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {quote.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
                              >
                                <div className="flex-1">
                                  <p className="font-display font-medium text-foreground">
                                    {item.product_title}
                                  </p>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    <span className="text-xs text-muted-foreground font-body">
                                      Qty: {item.quantity}
                                    </span>
                                    {item.finish_option && (
                                      <span className="text-xs text-muted-foreground font-body">
                                        • {item.finish_option}
                                      </span>
                                    )}
                                    {item.paper_option && (
                                      <span className="text-xs text-muted-foreground font-body">
                                        • {item.paper_option}
                                      </span>
                                    )}
                                    {item.binding_option && (
                                      <span className="text-xs text-muted-foreground font-body">
                                        • {item.binding_option}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                              </div>
                            ))}

                            {quote.notes && (
                              <div className="pt-2 border-t border-border">
                                <p className="text-sm text-muted-foreground font-body">
                                  <span className="font-medium">Notes:</span> {quote.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate("/products")}
              >
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground">
                      Browse Products
                    </h3>
                    <p className="text-sm text-muted-foreground font-body">
                      Explore our printing services
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate("/contact")}
              >
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground">
                      Contact Us
                    </h3>
                    <p className="text-sm text-muted-foreground font-body">
                      Get in touch with our team
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
