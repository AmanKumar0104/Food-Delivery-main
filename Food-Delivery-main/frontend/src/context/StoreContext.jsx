import axios from "axios";
import { createContext, useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { food_list as local_food_list } from "../assets/frontend_assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:4000";
  const [token, setToken] = useState("");
  
  // Use original local list as initial state
  const [food_list, setFoodList] = useState(local_food_list);
  const [showLogin, setShowLogin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Time-Based Context
  const [timeTheme, setTimeTheme] = useState("light-theme");
  const [timeGreeting, setTimeGreeting] = useState("Enjoy our delicious food!");
  const [timeCategory, setTimeCategory] = useState("Breakfast");

  const detectTimeTheme = useCallback(() => {
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 12) {
      setTimeTheme("morning-theme");
      setTimeGreeting("Start your day with a healthy breakfast 🌅");
      setTimeCategory("Starters");
    } else if (hour >= 12 && hour < 17) {
      setTimeTheme("warm-theme");
      setTimeGreeting("Enjoy your delicious lunch 🌞");
      setTimeCategory("Main Course"); // Mapping categories to Lunch
    } else if (hour >= 17 && hour < 21) {
      setTimeTheme("evening-theme");
      setTimeGreeting("Relax with some evening snacks 🌇");
      setTimeCategory("Street Food");
    } else {
      setTimeTheme("dark-theme");
      setTimeGreeting("Craving something tasty tonight? 🌙");
      setTimeCategory("Main Course"); // Mapping to Dinner/Late Night
    }
  }, []);

  useEffect(() => {
    detectTimeTheme();
    // Refresh theme every 10 minutes
    const interval = setInterval(detectTimeTheme, 600000);
    return () => clearInterval(interval);
  }, [detectTimeTheme]);

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
      const response = await axios.post(
        url + "/api/cart/add",
        { itemId },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      const response = await axios.post(
        url + "/api/cart/remove",
        { itemId },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(url + "/api/food/list");
      console.log("Food API connection successful:", response.data.success);
      if (response.data.success) {
        setFoodList(response.data.data);
        console.log(`Loaded ${response.data.data.length} items from API (Database Synced).`);
      } else {
        console.warn("API returned success:false, using fallback local data.");
      }
    } catch (error) {
       console.error("Connection to backend failed. Using local fallback data. Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCardData = async (token) => {
    const response = await axios.post(
      url + "/api/cart/get",
      {},
      { headers: { token } }
    );
    setCartItems(response.data.cartData || {});
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCardData(localStorage.getItem("token"));
      }
    }
    loadData();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    showLogin,
    setShowLogin,
    searchQuery,
    setSearchQuery,
    timeTheme,
    timeGreeting,
    timeCategory,
    loading
  };
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
export default StoreContextProvider;
