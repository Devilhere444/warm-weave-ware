import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, DollarSign, Eye, Package, Bell, Pencil, Check, X, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { format, subDays, startOfDay, eachDayOfInterval } from "date-fns";
interface StatConfig {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: any;
}

interface QuoteRequest {
  id: string;
  email: string;
  name: string | null;
  status: string;
  created_at: string;
}

const defaultStats: StatConfig[] = [
  {
    id: "revenue",
    title: "Total Revenue",
    value: "₹12,45,000",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
  },
  {
    id: "orders",
    title: "Total Orders",
    value: "0",
    change: "+0%",
    trend: "up",
    icon: Package,
  },
  {
    id: "products",
    title: "Active Products",
    value: "0",
    change: "+0",
    trend: "up",
    icon: Package,
  },
  {
    id: "views",
    title: "Page Views",
    value: "12,456",
    change: "-2.4%",
    trend: "down",
    icon: Eye,
  },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
  quoted: { label: "Quoted", color: "bg-blue-100 text-blue-700" },
  approved: { label: "Approved", color: "bg-green-100 text-green-700" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700" },
  completed: { label: "Completed", color: "bg-primary/20 text-primary" },
};

const CHART_COLORS = ["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatConfig[]>(defaultStats);
  const [recentOrders, setRecentOrders] = useState<QuoteRequest[]>([]);
  const [allOrders, setAllOrders] = useState<QuoteRequest[]>([]);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [editingStatId, setEditingStatId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchDashboardData();
    
    // Set up realtime subscription for new orders
    const channel = supabase
      .channel('admin-dashboard-orders')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'quote_requests'
        },
        (payload) => {
          console.log('New order received:', payload);
          const newOrder = payload.new as QuoteRequest;
          setRecentOrders((prev) => [newOrder, ...prev.slice(0, 4)]);
          setNewOrdersCount((prev) => prev + 1);
          
          // Update order count in stats
          setStats((prev) => prev.map((stat) => 
            stat.id === 'orders' 
              ? { ...stat, value: String(parseInt(stat.value) + 1) }
              : stat
          ));
          
          toast.success(`New order from ${newOrder.name || newOrder.email}!`, {
            description: 'A new quote request has been received.',
            icon: <Bell className="w-4 h-4" />,
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'quote_requests'
        },
        (payload) => {
          const updatedOrder = payload.new as QuoteRequest;
          setRecentOrders((prev) => 
            prev.map((order) => order.id === updatedOrder.id ? updatedOrder : order)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all orders for charts
      const { data: orders, error: ordersError } = await supabase
        .from("quote_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;
      setAllOrders(orders || []);
      setRecentOrders((orders || []).slice(0, 5));

      // Fetch products count
      const { count: productsCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      // Update stats with real data
      setStats((prev) => prev.map((stat) => {
        if (stat.id === 'orders') {
          return { ...stat, value: String(orders?.length || 0) };
        }
        if (stat.id === 'products') {
          return { ...stat, value: String(productsCount || 0) };
        }
        return stat;
      }));

      // Load saved stats from localStorage
      const savedStats = localStorage.getItem("dashboardStats");
      if (savedStats) {
        const parsed = JSON.parse(savedStats);
        setStats((prev) => prev.map((stat) => {
          const saved = parsed.find((s: StatConfig) => s.id === stat.id);
          if (saved && (stat.id === 'revenue' || stat.id === 'views')) {
            return { ...stat, value: saved.value, change: saved.change };
          }
          return stat;
        }));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Generate order trends data for the last 7 days
  const orderTrendsData = useMemo(() => {
    const last7Days = eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date(),
    });

    return last7Days.map((day) => {
      const dayStart = startOfDay(day);
      const dayOrders = allOrders.filter((order) => {
        const orderDate = startOfDay(new Date(order.created_at));
        return orderDate.getTime() === dayStart.getTime();
      });

      return {
        date: format(day, "MMM dd"),
        orders: dayOrders.length,
        // Simulated revenue based on orders (can be replaced with real data)
        revenue: dayOrders.length * 15000 + Math.floor(Math.random() * 10000),
      };
    });
  }, [allOrders]);

  // Generate status distribution data
  const statusDistributionData = useMemo(() => {
    const statusCounts: Record<string, number> = {};
    allOrders.forEach((order) => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: statusConfig[status]?.label || status,
      value: count,
      status,
    }));
  }, [allOrders]);

  // Monthly comparison data
  const monthlyData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month) => ({
      month,
      orders: Math.floor(Math.random() * 50) + 10,
      revenue: Math.floor(Math.random() * 500000) + 100000,
    }));
  }, []);

  const handleEditStat = (stat: StatConfig) => {
    setEditingStatId(stat.id);
    setEditValue(stat.value);
  };

  const handleSaveStat = (statId: string) => {
    setStats((prev) => {
      const updated = prev.map((stat) => 
        stat.id === statId ? { ...stat, value: editValue } : stat
      );
      // Save to localStorage
      localStorage.setItem("dashboardStats", JSON.stringify(updated));
      return updated;
    });
    setEditingStatId(null);
    toast.success("Stat updated successfully");
  };

  const handleCancelEdit = () => {
    setEditingStatId(null);
    setEditValue("");
  };

  const clearNewOrdersNotification = () => {
    setNewOrdersCount(0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* New Orders Notification */}
      {newOrdersCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-display font-semibold text-foreground">
                {newOrdersCount} New Order{newOrdersCount > 1 ? 's' : ''}!
              </p>
              <p className="text-sm text-muted-foreground">
                New quote requests have been received
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={clearNewOrdersNotification}>
            Dismiss
          </Button>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card p-6 rounded-xl border border-border group relative"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1 text-sm font-elegant ${
                    stat.trend === "up" ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <ArrowUp className="w-4 h-4" />
                  ) : (
                    <ArrowDown className="w-4 h-4" />
                  )}
                  {stat.change}
                </div>
                {(stat.id === 'revenue' || stat.id === 'views') && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleEditStat(stat)}
                  >
                    <Pencil className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
            
            {editingStatId === stat.id ? (
              <div className="flex items-center gap-2">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="h-8 text-lg font-bold"
                  autoFocus
                />
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleSaveStat(stat.id)}>
                  <Check className="w-4 h-4 text-green-600" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCancelEdit}>
                  <X className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ) : (
              <h3 className="font-display text-2xl font-bold text-foreground">
                {stat.value}
              </h3>
            )}
            <p className="text-muted-foreground font-elegant text-sm mt-1">
              {stat.title}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Order Trends Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground">Order Trends</h3>
              <p className="text-sm text-muted-foreground">Last 7 days</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="font-elegant">+12.5%</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={orderTrendsData}>
                <defs>
                  <linearGradient id="orderGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#orderGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground">Revenue Overview</h3>
              <p className="text-sm text-muted-foreground">Monthly comparison</p>
            </div>
            <Badge variant="secondary" className="font-elegant">₹</Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, "Revenue"]}
                />
                <Bar 
                  dataKey="revenue" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <div className="mb-6">
            <h3 className="font-display text-lg font-semibold text-foreground">Order Status</h3>
            <p className="text-sm text-muted-foreground">Distribution by status</p>
          </div>
          <div className="h-64">
            {statusDistributionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No orders to display
              </div>
            )}
          </div>
        </motion.div>

        {/* Daily Revenue Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground">Daily Revenue</h3>
              <p className="text-sm text-muted-foreground">Last 7 days</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={orderTrendsData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, "Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card rounded-xl border border-border overflow-hidden"
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-foreground">
            Recent Orders
          </h2>
          <Badge variant="secondary" className="font-elegant">
            Live Updates
          </Badge>
        </div>
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
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No orders yet
                  </td>
                </tr>
              ) : (
                recentOrders.map((order, index) => {
                  const status = statusConfig[order.status] || statusConfig.pending;
                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border last:border-0"
                    >
                      <td className="p-4 font-body text-foreground font-mono text-sm">
                        {order.id.slice(0, 8)}...
                      </td>
                      <td className="p-4 font-body text-foreground">{order.name || "N/A"}</td>
                      <td className="p-4 font-body text-muted-foreground">{order.email}</td>
                      <td className="p-4 font-body text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-elegant ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
