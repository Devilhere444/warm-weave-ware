import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, Mail, Clock, CheckCircle, XCircle, AlertCircle, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface QuoteItem {
  id: string;
  product_id: string;
  product_title: string;
  quantity: number;
  finish_option: string | null;
  paper_option: string | null;
  binding_option: string | null;
  special_requirements: string | null;
}

interface QuoteRequest {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  notes: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  items?: QuoteItem[];
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  quoted: { label: "Quoted", color: "bg-blue-100 text-blue-700", icon: Mail },
  approved: { label: "Approved", color: "bg-green-100 text-green-700", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700", icon: XCircle },
  completed: { label: "Completed", color: "bg-primary/20 text-primary", icon: CheckCircle },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<QuoteRequest | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("quote_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderItems = async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from("quote_request_items")
        .select("*")
        .eq("quote_request_id", orderId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching order items:", error);
      return [];
    }
  };

  const handleViewDetails = async (order: QuoteRequest) => {
    const items = await fetchOrderItems(order.id);
    setSelectedOrder({ ...order, items });
    setDetailsOpen(true);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("quote_requests")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => prev ? { ...prev, status: newStatus } : null);
      }

      toast.success(`Status updated to ${statusConfig[newStatus]?.label || newStatus}`);
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by email, name, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="quoted">Quoted</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left p-4 font-elegant text-sm text-muted-foreground font-medium">
                  Order ID
                </th>
                <th className="text-left p-4 font-elegant text-sm text-muted-foreground font-medium">
                  Customer
                </th>
                <th className="text-left p-4 font-elegant text-sm text-muted-foreground font-medium">
                  Email
                </th>
                <th className="text-left p-4 font-elegant text-sm text-muted-foreground font-medium">
                  Date
                </th>
                <th className="text-left p-4 font-elegant text-sm text-muted-foreground font-medium">
                  Status
                </th>
                <th className="text-left p-4 font-elegant text-sm text-muted-foreground font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground font-body">No orders found</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order, index) => {
                  const status = statusConfig[order.status] || statusConfig.pending;
                  const StatusIcon = status.icon;
                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                    >
                      <td className="p-4 font-body text-foreground font-mono text-sm">
                        {order.id.slice(0, 8)}...
                      </td>
                      <td className="p-4 font-body text-foreground">
                        {order.name || "N/A"}
                      </td>
                      <td className="p-4 font-body text-muted-foreground">
                        {order.email}
                      </td>
                      <td className="p-4 font-body text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <Badge className={`${status.color} gap-1`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(order)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Order Details
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid sm:grid-cols-2 gap-4 p-4 bg-secondary/30 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground font-elegant">Customer</p>
                  <p className="font-body font-medium">{selectedOrder.name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-elegant">Email</p>
                  <p className="font-body">{selectedOrder.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-elegant">Phone</p>
                  <p className="font-body">{selectedOrder.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-elegant">Date</p>
                  <p className="font-body">
                    {new Date(selectedOrder.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Status Update */}
              <div className="flex items-center gap-4">
                <span className="font-elegant text-sm text-muted-foreground">Status:</span>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(value) => handleStatusChange(selectedOrder.id, value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="quoted">Quoted</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-display font-semibold mb-3">Requested Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-card border border-border rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-body font-medium">{item.product_title}</h5>
                        <Badge variant="secondary">Qty: {item.quantity}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        {item.finish_option && (
                          <span className="px-2 py-1 bg-secondary rounded">
                            Finish: {item.finish_option}
                          </span>
                        )}
                        {item.paper_option && (
                          <span className="px-2 py-1 bg-secondary rounded">
                            Paper: {item.paper_option}
                          </span>
                        )}
                        {item.binding_option && (
                          <span className="px-2 py-1 bg-secondary rounded">
                            Binding: {item.binding_option}
                          </span>
                        )}
                      </div>
                      {item.special_requirements && (
                        <p className="mt-2 text-sm text-muted-foreground italic">
                          "{item.special_requirements}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <h4 className="font-display font-semibold mb-2">Additional Notes</h4>
                  <p className="text-muted-foreground font-body p-4 bg-secondary/30 rounded-lg">
                    {selectedOrder.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
