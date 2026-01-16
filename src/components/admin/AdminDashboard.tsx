import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  ArrowDown, ArrowUp, DollarSign, Eye, Package, Bell, Pencil, Check, X, 
  TrendingUp, Users, Clock, Globe, Activity, Calendar, FileText, RefreshCw
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useLiveVisitors } from "@/hooks/useLiveVisitors";
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
  LineChart,
  Line,
} from "recharts";
import { format, subDays, startOfDay, eachDayOfInterval, subHours, startOfHour } from "date-fns";

interface StatConfig {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: any;
  isLive?: boolean;
}

interface QuoteRequest {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  status: string;
  created_at: string;
  notes: string | null;
}

interface PageView {
  id: string;
  page_path: string;
  visitor_id: string;
  session_id: string;
  created_at: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
  quoted: { label: "Quoted", color: "bg-blue-100 text-blue-700" },
  approved: { label: "Approved", color: "bg-green-100 text-green-700" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700" },
  completed: { label: "Completed", color: "bg-primary/20 text-primary" },
};

const CHART_COLORS = ["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export default function AdminDashboard() {
  const [recentOrders, setRecentOrders] = useState<QuoteRequest[]>([]);
  const [allOrders, setAllOrders] = useState<QuoteRequest[]>([]);
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [editingStatId, setEditingStatId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [productsCount, setProductsCount] = useState(0);
  const [uniqueVisitors, setUniqueVisitors] = useState(0);
  const [todayViews, setTodayViews] = useState(0);
  const [customRevenue, setCustomRevenue] = useState("₹12,45,000");
  
  const { liveVisitors, liveCount, isConnected } = useLiveVisitors();

  useEffect(() => {
    fetchDashboardData();
    
    // Set up realtime subscription for new orders
    const ordersChannel = supabase
      .channel('admin-dashboard-orders')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'quote_requests'
        },
        (payload) => {
          const newOrder = payload.new as QuoteRequest;
          setRecentOrders((prev) => [newOrder, ...prev.slice(0, 9)]);
          setAllOrders((prev) => [newOrder, ...prev]);
          setNewOrdersCount((prev) => prev + 1);
          
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
          setAllOrders((prev) =>
            prev.map((order) => order.id === updatedOrder.id ? updatedOrder : order)
          );
        }
      )
      .subscribe();

    // Set up realtime subscription for page views
    const viewsChannel = supabase
      .channel('admin-page-views')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'page_views'
        },
        (payload) => {
          const newView = payload.new as PageView;
          setPageViews((prev) => [newView, ...prev.slice(0, 999)]);
          setTodayViews((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(viewsChannel);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all orders
      const { data: orders, error: ordersError } = await supabase
        .from("quote_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;
      setAllOrders(orders || []);
      setRecentOrders((orders || []).slice(0, 10));

      // Fetch products count
      const { count: prodCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });
      setProductsCount(prodCount || 0);

      // Fetch page views (last 7 days)
      const sevenDaysAgo = subDays(new Date(), 7).toISOString();
      const { data: views, error: viewsError } = await supabase
        .from("page_views")
        .select("*")
        .gte("created_at", sevenDaysAgo)
        .order("created_at", { ascending: false })
        .limit(1000);

      if (!viewsError && views) {
        setPageViews(views);
        
        // Calculate unique visitors
        const uniqueIds = new Set(views.map(v => v.visitor_id));
        setUniqueVisitors(uniqueIds.size);
        
        // Calculate today's views
        const todayStart = startOfDay(new Date()).toISOString();
        const todayPageViews = views.filter(v => v.created_at >= todayStart);
        setTodayViews(todayPageViews.length);
      }

      // Load saved revenue from localStorage
      const savedRevenue = localStorage.getItem("dashboardRevenue");
      if (savedRevenue) {
        setCustomRevenue(savedRevenue);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
    toast.success("Dashboard refreshed");
  };

  // Stats configuration
  const stats: StatConfig[] = useMemo(() => [
    {
      id: "revenue",
      title: "Total Revenue",
      value: customRevenue,
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
    },
    {
      id: "orders",
      title: "Total Orders",
      value: String(allOrders.length),
      change: allOrders.length > 0 ? `+${allOrders.length}` : "0",
      trend: "up",
      icon: Package,
    },
    {
      id: "products",
      title: "Active Products",
      value: String(productsCount),
      change: `${productsCount} items`,
      trend: "up",
      icon: FileText,
    },
    {
      id: "views",
      title: "Page Views (7d)",
      value: pageViews.length.toLocaleString(),
      change: `${todayViews} today`,
      trend: todayViews > 0 ? "up" : "down",
      icon: Eye,
    },
    {
      id: "visitors",
      title: "Unique Visitors",
      value: uniqueVisitors.toLocaleString(),
      change: "Last 7 days",
      trend: "up",
      icon: Users,
    },
    {
      id: "live",
      title: "Live Visitors",
      value: String(liveCount),
      change: isConnected ? "Connected" : "Connecting...",
      trend: "up",
      icon: Activity,
      isLive: true,
    },
  ], [customRevenue, allOrders.length, productsCount, pageViews.length, todayViews, uniqueVisitors, liveCount, isConnected]);

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

      const dayViews = pageViews.filter((view) => {
        const viewDate = startOfDay(new Date(view.created_at));
        return viewDate.getTime() === dayStart.getTime();
      });

      return {
        date: format(day, "MMM dd"),
        orders: dayOrders.length,
        views: dayViews.length,
        revenue: dayOrders.length * 15000 + Math.floor(Math.random() * 10000),
      };
    });
  }, [allOrders, pageViews]);

  // Generate hourly views data for the last 24 hours
  const hourlyViewsData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => {
      const hour = subHours(new Date(), 23 - i);
      return startOfHour(hour);
    });

    return hours.map((hour) => {
      const hourEnd = new Date(hour.getTime() + 60 * 60 * 1000);
      const hourViews = pageViews.filter((view) => {
        const viewTime = new Date(view.created_at);
        return viewTime >= hour && viewTime < hourEnd;
      });

      return {
        hour: format(hour, "HH:mm"),
        views: hourViews.length,
      };
    });
  }, [pageViews]);

  // Top pages data
  const topPagesData = useMemo(() => {
    const pageCounts: Record<string, number> = {};
    pageViews.forEach((view) => {
      pageCounts[view.page_path] = (pageCounts[view.page_path] || 0) + 1;
    });

    return Object.entries(pageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([path, count]) => ({
        path: path === "/" ? "Home" : path.replace("/", "").charAt(0).toUpperCase() + path.slice(2),
        views: count,
      }));
  }, [pageViews]);

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

  const handleEditStat = (statId: string, currentValue: string) => {
    setEditingStatId(statId);
    setEditValue(currentValue);
  };

  const handleSaveStat = (statId: string) => {
    if (statId === 'revenue') {
      setCustomRevenue(editValue);
      localStorage.setItem("dashboardRevenue", editValue);
    }
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
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Real-time analytics and insights</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={refreshing}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

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

      {/* Stats Grid - 6 cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-card p-5 rounded-xl border border-border group relative ${
              stat.isLive ? 'ring-2 ring-green-500/20' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                stat.isLive ? 'bg-green-500/10' : 'bg-primary/10'
              }`}>
                <stat.icon className={`w-5 h-5 ${stat.isLive ? 'text-green-500' : 'text-primary'}`} />
              </div>
              {stat.isLive && (
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
              )}
              {stat.id === 'revenue' && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleEditStat(stat.id, stat.value)}
                >
                  <Pencil className="w-3 h-3" />
                </Button>
              )}
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
              <h3 className="font-display text-xl font-bold text-foreground">
                {stat.value}
              </h3>
            )}
            <p className="text-muted-foreground font-elegant text-xs mt-1">
              {stat.title}
            </p>
            <div className={`flex items-center gap-1 text-xs font-elegant mt-2 ${
              stat.trend === "up" ? "text-green-600" : "text-muted-foreground"
            }`}>
              {stat.trend === "up" && <ArrowUp className="w-3 h-3" />}
              {stat.change}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Live Visitors Panel */}
      {liveCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <Activity className="w-5 h-5 text-green-500" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground">
              {liveCount} Active Visitor{liveCount > 1 ? 's' : ''} Right Now
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {liveVisitors.map((visitor, index) => (
              <Badge key={index} variant="secondary" className="font-elegant">
                <Globe className="w-3 h-3 mr-1" />
                {visitor.pagePath === "/" ? "Home" : visitor.pagePath}
              </Badge>
            ))}
          </div>
        </motion.div>
      )}

      {/* Analytics Charts - 2x2 Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Order & Views Trends Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground">Orders & Views</h3>
              <p className="text-sm text-muted-foreground">Last 7 days trend</p>
            </div>
            <Badge variant="secondary" className="font-elegant">Live</Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={orderTrendsData}>
                <defs>
                  <linearGradient id="orderGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
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
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="orders"
                  name="Orders"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#orderGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  name="Page Views"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  fill="url(#viewsGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Hourly Views Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground">Hourly Traffic</h3>
              <p className="text-sm text-muted-foreground">Last 24 hours</p>
            </div>
            <Clock className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyViewsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="hour" 
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  interval={2}
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
                <Line
                  type="monotone"
                  dataKey="views"
                  name="Views"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Pages Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <div className="mb-6">
            <h3 className="font-display text-lg font-semibold text-foreground">Top Pages</h3>
            <p className="text-sm text-muted-foreground">Most visited pages</p>
          </div>
          <div className="h-64">
            {topPagesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topPagesData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    type="number"
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <YAxis 
                    type="category"
                    dataKey="path"
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar 
                    dataKey="views" 
                    fill="hsl(var(--primary))" 
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No page views recorded yet
              </div>
            )}
          </div>
        </motion.div>

        {/* Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
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
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-card rounded-xl border border-border overflow-hidden"
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-foreground">
            Recent Orders
          </h2>
          <Badge variant="secondary" className="font-elegant gap-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
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
                  Phone
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
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
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
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      <td className="p-4 font-body text-foreground font-mono text-sm">
                        {order.id.slice(0, 8)}...
                      </td>
                      <td className="p-4 font-body text-foreground">{order.name || "N/A"}</td>
                      <td className="p-4 font-body text-muted-foreground text-sm">{order.email}</td>
                      <td className="p-4 font-body text-muted-foreground text-sm">{order.phone || "N/A"}</td>
                      <td className="p-4 font-body text-muted-foreground text-sm">
                        {format(new Date(order.created_at), "MMM dd, HH:mm")}
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
