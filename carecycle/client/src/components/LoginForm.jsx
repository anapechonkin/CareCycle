import React, { useState } from "react";

export const LoginForm = () => {
  const [userType, setUserType] = useState('');

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('User Type:', userType);
    // ... other form submission related code
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
        <select
          name="userType"
          id="userType"
          value={userType}
          onChange={handleUserTypeChange}
          className="w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring focus:border-blue-300 mb-4"
        >
          <option value="" disabled hidden>Select User Type</option>
          <option value="admin">Admin</option>
          <option value="editor">Volunteer</option>
          <option value="subscriber">CAA/Employee</option>
          {/* ... add other user types as needed ... */}
        </select>
        <input
          type="text"
          placeholder="Username"
          name="username"
          className="w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring focus:border-blue-300 mb-4"
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          className="w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring focus:border-blue-300 mb-4"
        />
        <button
          type="submit"
          className="w-full text-white font-bold py-3 rounded-lg text-base focus:outline-none focus:shadow-outline mt-4"
          style={{ backgroundColor: '#16839B', borderColor: '#D78030' }} // Custom color for button
        >
          LOGIN
        </button>
        <a href="/startQuestionnaire" className="mt-4 text-center text-sm font-semibold"
          style={{ color: '#16839B' }} // Custom color for link
        >
          Forgot Password?
        </a>
      </div>
    </form>
  );
};

export default LoginForm;
