import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Route, Routes } from "react-router-dom";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Orders from "./pages/Orders/Orders";
import Messages from "./pages/Messages/Messages";
import Dashboard from "./pages/Dashboard/Dashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login/Login";
import { StoreContext } from "./context/StoreContext";

const App = () => {
  const url = "http://localhost:5000";
  const { isSidebarOpen } = React.useContext(StoreContext);

  return (
    <div className="app-layout">
      <ToastContainer
        position="top-right"
        toastStyle={{
          background: "#1a1d27",
          color: "#f0f2ff",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "12px",
        }}
      />
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <main className={`app-main ${!isSidebarOpen ? "collapsed" : ""}`}>
          <Routes>
            <Route path="/" element={<Login url={url} />} />
            <Route path="/dashboard" element={<Dashboard url={url} />} />
            <Route path="/add" element={<Add url={url} />} />
            <Route path="/list" element={<List url={url} />} />
            <Route path="/orders" element={<Orders url={url} />} />
            <Route path="/messages" element={<Messages url={url} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
