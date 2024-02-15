// DeleteUserForm.js
import React, { useState } from "react";
import Button from "./Button";

const DeleteUserForm = () => {
  const [searchUsername, setSearchUsername] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
  });

  const handleSearch = () => {
    console.log("Searching for user:", searchUsername);
    // Implement search logic here, typically setting formData with the user's existing data
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Deleting user:", formData);
    // Here you would implement the logic to handle the deletion,
    // such as calling an API with the formData to delete the user.
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 mt-10 mb-10">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Delete User</h2>
      <div className="mb-8">
        <input type="text" placeholder="Search by Username" value={searchUsername} onChange={(e) => setSearchUsername(e.target.value)} className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16839B] transition duration-200" />
        <Button onClick={handleSearch} text="Search" />
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16839B] transition duration-200"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16839B] transition duration-200"
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16839B] transition duration-200"
        />
        <Button type="submit" text="DELETE" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" />
      </form>
    </div>
  );
};

export default DeleteUserForm;
