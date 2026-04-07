import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  const [currentState, setCurrentState] = useState("Login");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (currentState === "Forgot Password") {
        const response = await axios.post(`${url}/api/user/forgot-password`, { email: data.email });
        if (response.data.success) {
          toast.success(response.data.message);
          setCurrentState("Login");
        } else {
          toast.error(response.data.message);
        }
      } else {
        let newUrl = url;
        if (currentState === "Login") {
          newUrl += "/api/user/login";
        } else {
          newUrl += "/api/user/register";
        }

        const response = await axios.post(newUrl, data);
        if (response.data.success) {
          if (currentState === "Login") {
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            toast.success("Login Successfully!");
            setShowLogin(false);
          } else {
            toast.success("Registration Successful! Please login now.");
            setCurrentState("Login");
            setData(prev => ({ ...prev, password: "" }));
          }
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currentState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <div className="login-popup-inputs">
          {currentState === "Sign Up" && (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Your name"
              required
            />
          )}

          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your email"
            required
          />

          {currentState !== "Forgot Password" && (
            <div className="password-input-group">
              <input
                name="password"
                onChange={onChangeHandler}
                value={data.password}
                type="password"
                placeholder="Your password"
                required
              />
              {currentState === "Login" && (
                <span 
                  className="forgot-password-link"
                  onClick={() => setCurrentState("Forgot Password")}
                >
                  Forgot Password?
                </span>
              )}
            </div>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? (
            <div className="spinner-small"></div>
          ) : (
            currentState === "Sign Up" ? "Create Account" : (currentState === "Login" ? "Login" : "Send Reset Link")
          )}
        </button>

        {currentState !== "Forgot Password" && (
          <div className="login-popup-condition">
            <input type="checkbox" required />
            <p>By continuing, I agree to the terms of use & privacy policy.</p>
          </div>
        )}

        <div className="login-popup-switch">
          {currentState === "Login" ? (
            <p>
              Create a new account?{" "}
              <span onClick={() => setCurrentState("Sign Up")}>Click here</span>
            </p>
          ) : currentState === "Sign Up" ? (
            <p>
              Already have an account?{" "}
              <span onClick={() => setCurrentState("Login")}>Login here</span>
            </p>
          ) : (
            <p>
              Remembered your password?{" "}
              <span onClick={() => setCurrentState("Login")}>Back to login</span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPopup;
