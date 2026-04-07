import React, { useState, useContext, useEffect } from "react";
import "./Add.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Image as ImageIcon, 
  Plus, 
  ChevronLeft, 
  Info, 
  Upload, 
  Trash2,
  Check,
  RefreshCcw,
  ArrowRight
} from "lucide-react";

const CATEGORIES = [
  "Biryani", "Curry", "Dal", "Roti & Bread", "Starters & Snacks",
  "Rice & Pulao", "South Indian", "Street Food", "Desserts & Sweets",
  "Beverages", "Soups", "Salad", "Pure Veg", "Non-Veg", "Rolls",
  "Sandwiches", "Pasta", "Noodles", "Cake", "Seafood", "Thali",
];

const Add = ({ url }) => {
  const navigate = useNavigate();
  const { token, admin } = useContext(StoreContext);
  const [image, setImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Biryani",
    rating: "4.0",
  });

  useEffect(() => {
    if (!admin && !token && !localStorage.getItem("token")) {
      toast.error("Please Login First");
      navigate("/");
    }
  }, [token, admin]);


  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((d) => ({ ...d, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setData({ name: "", description: "", price: "", category: "Biryani", rating: "4.0" });
    setImage(false);
    setImagePreview(null);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error("Please upload a food image");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("rating", Number(data.rating));
    formData.append("image", image);

    try {
      const response = await axios.post(`${url}/api/food/add`, formData, { headers: { token } });
      if (response.data.success) {
        toast.success(response.data.message || "Food item added successfully! 🎉");
        resetForm();
      } else {
        toast.error(response.data.message || "Failed to add food");
      }
    } catch (err) {
      console.error("Add Error:", err);
      toast.error("Connectivity issue. Please try again.");
    }

    setLoading(false);
  };

  const starRatings = ["1.0","2.0","3.0","3.5","4.0","4.5","5.0"];

  return (
    <motion.div 
      className="add-page"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="page-header">
        <div>
          <h1>Add New Dish</h1>
          <p>Fill in the details to add a new item to your menu</p>
        </div>
        <button className="btn-secondary" onClick={() => navigate("/list")}>
          <ChevronLeft size={16} />
          Back to List
        </button>
      </div>

      <div className="add-layout">
        {/* Image Upload */}
        <motion.div 
          className="add-image-section glass-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="section-title">
            <ImageIcon size={16} />
            Dish Image
          </h3>
          <label htmlFor="add-image-input" className="image-upload-area">
            {imagePreview ? (
              <div className="image-preview-wrapper">
                <img src={imagePreview} alt="Preview" className="image-preview" />
                <div className="image-change-overlay">
                  <Upload size={24} />
                  <span>Update Photo</span>
                </div>
              </div>
            ) : (
              <div className="upload-placeholder">
                <div className="upload-icon-wrap">
                  <Upload size={32} strokeWidth={1.5} />
                </div>
                <p className="upload-title">Upload Image</p>
                <p className="upload-sub">PNG, JPG, WEBP (Max 5MB)</p>
              </div>
            )}
          </label>
          <input
            id="add-image-input"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            hidden
          />
          {imagePreview && (
            <button
              type="button"
              className="btn-danger-outline"
              style={{ width: "100%", justifyContent: "center", marginTop: "16px" }}
              onClick={(e) => { e.preventDefault(); setImage(false); setImagePreview(null); }}
            >
              <Trash2 size={14} />
              Remove Image
            </button>
          )}
        </motion.div>

        {/* Form */}
        <motion.div 
          className="add-form-section glass-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="section-title">
            <Info size={16} />
            Dish Details
          </h3>
          <form onSubmit={onSubmitHandler} className="add-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Dish Name *</label>
                <input
                  className="form-input"
                  name="name"
                  type="text"
                  placeholder="e.g. Garlic Naan"
                  value={data.name}
                  onChange={onChangeHandler}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Price *</label>
                <div className="price-input-wrap">
                  <span className="currency-prefix">₹</span>
                  <input
                    className="form-input"
                    name="price"
                    type="number"
                    placeholder="0"
                    value={data.price}
                    onChange={onChangeHandler}
                    min="1"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  className="form-select"
                  name="category"
                  value={data.category}
                  onChange={onChangeHandler}
                  required
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Menu Rating</label>
                <select
                  className="form-select"
                  name="rating"
                  value={data.rating}
                  onChange={onChangeHandler}
                >
                  {starRatings.map((r) => (
                    <option key={r} value={r}>⭐ {r}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                className="form-textarea"
                name="description"
                rows="4"
                placeholder="Deliciously seasoned, served hot with mint chutney..."
                value={data.description}
                onChange={onChangeHandler}
                required
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Discard
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? (
                  <RefreshCcw size={16} className="spin-icon" />
                ) : (
                  <Check size={16} />
                )}
                {loading ? "Saving Item..." : "Publish to Menu"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Add;
