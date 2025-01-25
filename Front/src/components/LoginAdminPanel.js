import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';


const LoginAdminPanel = () => {
  
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        navigate('/adminPanel');
    } catch (err) {
        alert(err.response?.data?.error || 'An error occurred');
    }
};
  return (
      <div className="login-wrapper">
          <div className="login-container">
      <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    name="login" 
                    placeholder="Login"
                />
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Password"
                />
                <button type="submit">Login</button>
            </form>
    </div>
    </div>
  );
};

export default LoginAdminPanel;
