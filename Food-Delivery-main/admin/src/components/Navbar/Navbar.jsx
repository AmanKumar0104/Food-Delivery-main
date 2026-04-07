import React, { useContext, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Bell, 
  Settings, 
  LogOut, 
  LayoutDashboard, 
  Menu, 
  X, 
  ChevronDown,
  User,
  History
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { token, admin, setAdmin, setToken, isSidebarOpen, setIsSidebarOpen } = useContext(StoreContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    setToken("");
    setAdmin(false);
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <header className="admin-navbar">
      <div className="navbar-left">
        <button
          className="sidebar-toggle"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          title="Toggle Sidebar"
        >
          {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <div className="navbar-brand" onClick={() => navigate(token && admin ? "/dashboard" : "/")}>
          <div className="brand-icon">🛡️</div>
          <div className="brand-text">
            <span className="brand-name">Admin</span>
            <span className="brand-tag">TOMATO SYSTEM</span>
          </div>
        </div>
      </div>

      <div className="navbar-center" aria-label="search">
        <div className="navbar-search">
          <Search size={16} />
          <input type="text" placeholder="Search resources..." />
          <kbd>⌘ K</kbd>
        </div>
      </div>

      <div className="navbar-right">
        {token && admin && (
          <>
            <button className="nav-icon-btn" title="Recent Activity" onClick={() => navigate("/orders")}>
              <History size={18} />
            </button>
            <button className="nav-icon-btn" title="Notifications">
              <Bell size={18} />
              <span className="nav-badge">5</span>
            </button>
            <button className="nav-icon-btn" title="Global Settings" onClick={() => navigate("/list")}>
              <Settings size={18} />
            </button>
            <div className="divider-v"></div>
          </>
        )}

        <div 
          className={`navbar-profile ${menuOpen ? "active" : ""}`} 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="profile-avatar">
            <User size={18} />
          </div>
          <div className="profile-info">
            <span className="profile-name">Super Admin</span>
            <span className="profile-role">Connected</span>
          </div>
          <ChevronDown size={14} className={`profile-chevron ${menuOpen ? "open" : ""}`} />
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              className="profile-dropdown"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              onMouseLeave={() => setMenuOpen(false)}
            >
              <div className="dropdown-header">
                <p className="dropdown-user-email">admin@tomato.com</p>
              </div>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item" onClick={() => { navigate("/dashboard"); setMenuOpen(false); }}>
                <LayoutDashboard size={16} />
                Control Center
              </button>
              <button className="dropdown-item" onClick={() => { navigate("/list"); setMenuOpen(false); }}>
                <Settings size={16} />
                Manage Menu
              </button>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item danger" onClick={() => { logout(); setMenuOpen(false); }}>
                <LogOut size={16} />
                Sign Out
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;
