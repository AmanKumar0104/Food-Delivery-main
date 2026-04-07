import React, { useContext, useEffect, useState } from "react";
import "./Login.css";
import { toast } from "react-toastify";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  BarChart3, 
  UtensilsCrossed, 
  PackageOpen,
  Loader2
} from "lucide-react";

const Login = ({ url }) => {
  const navigate = useNavigate();
  const { admin, setAdmin, token, setToken } = useContext(StoreContext);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((d) => ({ ...d, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(url + "/api/user/login", data);
      if (response.data.success) {
        if (response.data.role === "admin") {
          setToken(response.data.token);
          setAdmin(true);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("admin", true);
          toast.success("Welcome back, Admin! 🎉");
          navigate("/dashboard");
        } else {
          toast.error("Access denied. Admin privileges required.");
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error("Failed to connect to server.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (admin && token) navigate("/dashboard");
  }, []);

  return (
    <div className="login-page">
      {/* Background blobs */}
      <motion.div 
        className="login-blob blob1"
        animate={{ scale: [1, 1.1, 1], x: [0, 50, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
      ></motion.div>
      <motion.div 
        className="login-blob blob2"
        animate={{ scale: [1, 1.2, 1], y: [0, -40, 0] }}
        transition={{ duration: 12, repeat: Infinity, delay: 1 }}
      ></motion.div>
      <motion.div 
        className="login-blob blob3"
        animate={{ scale: [1.1, 1, 1.1], x: [0, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity, delay: 2 }}
      ></motion.div>

      <motion.div 
        className="login-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="login-left">
          <div className="login-brand">
            <div className="brand-icon-lg">🛡️</div>
            <h2>Tomato Admin</h2>
            <p>Mission control for your restaurant's digital success.</p>
          </div>
          <div className="login-features">
            <div className="feature-item">
              <span className="feature-icon"><BarChart3 size={20} /></span>
              <div>
                <h4>Live Dashboard</h4>
                <p>Real-time metrics and business analytics</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon"><UtensilsCrossed size={20} /></span>
              <div>
                <h4>Menu Management</h4>
                <p>Easily organize and update your dishes</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon"><PackageOpen size={20} /></span>
              <div>
                <h4>Order Handling</h4>
                <p>Streamline your kitchen's workflow</p>
              </div>
            </div>
          </div>
        </div>

        <div className="login-right">
          <motion.div 
            className="login-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="login-card-header">
              <h2>Secure Access</h2>
              <p>Please identity yourself to reach the panel</p>
            </div>

            <form onSubmit={onLogin} className="login-form">
              <div className="form-group">
                <label className="form-label">Admin Email</label>
                <div className="input-with-icon">
                  <Mail size={16} />
                  <input
                    className="form-input"
                    name="email"
                    type="email"
                    placeholder="admin@tomato.com"
                    value={data.email}
                    onChange={onChangeHandler}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-with-icon">
                  <Lock size={16} />
                  <input
                    className="form-input"
                    name="password"
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={data.password}
                    onChange={onChangeHandler}
                    required
                  />
                  <button
                    type="button"
                    className="pass-toggle"
                    onClick={() => setShowPass(!showPass)}
                    tabIndex={-1}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="login-submit-btn" disabled={loading}>
                {loading ? (
                  <Loader2 size={18} className="spin-icon" />
                ) : (
                  <>
                    Sign In to Portal
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
