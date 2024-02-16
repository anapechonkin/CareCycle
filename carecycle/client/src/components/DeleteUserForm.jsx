import React, { useState } from "react";
import Select from 'react-select'; // Import React Select
import Button from "./Button";
import users from "../data/mockUserData"; // Import your users data

const DeleteUserForm = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  // Transform users data for React Select
  const userOptions = users.map(user => ({
    value: user.username,
    label: `${user.firstName} ${user.lastName} (${user.username})`,
    user: user,
  }));

  const handleSelectChange = (selectedOption) => {
    // Set selected user data to state
    if (selectedOption) {
      setSelectedUser(selectedOption.user);
    } else {
      setSelectedUser(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedUser) {
      console.log("Deleting user:", selectedUser);
      // Implement the deletion logic here, e.g., calling an API to delete the user
    }
  };

  // Custom style for react-select, mimicking Tailwind
  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: '0.5rem',
      border: '1px solid #d1d5db', // Tailwind gray-300
      padding: '0.5rem',
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '0.5rem',
    }),
  };


  return (
    <div className="bg-white shadow-lg rounded-lg p-8 mt-10 mb-10">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Delete User</h2>
      <Select
        options={userOptions}
        onChange={handleSelectChange}
        placeholder="Search by username"
        isClearable
        className="mb-4"
        styles={customSelectStyles}
      />
      {selectedUser && (
        <div className="space-y-4 mb-4">
          <div><strong>First Name:</strong> {selectedUser.firstName}</div>
          <div><strong>Last Name:</strong> {selectedUser.lastName}</div>
          <div><strong>Username:</strong> {selectedUser.username}</div>
        </div>
      )}
      <Button type="submit" onClick={handleSubmit} text="DELETE" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" />
    </div>
  );
};

export default DeleteUserForm;
