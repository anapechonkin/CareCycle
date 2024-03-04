import React, { useState, useEffect } from "react";
import Select from 'react-select';
import Button from "./Button";
import { getUsers, softDeleteUser } from "../api/userApi"; // Adjust the import path as needed

const DeleteUserForm = ({ onUsersChanged }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState(""); // New state for feedback type
  const [clearSelect, setClearSelect] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (clearSelect) {
      setSelectedUser(null);
      setClearSelect(false);
    }
  }, [clearSelect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedUser && selectedUser.user_id) {
      console.log("Attempting to archive user:", selectedUser); // Log before archiving
      try {
        await softDeleteUser(selectedUser.user_id);
        console.log("User successfully archived:", { ...selectedUser, is_active: false }); // Log after assuming success
        onUsersChanged();
        setFeedbackMessage("User successfully archived.");
        setFeedbackType("success");
        setClearSelect(true);
        
        setTimeout(() => {
          setFeedbackMessage("");
        }, 3000); // Clear message after 3 seconds
      } catch (error) {
        console.error('Error deleting user:', error);
        setFeedbackMessage("Failed to archive user.");
        setFeedbackType("error");
      }
    } else {
      console.error('No user selected or user ID is undefined');
      setFeedbackMessage("No user selected.");
      setFeedbackType("error");
    }
  };

  const handleSelectChange = (selectedOption) => {
    setSelectedUser(selectedOption ? selectedOption.user : null);
  };

  // Custom style for react-select
  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: '0.5rem',
      border: '1px solid #d1d5db',
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
        options={users.map(user => ({
          value: user.user_id,
          label: `${user.firstname} ${user.lastname} (${user.username})`,
          user: user,
        }))}
        onChange={handleSelectChange}
        placeholder="Search by username"
        isClearable
        value={selectedUser ? {
          value: selectedUser.user_id,
          label: `${selectedUser.firstname} ${selectedUser.lastname} (${selectedUser.username})`,
          user: selectedUser,
        } : null}
        className="mb-4"
        styles={customSelectStyles}
      />
      {selectedUser && (
        <div className="space-y-4 mb-4">
          <div><strong>First Name:</strong> {selectedUser.firstname}</div>
          <div><strong>Last Name:</strong> {selectedUser.lastname}</div>
          <div><strong>Username:</strong> {selectedUser.username}</div>
        </div>
      )}
      <Button type="button" onClick={handleSubmit} text="DELETE" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" />
      {feedbackMessage && (
        <div className={`text-center my-4 ${feedbackType === "success" ? "text-green-500" : "text-red-500"}`}>
          {feedbackMessage}
        </div>
      )}
    </div>
  );
};

export default DeleteUserForm;
