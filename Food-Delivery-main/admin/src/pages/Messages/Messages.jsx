import React, { useEffect, useState, useContext } from "react";
import ReactDOMDOM from "react-dom";
import "./Messages.css";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Phone, 
  Trash2, 
  Eye, 
  RefreshCcw, 
  Search, 
  X, 
  MessageSquare, 
  Calendar, 
  Clock, 
  ChevronRight,
  User
} from "lucide-react";

const Messages = ({ url }) => {
  const [messages, setMessages] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/contact/list`);
      if (response.data.success) {
        setMessages(response.data.data);
      } else {
        toast.error("Error fetching messages");
      }
    } catch {
      toast.error("Error connecting to server");
    }
    setLoading(false);
  };

  const deleteMessage = async (id) => {
    try {
      const res = await axios.post(`${url}/api/contact/delete`, { id });
      if (res.data.success) {
        toast.success("Message deleted");
        if (selected?._id === id) setSelected(null);
        fetchMessages();
      } else {
        toast.error("Delete failed");
      }
    } catch {
      toast.error("Server error");
    }
    setDeleteConfirm(null);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    if (!search) { setFiltered(messages); return; }
    const q = search.toLowerCase();
    setFiltered(messages.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q)
    ));
  }, [messages, search]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit", minute: "2-digit",
    });
  };

  const avatarColors = ["#ff5722", "#29b6f6", "#00e676", "#ffc107", "#9c27b0", "#ff4081"];

  return (
    <motion.div 
      className="messages-page"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <AnimatePresence>
        {deleteConfirm && ReactDOMDOM.createPortal(
          <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && setDeleteConfirm(null)}>
            <motion.div 
              className="modal-box delete-confirm" 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ maxWidth: 380 }}
            >
              <div className="delete-confirm-icon">🗑️</div>
              <h3>Delete Message?</h3>
              <p>Permanestly remove message from <strong>{deleteConfirm.name}</strong>? This cannot be undone.</p>
              <div className="modal-footer" style={{ justifyContent: "center", marginTop: 24 }}>
                <button className="btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                <button className="btn-danger" onClick={() => deleteMessage(deleteConfirm._id)} style={{ padding: "10px 24px" }}>Delete Now</button>
              </div>
            </motion.div>
          </div>,
          document.getElementById("portal-root")
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selected && ReactDOMDOM.createPortal(
          <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && setSelected(null)}>
            <motion.div 
              className="modal-box" 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ maxWidth: 520, padding: "0" }}
            >
              <div className="modal-header" style={{ padding: "20px 24px" }}>
                <h3 className="modal-title">Inquiry Details</h3>
                <button className="modal-close" onClick={() => setSelected(null)}><X size={20} /></button>
              </div>
              <div className="msg-detail">
                <div className="msg-detail-sender">
                  <div className="msg-detail-avatar" style={{ background: avatarColors[selected.name.length % avatarColors.length] }}>
                    {selected.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="msg-detail-name">{selected.name}</p>
                    <div className="msg-detail-contact">
                      <span><Mail size={12} /> {selected.email}</span>
                      {selected.phone && <span><Phone size={12} /> {selected.phone}</span>}
                    </div>
                  </div>
                  <div className="msg-detail-meta">
                    <span className="msg-detail-date">{formatDate(selected.date)}</span>
                    <span className="msg-detail-time">{formatTime(selected.date)}</span>
                  </div>
                </div>
                <div className="msg-detail-body">
                  <p>{selected.message}</p>
                </div>
                <div className="msg-detail-actions">
                  <a href={`mailto:${selected.email}?subject=Re: Your message&body=Hi ${selected.name},%0A%0A`} className="btn-primary" style={{ flex: 1, justifyContent: "center" }}>
                    <Mail size={16} />
                    Reply via Email
                  </a>
                  <button className="btn-danger-outline" onClick={() => { setDeleteConfirm(selected); setSelected(null); }} style={{ padding: "10px 16px" }}>
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>,
          document.getElementById("portal-root")
        )}
      </AnimatePresence>


      <div className="page-header">
        <div>
          <h1>Customer Contacts</h1>
          <p>{filtered.length} recent messages from users</p>
        </div>
        <button className="btn-secondary" onClick={fetchMessages}>
          <RefreshCcw size={16} className={loading ? "spin-icon" : ""} />
          Sync Inbox
        </button>
      </div>

      <div className="glass-card messages-filter">
        <div className="search-bar" style={{ flex: 1 }}>
          <Search size={18} />
          <input
            placeholder="Find by name, email, or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && <button className="clear-search" onClick={() => setSearch("")}><X size={14} /></button>}
        </div>
        <div className="messages-count-pill" style={{ background: "rgba(255, 255, 255, 0.05)", color: "var(--text-muted)", fontSize: "12px", padding: "6px 12px", borderRadius: "20px", border: "1px solid rgba(255, 255, 255, 0.07)" }}>
           Showing {filtered.length} Results
        </div>
      </div>

      <div className="messages-list-container">
        {loading ? (
          <div className="empty-state">
            <RefreshCcw size={40} className="spin-icon" />
            <p>Scanning your inbox...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <MessageSquare size={60} strokeWidth={1} style={{ opacity: 0.5 }} />
            <h3>No messages found</h3>
            <p>{search ? "No inquiries match your filter criteria." : "When customers fill out the contact form, they'll appear here."}</p>
          </div>
        ) : (
          <div className="messages-table glass-card">
            <div className="messages-table-header">
              <span><User size={14} /> Sender</span>
              <span><Mail size={14} /> Contact Details</span>
              <span><MessageSquare size={14} /> Message Preview</span>
              <span><Calendar size={14} /> Received</span>
              <span>Action</span>
            </div>
            <div className="messages-table-body">
              {filtered.map((msg, i) => (
                <motion.div 
                  key={msg._id} 
                  className="message-row" 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelected(msg)}
                >
                  <div className="msg-sender">
                    <div
                      className="msg-avatar-sm"
                      style={{ background: `linear-gradient(135deg, ${avatarColors[msg.name.length % avatarColors.length]}, rgba(255,255,255,0.2))` }}
                    >
                      {msg.name[0].toUpperCase()}
                    </div>
                    <span className="msg-sender-name">{msg.name}</span>
                  </div>
                  <div className="msg-contact">
                    <p className="msg-email">{msg.email}</p>
                    <p className="msg-phone">{msg.phone}</p>
                  </div>
                  <div className="msg-preview">
                    <p className="msg-preview-text">{msg.message}</p>
                  </div>
                  <div className="msg-date-time">
                    <div className="msg-meta-item">
                      <Calendar size={10} />
                      {formatDate(msg.date)}
                    </div>
                    <div className="msg-meta-item" style={{ opacity: 0.6 }}>
                      <Clock size={10} />
                      {formatTime(msg.date)}
                    </div>
                  </div>
                  <div className="msg-actions" onClick={(e) => e.stopPropagation()}>
                    <button className="btn-icon-circle action-view" onClick={() => setSelected(msg)} title="View Detail">
                      <Eye size={14} />
                    </button>
                    <button className="btn-icon-circle action-delete" onClick={() => setDeleteConfirm(msg)} title="Delete permanently">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Messages;
