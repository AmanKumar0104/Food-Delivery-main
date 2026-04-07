import React, { useEffect, useState, useContext } from "react";
import "./Dashboard.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { 
  Users, 
  ShoppingBag, 
  MessageSquare, 
  IndianRupee, 
  TrendingUp, 
  TrendingDown, 
  RefreshCcw, 
  ArrowRight,
  LayoutDashboard,
  Plus,
  List,
  Package
} from "lucide-react";

const StatCard = ({ icon, label, value, color, trend, trendUp, index }) => (
  <motion.div 
    className="stat-card"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -5, boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}
  >
    <div className="stat-icon" style={{ background: `${color}18`, border: `1px solid ${color}30`, color: color }}>
      {icon}
    </div>
    <div className="stat-info">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {trend && (
        <div className="stat-trend" style={{ color: trendUp ? "var(--success)" : "var(--danger)" }}>
          {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {trend}
        </div>
      )}
    </div>
  </motion.div>
);

const Dashboard = ({ url }) => {
  const navigate = useNavigate();
  const { token, admin } = useContext(StoreContext);
  const [stats, setStats] = useState({ foods: 0, orders: 0, messages: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    if (!admin && !token && !localStorage.getItem("token")) {
      toast.error("Please login first");
      navigate("/");
      return;
    }
    fetchDashboardData();
  }, [token, admin]);


  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [foodRes, orderRes, msgRes] = await Promise.all([
        axios.get(`${url}/api/food/list`),
        axios.get(`${url}/api/order/list`, { headers: { token } }),
        axios.get(`${url}/api/contact/list`),
      ]);

      const foods = foodRes.data.success ? foodRes.data.data : [];
      const orders = orderRes.data.success ? orderRes.data.data : [];
      const messages = msgRes.data.success ? msgRes.data.data : [];

      const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);

      // Category breakdown
      const catMap = {};
      foods.forEach((f) => {
        catMap[f.category] = (catMap[f.category] || 0) + 1;
      });
      const catArr = Object.entries(catMap)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);

      setCategoryData(catArr);
      setStats({ foods: foods.length, orders: orders.length, messages: messages.length, revenue: totalRevenue });
      setRecentOrders(orders.slice(0, 5));
      setRecentMessages(messages.slice(0, 4));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status) => {
    if (status === "Delivered") return "var(--success)";
    if (status === "Out for delivery") return "var(--warning)";
    return "var(--info)";
  };

  const statusBg = (status) => {
    if (status === "Delivered") return "var(--success-bg)";
    if (status === "Out for delivery") return "var(--warning-bg)";
    return "var(--info-bg)";
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 11-6.219-8.56" className="spin-path"/>
          </svg>
        </div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p>Welcome back! Here's what's happening today.</p>
        </div>
        <button className="btn-secondary" onClick={fetchDashboardData} style={{ gap: "10px" }}>
          <RefreshCcw size={16} className={loading ? "spin-icon" : ""} />
          Refresh Data
        </button>
      </div>
      
      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard index={0} icon={<ShoppingBag size={24} />} label="Menu Items" value={stats.foods} color="#ff5722" trend="+3 new" trendUp={true} />
        <StatCard index={1} icon={<ShoppingBag size={24} />} label="Total Orders" value={stats.orders} color="#29b6f6" trend="+8% vs avg" trendUp={true} />
        <StatCard index={2} icon={<MessageSquare size={24} />} label="Inquiries" value={stats.messages} color="#9c27b0" trend={stats.messages > 0 ? "Pending" : "All read"} trendUp={stats.messages === 0} />
        <StatCard index={3} icon={<IndianRupee size={24} />} label="Total Revenue" value={`₹${stats.revenue.toLocaleString("en-IN")}`} color="#00e676" trend="+15% growth" trendUp={true} />
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Recent Orders */}
        <div className="glass-card dash-section">
          <div className="section-header">
            <div>
              <h3>Recent orders</h3>
              <p>Top {recentOrders.length} recent transactions</p>
            </div>
            <button className="btn-secondary" onClick={() => navigate("/orders")}>
              All Orders <ArrowRight size={14} style={{ marginLeft: "4px" }} />
            </button>
          </div>
          {recentOrders.length === 0 ? (
            <div className="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/></svg>
              <h3>No orders yet</h3>
              <p>Orders will appear here</p>
            </div>
          ) : (
            <div className="orders-list">
              {recentOrders.map((order, i) => (
                <div key={i} className="order-row">
                  <div className="order-user">
                    <div className="order-avatar">
                      {(order.address?.firstName || "U")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="order-name">
                        {order.address?.firstName} {order.address?.lastName}
                      </p>
                      <p className="order-items-count">{order.items.length} items</p>
                    </div>
                  </div>
                  <div className="order-meta">
                    <span className="order-amount">₹{order.amount}</span>
                    <span
                      className="badge"
                      style={{ background: statusBg(order.status), color: statusColor(order.status) }}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="glass-card dash-section">
          <div className="section-header">
            <div>
              <h3>Food Categories</h3>
              <p>Items per category</p>
            </div>
            <button className="btn-secondary" onClick={() => navigate("/list")}>
              Manage <ArrowRight size={14} style={{ marginLeft: "4px" }} />
            </button>
          </div>
          <div className="category-list">
            {categoryData.length === 0 ? (
              <div className="empty-state">
                <LayoutDashboard size={48} strokeWidth={1} />
                <h3>No categories yet</h3>
              </div>
            ) : (
              categoryData.map((cat, i) => {
                const max = categoryData[0]?.count || 1;
                const pct = Math.round((cat.count / max) * 100);
                const colors = ["#ff5722","#29b6f6","#00e676","#ffc107","#9c27b0","#ff4081"];
                const color = colors[i % colors.length];
                return (
                  <div key={i} className="cat-item">
                    <div className="cat-info">
                      <span className="cat-dot" style={{ background: color }}></span>
                      <span className="cat-name">{cat.name}</span>
                      <span className="cat-count">{cat.count} items</span>
                    </div>
                    <div className="cat-bar-bg">
                      <div
                        className="cat-bar-fill"
                        style={{ width: `${pct}%`, background: color }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="glass-card dash-section">
          <div className="section-header">
            <div>
              <h3>Recent Messages</h3>
              <p>Customer inquiries</p>
            </div>
            <button className="btn-secondary" onClick={() => navigate("/messages")}>
              Inbox <MessageSquare size={14} style={{ marginLeft: "4px" }} />
            </button>
          </div>
          {recentMessages.length === 0 ? (
            <div className="empty-state">
              <MessageSquare size={48} strokeWidth={1} />
              <h3>No messages yet</h3>
            </div>
          ) : (
            <div className="messages-preview">
              {recentMessages.map((msg, i) => (
                <div key={i} className="msg-row">
                  <div className="msg-avatar">
                    {msg.name[0].toUpperCase()}
                  </div>
                  <div className="msg-info">
                    <div className="msg-header">
                      <span className="msg-name">{msg.name}</span>
                      <span className="msg-date">
                        {new Date(msg.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                    <p className="msg-preview">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="glass-card dash-section quick-actions-card">
          <div className="section-header">
            <div>
              <h3>Quick Actions</h3>
              <p>Management shortcuts</p>
            </div>
          </div>
          <div className="quick-actions">
            <button className="quick-action-btn" onClick={() => navigate("/add")}>
              <span className="qa-icon" style={{ color: "var(--primary)" }}><Plus /></span>
              <span>Add Food</span>
            </button>
            <button className="quick-action-btn" onClick={() => navigate("/list")}>
              <span className="qa-icon" style={{ color: "var(--info)" }}><List /></span>
              <span>All Items</span>
            </button>
            <button className="quick-action-btn" onClick={() => navigate("/orders")}>
              <span className="qa-icon" style={{ color: "var(--success)" }}><Package /></span>
              <span>Orders</span>
            </button>
            <button className="quick-action-btn" onClick={() => navigate("/messages")}>
              <span className="qa-icon" style={{ color: "var(--warning)" }}><MessageSquare /></span>
              <span>Messages</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
