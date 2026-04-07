import React, { useState, useEffect, useContext } from "react";
import "./Orders.css";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, RefreshCcw, Package, MapPin, Phone, User, ChevronDown } from "lucide-react";

const STATUS_COLORS = {
  "Food Processing": { color: "#29b6f6", bg: "rgba(41, 182, 246, 0.1)" },
  "Out for delivery": { color: "#ffc107", bg: "rgba(255, 193, 7, 0.1)" },
  "Delivered": { color: "#00e676", bg: "rgba(0, 230, 118, 0.1)" },
};

const Orders = ({ url }) => {
  const navigate = useNavigate();
  const { token, admin } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchAllOrder = async () => {
    setLoading(true);
    try {
      const response = await axios.get(url + "/api/order/list", { headers: { token } });
      if (response.data.success) {
        setOrders(response.data.data.reverse());
      }
    } catch {
      toast.error("Failed to fetch orders");
    }
    setLoading(false);
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        url + "/api/order/status",
        { orderId, status: event.target.value },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Order status updated");
        await fetchAllOrder();
      } else {
        toast.error(response.data.message);
      }
    } catch {
      toast.error("Update failed");
    }
  };

  useEffect(() => {
    if (!admin && !token) { toast.error("Please Login First"); navigate("/"); return; }
    fetchAllOrder();
  }, []);

  useEffect(() => {
    let result = orders;
    if (statusFilter !== "All") result = result.filter(o => o.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(o =>
        `${o.address?.firstName} ${o.address?.lastName}`.toLowerCase().includes(q) ||
        o.address?.phone?.includes(q)
      );
    }
    setFiltered(result);
  }, [orders, search, statusFilter]);

  const totalRevenue = filtered.reduce((s, o) => s + (o.amount || 0), 0);

  return (
    <motion.div 
      className="orders-page"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="page-header">
        <div>
          <h1>Customer Orders</h1>
          <p>{filtered.length} pending shipments · ₹{totalRevenue.toLocaleString("en-IN")} total</p>
        </div>
        <button className="btn-secondary" onClick={fetchAllOrder}>
          <RefreshCcw size={16} className={loading ? "spin-icon" : ""} />
          Sync
        </button>
      </div>

      {/* Stats Row */}
      <div className="orders-stats">
        {["Food Processing", "Out for delivery", "Delivered"].map((s) => {
          const count = orders.filter(o => o.status === s).length;
          const c = STATUS_COLORS[s];
          return (
            <div key={s} className="order-stat-pill" style={{ borderColor: c.color + "40", background: c.bg }}>
              <span className="order-stat-dot" style={{ background: c.color }}></span>
              <span className="order-stat-label" style={{ color: c.color }}>{s}</span>
              <span className="order-stat-count" style={{ color: c.color }}>{count}</span>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="orders-filters glass-card">
        <div className="search-bar">
          <Search size={18} />
          <input
            placeholder="Find by customer or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && <button className="clear-search" onClick={() => setSearch("")}>✕</button>}
        </div>
        <div className="status-pills">
          {["All", "Food Processing", "Out for delivery", "Delivered"].map((s) => (
            <button
              key={s}
              className={`cat-pill ${statusFilter === s ? "active" : ""}`}
              onClick={() => setStatusFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="orders-list-container">
        {loading ? (
          <div className="empty-state">
            <RefreshCcw size={40} className="spin-icon" />
            <p>Loading your orders...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Package size={60} strokeWidth={1} />
            <h3>No orders found</h3>
            <p>Once customers place orders, they'll appear here for processing.</p>
          </div>
        ) : (
          <div className="orders-cards">
            {filtered.map((order, index) => {
              const sc = STATUS_COLORS[order.status] || STATUS_COLORS["Food Processing"];
              return (
                <motion.div 
                  key={index} 
                  className="order-card glass-card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="order-card-header">
                    <div className="order-card-user">
                      <div className="order-user-avatar" style={{ background: sc.bg, color: sc.color, borderColor: sc.color + "40" }}>
                        <User size={18} />
                      </div>
                      <div>
                        <p className="order-customer-name">
                          {order.address?.firstName} {order.address?.lastName}
                        </p>
                        <p className="order-customer-phone"><Phone size={11} style={{marginRight:4}}/> {order.address?.phone}</p>
                      </div>
                    </div>
                    <div className="order-card-right">
                      <span className="order-total">₹{order.amount}</span>
                      <span className="badge" style={{ background: sc.bg, color: sc.color }}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="order-card-body">
                    <div className="order-items-list">
                      {order.items.map((item, i) => (
                        <div key={i} className="order-item-chip">
                          <span className="item-qty">{item.quantity}×</span> {item.name}
                        </div>
                      ))}
                    </div>
                    <p className="order-address">
                      <MapPin size={12} style={{marginRight:6, color:"var(--primary)"}} /> 
                      {order.address?.street}, {order.address?.city}, {order.address?.state} - {order.address?.zipcode}
                    </p>
                  </div>

                  <div className="order-card-footer">
                    <div className="order-meta-info">
                      <span className="order-count">{order.items.length} item{order.items.length > 1 ? "s" : ""} in package</span>
                    </div>
                    <div className="order-status-select-wrap">
                      <ChevronDown size={14} className="select-chevron" />
                      <select
                        className="order-status-select"
                        onChange={(e) => statusHandler(e, order._id)}
                        value={order.status}
                        style={{ borderLeftColor: sc.color, color: sc.color }}
                      >
                        <option value="Food Processing">Food Processing</option>
                        <option value="Out for delivery">Out for delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Orders;
