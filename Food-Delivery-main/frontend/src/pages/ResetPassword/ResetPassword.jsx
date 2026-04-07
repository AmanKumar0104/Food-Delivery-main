import React, { useState, useContext } from 'react';
import './ResetPassword.css';
import { useParams, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { url } = useContext(StoreContext);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters long.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${url}/api/user/reset-password`, { 
                token, 
                password 
            });

            if (response.data.success) {
                toast.success("Password updated successfully! Redirecting to login...");
                setTimeout(() => navigate('/'), 3000);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='reset-password-page'>
            <div className='reset-password-container'>
                <div className='reset-header-content'>
                    <h2 style={{color: '#ff4c24'}}>Reset Your Password</h2>
                    <p>Enter a strong new password for your account.</p>
                </div>
                
                <form className='reset-form' onSubmit={handleReset}>
                    <div className='input-group'>
                        <label>New Password</label>
                        <input 
                            type="password" 
                            placeholder="Enter new password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>
                    
                    <div className='input-group'>
                        <label>Confirm Password</label>
                        <input 
                            type="password" 
                            placeholder="Confirm new password" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required 
                        />
                    </div>

                    <button className='reset-btn' type="submit" disabled={loading}>
                        {loading ? <div className='spinner-reset'></div> : "Update Password"}
                    </button>
                    
                    {loading && (
                        <p style={{textAlign: 'center', marginTop: '10px', color: '#888'}}>
                            Applying changes...
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
