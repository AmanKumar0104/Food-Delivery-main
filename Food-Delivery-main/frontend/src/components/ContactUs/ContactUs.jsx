
import React, { useState } from 'react'
import './ContactUs.css'
import axios from 'axios'
import { toast } from 'react-toastify'

const ContactUs = ({ url }) => {
    const [data, setData] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const onFormSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${url}/api/contact/submit`, data);
            if (response.data.success) {
                toast.success("Message sent successfully!");
                setData({
                    name: "",
                    email: "",
                    phone: "",
                    message: ""
                })
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Error submitting message");
        }
    }

    return (
        <div className='contact-us' id='contact-us'>
            <div className='contact-us-container'>
                <div className='contact-us-left'>
                    <h1>Get In <span>Touch</span></h1>
                    <p>Have some queries or feedback? We’d love to hear from you. Just fill out the form or reach out via our contact details.</p>
                    <div className='contact-details'>
                        <div className='contact-item'>
                            <div className='icon-circle'><i className="fas fa-phone"></i></div>
                            <div>
                                <p>WhatsApp & Call</p>
                                <a href="https://wa.me/917667753470" target="_blank" rel="noopener noreferrer">+91 7667753470</a>
                            </div>
                        </div>
                        <div className='contact-item'>
                            <div className='icon-circle'><i className="fas fa-envelope"></i></div>
                            <div>
                                <p>Email Us</p>
                                <a href="mailto:prajapatiamanap123@gmail.com">prajapatiamanap123@gmail.com</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='contact-us-right'>
                    <form onSubmit={onFormSubmit} className='contact-form'>
                        <div className='input-group'>
                            <input type='text' name='name' value={data.name} onChange={onChangeHandler} placeholder='Full Name' required />
                        </div>
                        <div className='input-group'>
                            <input type='email' name='email' value={data.email} onChange={onChangeHandler} placeholder='Email Address' required />
                        </div>
                        <div className='input-group'>
                            <input type='text' name='phone' value={data.phone} onChange={onChangeHandler} placeholder='Phone Number' required />
                        </div>
                        <div className='input-group'>
                            <textarea name='message' value={data.message} onChange={onChangeHandler} placeholder='Your Message' rows="4" required></textarea>
                        </div>
                        <button type='submit'>Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ContactUs
