// LoginForm.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext"; // Adjust the import path as needed
import Button from "./Button"; // Adjust the import path as needed
import DropDown from "./DropDown"; // Adjust the import path as needed

const LoginForm = () => {
  const { setUserType } = useUser();
  const [localUserType, setLocalUserType] = useState('');
  const navigate = useNavigate();

  const handleUserTypeChange = (selectedOption) => {
    setLocalUserType(selectedOption); 
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    setUserType(localUserType || 'admin'); // Hardcode to 'Admin' or use the selected value
    console.log('User Type set to:', localUserType || 'admin');
    // Here, add your authentication logic
    navigate('/dashboard'); // Navigate after successful login
  };

  const handleForgotPasswordClick = (event) => {
    event.preventDefault();
    console.log("Forgot Password clicked");
    // Placeholder for forgot password functionality
  };

  const isMobile = window.innerWidth < 768;

  return (
    <form
      className="flex flex-col items-center justify-center min-h-screen"
      onSubmit={handleSubmit}
      style={{ marginTop: isMobile ? '-15rem' : '0' }}
    >
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full" style={{ marginTop: isMobile ? '-3rem' : '0' }}>
        <h2 className="text-2xl font-medium text-gray-700 mb-4 text-center">LOG IN TO CARECYCLE</h2>
        <DropDown
          options={["Admin", "Volunteer", "CA/Employee"]}
          placeholder="Select User Type"
          selectedOption={localUserType}
          onSelect={handleUserTypeChange}
        />
        <input
          type="text"
          placeholder="Username"
          name="username"
          className="w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring focus:border-blue-300 mb-4 mt-4"
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          className="w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring focus:border-blue-300 mb-4"
        />
        <Button type="submit" text="LOGIN" />
        <a href="#" onClick={handleForgotPasswordClick} className="mt-4 text-center text-sm font-semibold" style={{ color: '#16839B' }}>
          Forgot Password?
        </a>
      </div>
    </form>
  );
};

export default LoginForm;
