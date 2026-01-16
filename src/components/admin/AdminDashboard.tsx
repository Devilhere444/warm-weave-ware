import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, DollarSign, Eye, Package, Users } from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "₹12,45,000",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Total Orders",
    value: "234",
    change: "+8.2%",
    trend: "up",
    icon: Package,
  },
  {
    title: "Active Products",
    value: "45",
    change: "+3",
    trend: "up",
    icon: Package,
  },
  {
    title: "Page Views",
    value: "12,456",
    change: "-2.4%",
    trend: "down",
    icon: Eye,
  },
];

const recentOrders = [
  { id: "ORD-001", customer: "Rahul Sharma", product: "Wedding Cards (500)", amount: "₹25,000", status: "Completed" },
  { id: "ORD-002", customer: "Priya Industries", product: "Packaging Boxes", amount: "₹1,50,000", status: "In Progress" },
  { id: "ORD-003", customer: "ABC Publishers", product: "Book Printing", amount: "₹3,25,000", status: "Pending" },
  { id: "ORD-004", customer: "XYZ Corp", product: "Business Cards", amount: "₹8,500", status: "Completed" },
  { id: "ORD-005", customer: "Event Planners", product: "Event Invitations", amount: "₹45,000", status: "In Progress" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card p-6 rounded-xl border border-border"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
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
            </div>
            <h3 className="font-display text-2xl font-bold text-foreground">
              {stat.value}
            </h3>
            <p className="text-muted-foreground font-elegant text-sm mt-1">
              {stat.title}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card rounded-xl border border-border overflow-hidden"
      >
        <div className="p-6 border-b border-border">
          <h2 className="font-display text-xl font-semibold text-foreground">
            Recent Orders
          </h2>
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
                  Product
                </th>
                <th className="text-left p-4 font-elegant text-sm text-muted-foreground font-medium">
                  Amount
                </th>
                <th className="text-left p-4 font-elegant text-sm text-muted-foreground font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0">
                  <td className="p-4 font-body text-foreground">{order.id}</td>
                  <td className="p-4 font-body text-foreground">{order.customer}</td>
                  <td className="p-4 font-body text-muted-foreground">{order.product}</td>
                  <td className="p-4 font-body text-foreground font-medium">{order.amount}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-elegant ${
                        order.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : order.status === "In Progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
