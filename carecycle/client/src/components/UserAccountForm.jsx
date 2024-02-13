import React, { useState } from "react";
import Dropdown from "./DropDown"; // Assuming Dropdown is styled with Tailwind
import Button from "./Button"; // Using the original Button component without altering colors

const UserAccountForm = () => {
  const [userType, setUserType] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [searchUsername, setSearchUsername] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", searchUsername);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted with:", { userType, username, password });
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 mt-10 mb-10">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">User Account</h2>
      
      {/* Search Section */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by Username"
          value={searchUsername}
          onChange={(e) => setSearchUsername(e.target.value)}
          className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16839B] transition duration-200"
        />
        <Button onClick={handleSearch} text="Search" />
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Dropdown
          options={["Admin", "Volunteer", "CA/Employee"]}
          placeholder="Select User Type"
          selectedOption={userType}
          onSelect={setUserType}
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16839B] transition duration-200"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16839B] transition duration-200"
        />
        <div className="flex justify-around mt-4 gap-4">
          <Button type="submit" text="Add" />
          <Button type="button" text="Update" />
          <Button type="button" text="Delete" />
        </div>
      </form>
    </div>
  );
};

export default UserAccountForm;
