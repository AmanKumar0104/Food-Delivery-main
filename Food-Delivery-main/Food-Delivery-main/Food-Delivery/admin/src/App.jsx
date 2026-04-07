import React, { useContext } from "react";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Route, Routes, Navigate } from "react-router-dom";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Orders from "./pages/Orders/Orders";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login/Login";
import { StoreContext } from "./context/StoreContext";

const ProtectedRoute = ({ children }) => {
  const { token, admin } = useContext(StoreContext);
  if (!token || !admin) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  const url = "http://localhost:4000";
  return (
    <div>
      <ToastContainer />
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Login url={url}/>} />
          <Route path="/add" element={
            <ProtectedRoute>
              <Add url={url}/>
            </ProtectedRoute>
          } />
          <Route path="/list" element={
            <ProtectedRoute>
              <List url={url}/>
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders url={url}/>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </div>
  );
};

export default App;
