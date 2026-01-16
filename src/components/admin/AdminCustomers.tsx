import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Calendar, Package, Search, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Customer {
  email: string;
  name: string | null;
  phone: string | null;
  totalOrders: number;
  lastOrder: string;
  status: string;
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from("quote_requests")
        .select("email, name, phone, created_at, status")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Aggregate customers by email
      const customerMap = new Map<string, Customer>();
      
      data?.forEach((order) => {
        const existing = customerMap.get(order.email);
        if (existing) {
          existing.totalOrders += 1;
          if (new Date(order.created_at) > new Date(existing.lastOrder)) {
            existing.lastOrder = order.created_at;
            existing.name = order.name || existing.name;
            existing.phone = order.phone || existing.phone;
          }
        } else {
          customerMap.set(order.email, {
            email: order.email,
            name: order.name,
            phone: order.phone,
            totalOrders: 1,
            lastOrder: order.created_at,
            status: "active",
          });
        }
      });

      setCustomers(Array.from(customerMap.values()));
    } catch (error: any) {
      console.error("Error fetching customers:", error);
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search customers by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-card p-4 rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold">{customers.length}</p>
              <p className="text-sm text-muted-foreground font-elegant">Total Customers</p>
            </div>
          </div>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold">
                {customers.filter((c) => c.totalOrders > 1).length}
              </p>
              <p className="text-sm text-muted-foreground font-elegant">Repeat Customers</p>
            </div>
          </div>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold">
                {customers.filter((c) => {
                  const lastOrder = new Date(c.lastOrder);
                  const thirtyDaysAgo = new Date();
                  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                  return lastOrder > thirtyDaysAgo;
                }).length}
              </p>
              <p className="text-sm text-muted-foreground font-elegant">Active (30 days)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customers Grid */}
      {filteredCustomers.length === 0 ? (
        <div className="bg-card p-12 rounded-xl border border-border text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
            No customers found
          </h3>
          <p className="text-muted-foreground font-body">
            {searchTerm ? "Try a different search term" : "Customers will appear here when they submit quote requests"}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((customer, index) => (
            <motion.div
              key={customer.email}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card p-5 rounded-xl border border-border hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="font-display text-lg font-bold text-primary">
                    {(customer.name || customer.email)[0].toUpperCase()}
                  </span>
                </div>
                <Badge variant="secondary" className="font-elegant">
                  {customer.totalOrders} order{customer.totalOrders !== 1 ? "s" : ""}
                </Badge>
              </div>

              <h3 className="font-display font-semibold text-foreground mb-1">
                {customer.name || "Guest Customer"}
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span className="font-body truncate">{customer.email}</span>
                </div>
                {customer.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span className="font-body">{customer.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span className="font-body">
                    Last order: {new Date(customer.lastOrder).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
