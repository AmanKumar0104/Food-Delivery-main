import React, { useContext, useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import { StoreContext } from "./context/StoreContext";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import ChatBot from "./components/ChatBot/ChatBot";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Verify from "./pages/Verify/Verify";
import MyOrders from "./pages/MyOrders/MyOrders";
import Customize from "./pages/Customize/Customize";
import Dining from "./pages/Dining/Dining";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import SmartRecommendations from "./pages/SmartRecommendations/SmartRecommendations";
import GroupOrder from "./pages/GroupOrder/GroupOrder";
import Preloader from "./components/Preloader/Preloader";
import InstallApp from "./components/InstallApp/InstallApp";
import ContactUs from "./components/ContactUs/ContactUs";
import ScrollButtons from "./components/ScrollButtons/ScrollButtons";

const AdminRedirect = () => {
  useEffect(() => {
    window.location.href = "http://127.0.0.1:5174";
  }, []);
  return <div style={{ padding: "50px", textAlign: "center" }}>Redirecting to Admin Panel...</div>;
};

const ProtectedRoute = ({ children }) => {
  const { token, setShowLogin } = useContext(StoreContext);
  const [triedAccess, setTriedAccess] = useState(false);

  useEffect(() => {
    if (!token && !triedAccess) {
      setShowLogin(true);
      setTriedAccess(true);
    }
  }, [token, triedAccess, setShowLogin]);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  const { showLogin, setShowLogin, timeTheme } = useContext(StoreContext);
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <Preloader />
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <div className={`app ${timeTheme}`}>
        <ToastContainer position="top-center" autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="colored" />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={
            <ProtectedRoute>
              <PlaceOrder />
            </ProtectedRoute>
          } />
          <Route path="/verify" element={<Verify />} />
          <Route path="/myorders" element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          } />
          <Route path="/customize" element={<Customize />} />
          <Route path="/dining" element={<Dining />} />
          <Route path="/moody" element={<SmartRecommendations />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/group-order" element={<GroupOrder />} />
          <Route path="/group-order/:sessionId" element={<GroupOrder />} />
          <Route path="/group-lobby" element={<Navigate to="/group-order" replace />} />
          <Route path="/admin" element={<AdminRedirect />} />
        </Routes>
        <ChatBot url="http://localhost:4000" isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
        <InstallApp />
        <ContactUs url="http://localhost:4000" />
        <ScrollButtons isChatOpen={isChatOpen} />
      </div>
      <Footer />
    </>
  );
};

export default App;
