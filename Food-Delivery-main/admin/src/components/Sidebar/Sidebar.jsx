import React, { useContext, useState } from "react";
import "./Sidebar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  PlusCircle, 
  List as ListIcon, 
  ShoppingCart, 
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Zap
} from "lucide-react";

const navItems = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    to: "/add",
    label: "Add Food",
    icon: <PlusCircle size={20} />,
  },
  {
    to: "/list",
    label: "Food Items",
    icon: <ListIcon size={20} />,
  },
  {
    to: "/orders",
    label: "Orders",
    icon: <ShoppingCart size={20} />,
    badge: "New",
  },
  {
    to: "/messages",
    label: "Messages",
    icon: <MessageSquare size={20} />,
  },
];

const Sidebar = () => {
  const { token, admin, isSidebarOpen, setIsSidebarOpen } = useContext(StoreContext);
  const navigate = useNavigate();

  if (!token || !admin) return null;

  return (
    <>
      <motion.aside 
        className={`admin-sidebar ${!isSidebarOpen ? "collapsed" : "mobile-open"}`}
        animate={{ width: isSidebarOpen ? "var(--sidebar-width)" : "var(--sidebar-collapsed)" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <button className="sidebar-collapse-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {!isSidebarOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        <div className="sidebar-section-label">
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                NAVIGATION
              </motion.span>
            )}
          </AnimatePresence>
        </div>


        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
              title={!isSidebarOpen ? item.label : ""}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.span 
                    className="sidebar-label"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {isSidebarOpen && item.badge && (
                <span className="sidebar-badge">{item.badge}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {isSidebarOpen && (
          <motion.div 
            className="sidebar-bottom"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="sidebar-promo">
              <div className="promo-icon"><Zap size={20} fill="var(--warning)" color="var(--warning)" /></div>
              <div>
                <p className="promo-title">Fast Mode</p>
                <p className="promo-text">Server Status: Online</p>
              </div>
              <div className="promo-dot"></div>
            </div>
          </motion.div>
        )}
      </motion.aside>
      <div className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`} onClick={() => setIsSidebarOpen(false)} />
    </>
  );
};

export default Sidebar;
