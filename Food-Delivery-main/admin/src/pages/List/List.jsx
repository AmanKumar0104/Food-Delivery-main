import React, { useEffect, useState, useContext } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Edit3, 
  Trash2, 
  Plus, 
  Info, 
  LayoutGrid, 
  Search,
  ChevronRight,
  X,
  RefreshCcw
} from "lucide-react";


const CATEGORIES = [
  "All", "Biryani", "Curry", "Dal", "Roti & Bread", "Starters & Snacks",
  "Rice & Pulao", "South Indian", "Street Food", "Desserts & Sweets",
  "Beverages", "Soups", "Salad", "Pure Veg", "Non-Veg", "Rolls",
  "Sandwiches", "Pasta", "Noodles", "Cake", "Seafood", "Thali",
];

const EditModal = ({ item, url, token, onClose, onSave }) => {
  const [data, setData] = useState({
    name: item.name,
    description: item.description,
    price: item.price,
    category: item.category,
    rating: item.rating || "4.0",
  });
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const getImageSrc = () => {
    if (imagePreview) return imagePreview;
    if (item.image.startsWith("http")) return item.image;
    return `${url}/images/${item.image}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("id", item._id);
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("rating", Number(data.rating));
    if (newImage) formData.append("image", newImage);

    try {
      const res = await axios.post(`${url}/api/food/update`, formData, { headers: { token } });
      if (res.data.success) {
        toast.success("Food item updated! ✅");
        onSave();
        onClose();
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Update failed");
    }
    setLoading(false);
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box delete-confirm animate-fade">
        <div className="modal-header">
          <h3 className="modal-title">Edit Food Item</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="edit-image-row">
            <img src={getImageSrc()} alt={item.name} className="edit-thumb" />
            <label className="edit-image-label" htmlFor="edit-img-input">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              Change Image
            </label>
            <input
              id="edit-img-input"
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const f = e.target.files[0];
                if (f) { setNewImage(f); setImagePreview(URL.createObjectURL(f)); }
              }}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Food Name</label>
              <input className="form-input" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Price (₹)</label>
              <input className="form-input" type="number" value={data.price} onChange={(e) => setData({ ...data, price: e.target.value })} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={data.category} onChange={(e) => setData({ ...data, category: e.target.value })}>
                {CATEGORIES.filter(c => c !== "All").map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Rating</label>
              <select className="form-select" value={data.rating} onChange={(e) => setData({ ...data, rating: e.target.value })}>
                {["1.0","2.0","3.0","3.5","4.0","4.5","5.0"].map(r => <option key={r} value={r}>⭐ {r}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" rows="3" value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.getElementById("portal-root")
  );
};


const List = ({ url }) => {
  const navigate = useNavigate();
  const { token, admin } = useContext(StoreContext);
  const [list, setList] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error fetching food list");
      }
    } catch {
      toast.error("Connection error");
    }
    setLoading(false);
  };

  useEffect(() => {
    // If not admin, redirect to login
    if (!admin && !token) { 
      // Check localStorage as fallback if state hasn't loaded yet
      if (!localStorage.getItem("token")) {
        toast.error("Please Login First"); 
        navigate("/"); 
        return; 
      }
    }
    fetchList();
  }, [token, admin]);


  useEffect(() => {
    let result = list;
    if (search) result = result.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.category.toLowerCase().includes(search.toLowerCase()));
    if (category !== "All") result = result.filter(i => i.category === category);
    setFiltered(result);
  }, [list, search, category]);

  const removeFood = async (foodId) => {
    // Store original list for rollback
    const originalList = [...list];
    // Optimistically update UI
    setList(prev => prev.filter(item => item._id !== foodId));

    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId }, { headers: { token } });
      if (response.data.success) {
        toast.success(response.data.message || "Item removed successfully! 🗑️");
        // We already updated the state, so no need to fetchList() unless you want to be extra safe
      } else {
        toast.error(response.data.message || "Failed to remove item");
        setList(originalList); // Rollback on failure
      }
    } catch (err) {
      console.error("Delete Error:", err);
      toast.error("Connectivity issue. Rollback applied.");
      setList(originalList); // Rollback on error
    }
    setDeleteConfirm(null);
  };



  const getImageSrc = (item) => {
    if (item.image.startsWith("http")) return item.image;
    return `${url}/images/${item.image}`;
  };

  return (
    <motion.div 
      className="list-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <AnimatePresence>
        {editItem && (
          <EditModal
            item={editItem}
            url={url}
            token={token}
            onClose={() => setEditItem(null)}
            onSave={fetchList}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteConfirm && ReactDOM.createPortal(
          <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && setDeleteConfirm(null)}>
            <motion.div 
              className="modal-box delete-confirm" 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ maxWidth: 400 }}
            >
              <div className="delete-confirm-icon">🗑️</div>
              <h3>Remove from menu?</h3>
              <p>Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This cannot be undone.</p>
              <div className="modal-footer" style={{ marginTop: 24 }}>
                <button className="btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                <button className="btn-danger" onClick={() => removeFood(deleteConfirm._id)} style={{ padding: "10px 24px" }}>
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>,
          document.getElementById("portal-root")
        )}
      </AnimatePresence>

      <div className="page-header">
        <div>
          <h1>Menu Items</h1>
          <p>Manage your restaurant's dish catalog</p>
        </div>
        <button className="btn-primary" onClick={() => navigate("/add")}>
          <Plus size={18} />
          Add New Dish
        </button>
      </div>

      {/* Filters */}
      <div className="list-filters glass-card">
        <div className="search-bar">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="clear-search" onClick={() => setSearch("")}><X size={14}/></button>
          )}
        </div>
        <div className="category-pills">
          {CATEGORIES.slice(0, 8).map((cat) => (
            <button
              key={cat}
              className={`cat-pill ${category === cat ? "active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
          <select
            className="form-select cat-select"
            value={CATEGORIES.slice(8).includes(category) ? category : ""}
            onChange={(e) => e.target.value && setCategory(e.target.value)}
          >
            <option value="">More...</option>
            {CATEGORIES.slice(8).map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      {/* Table Area */}
      <div className="list-table-container">
        {loading ? (
          <div className="empty-state">
            <RefreshCcw size={40} className="spin-icon" />
            <p>Loading your menu...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <LayoutGrid size={56} strokeWidth={1} />
            <h3>No items found</h3>
            <p>{search ? "We couldn't find any dish matching your search." : "Start by adding your first restaurant dish!"}</p>
            <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => navigate("/add")}>Add Dish</button>
          </div>
        ) : (
          <motion.div 
            className="list-grid"
            layout
          >
            {filtered.map((item) => (
              <motion.div 
                key={item._id} 
                className="food-card"
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
              >
                <div className="food-card-img-wrap">
                  <img src={getImageSrc(item)} alt={item.name} className="food-card-img" onError={(e) => { e.target.src = "https://via.placeholder.com/200x150/1a1d27/ff5722?text=No+Image"; }} />
                  <div className="food-card-category">{item.category}</div>
                  <div className="food-card-rating">⭐ {item.rating || "4.0"}</div>
                </div>
                <div className="food-card-body">
                  <h3 className="food-card-name">{item.name}</h3>
                  <p className="food-card-desc">{item.description}</p>
                  <div className="food-card-footer">
                    <span className="food-card-price">₹{item.price}</span>
                    <div className="food-card-actions">
                      <button className="btn-edit" onClick={() => setEditItem(item)}>
                        <Edit3 size={14} />
                        Edit
                      </button>
                      <button className="btn-danger-outline" onClick={() => setDeleteConfirm(item)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default List;
