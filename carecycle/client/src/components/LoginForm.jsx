import React, { useState } from "react";
import Button from "./Button";
import DropDown from "./DropDown";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export const LoginForm = () => {
  const [userType, setUserType] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('User Type:', userType);
    //validation and authentication occur here

    // On successful login, navigate to /startQuestionnaire
    navigate('/startQuestionnaire');
  };

  // Placeholder function for Forgot Password click
  const handleForgotPasswordClick = (event) => {
    event.preventDefault();
    // Placeholder for future forgot password functionality
    console.log("Forgot Password clicked");
    //Open a modal or navigate to a forgot password page when implemented
  };

  // Determine if the screen is mobile size
  const isMobile = window.innerWidth < 768;

  return (
    <form
      className="flex flex-col items-center justify-center min-h-screen"
      onSubmit={handleSubmit}
      style={{
        marginTop: isMobile ? '-15rem' : '0', // Negative margin for mobile to bring form up
      }}
    >
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full" style={{ marginTop: isMobile ? '-3rem' : '0' }}>
        <h2 className="text-2xl font-medium text-gray-700 mb-4 text-center">LOG IN TO CARECYCLE</h2>
        <DropDown
          options={["Admin", "Volunteer", "CAA/Employee"]} // Update these options as needed
          placeholder="Select User Type"
          selectedOption={userType} // Ensure DropDown can accept a selectedOption or similar prop if you need to set an initial value
          onSelect={handleUserTypeChange} // Adjust the DropDown component to accept an onSelect or similar prop for callback
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
        <Button
          type="submit"
          text="LOGIN"
        />
        {/* Keep as a link but prevent default navigation */}
        <a
          href="#"
          onClick={handleForgotPasswordClick}
          className="mt-4 text-center text-sm font-semibold"
          style={{ color: '#16839B' }}
        >
          Forgot Password?
        </a>
      </div>
    </form>
  );
};

export default LoginForm;
