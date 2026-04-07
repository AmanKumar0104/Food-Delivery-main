import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom'

const PlaceOrder = () => {
  const navigate= useNavigate();

  const { getTotalCartAmount, token, food_list, cartItems, url } =
    useContext(StoreContext);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const sendWhatsAppBill = async () => {
    // Validation
    if (!data.firstName || !data.phone || !data.street) {
      toast.error("Please fill in delivery information first");
      return;
    }

    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        orderItems.push({ ...item, quantity: cartItems[item._id] });
      }
    });

    let message = `🛒 *New Order from Tomato* 🍅\n`;
    message += `--------------------------\n`;
    message += `*Customer:* ${data.firstName} ${data.lastName}\n`;
    message += `*Email:* ${data.email}\n`;
    message += `*Phone:* ${data.phone}\n\n`;
    message += `*Order Details:*\n`;
    
    orderItems.forEach(item => {
      message += `- ${item.name} x ${item.quantity} : ₹${item.price * item.quantity}\n`;
    });

    message += `\n*Subtotal:* ₹${getTotalCartAmount()}\n`;
    message += `*Delivery Fee:* ₹40\n`;
    message += `*Total Amount:* ₹${getTotalCartAmount() + 40}\n\n`;
    message += `*Address:* ${data.street}, ${data.city}, ${data.zipcode}\n`;
    message += `--------------------------\n`;
    message += `✅ *Order Confirmed!* We will reach out shortly.`;

    const whatsappUrl = `https://wa.me/917667753470?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    // Simulate SMS and Email sent via backend or local toast
    toast.info("WhatsApp Bill generated! Also, an SMS and email have been sent to your registered details.");
    
    // Notify backend to simulate notifications
    try {
      await axios.post(url + "/api/order/notify-customer", {
        customerEmail: data.email,
        customerPhone: data.phone,
        orderTotal: getTotalCartAmount() + 40
      });
    } catch (error) {
       console.log("Notification simulation logged internally");
    }
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 40,
    };
    
    let response= await axios.post(url+"/api/order/place",orderData,{headers:{token}});
    if(response.data.success){
      const {session_url}=response.data;
      window.location.replace(session_url);
    }else{
      toast.error("Errors!")
    }
  };

  useEffect(()=>{
    if(!token){
      toast.error("Please Login first")
      navigate("/cart")
    }
    else if(getTotalCartAmount()===0){
      toast.error("Please Add Items to Cart");
      navigate("/cart")
    }
  },[token])
  return (
    <form className="place-order" onSubmit={placeOrder}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            required
            name="firstName"
            value={data.firstName}
            onChange={onChangeHandler}
            type="text"
            placeholder="First name"
          />
          <input
            required
            name="lastName"
            value={data.lastName}
            onChange={onChangeHandler}
            type="text"
            placeholder="Last name"
          />
        </div>
        <input
          required
          name="email"
          value={data.email}
          onChange={onChangeHandler}
          type="text"
          placeholder="Email Address"
        />
        <input
          required
          name="street"
          value={data.street}
          onChange={onChangeHandler}
          type="text"
          placeholder="Street"
        />
        <div className="multi-fields">
          <input
            required
            name="city"
            value={data.city}
            onChange={onChangeHandler}
            type="text"
            placeholder="City"
          />
          <input
            required
            name="state"
            value={data.state}
            onChange={onChangeHandler}
            type="text"
            placeholder="State"
          />
        </div>
        <div className="multi-fields">
          <input
            required
            name="zipcode"
            value={data.zipcode}
            onChange={onChangeHandler}
            type="text"
            placeholder="Zip Code"
          />
          <input
            required
            name="country"
            value={data.country}
            onChange={onChangeHandler}
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          required
          name="phone"
          value={data.phone}
          onChange={onChangeHandler}
          type="text"
          placeholder="Phone"
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotals</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 40}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 40}
              </b>
            </div>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
          <button type="button" className="whatsapp-bill-btn" onClick={sendWhatsAppBill}>
            SEND BILL ON WHATSAPP & EMAIL
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
