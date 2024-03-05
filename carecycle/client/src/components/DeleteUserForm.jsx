import React, { useState, useEffect } from "react";
import Select from 'react-select';
import Button from "./Button";
import { getUsers, softDeleteUser } from "../api/userApi";

const DeleteUserForm = ({ onUsersChanged }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const [clearSelect, setClearSelect] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers.length ? fetchedUsers : []);
      } catch (error) {
        console.error('Error fetching users:', error);
        setFeedbackMessage("Failed to fetch users.");
        setFeedbackType("error");
      }
    };
    fetchUsers();
  }, [onUsersChanged]);

  useEffect(() => {
    if (clearSelect) {
      setSelectedUser(null);
      setClearSelect(false);
    }
  }, [clearSelect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedUser && selectedUser.value) {
      try {
        await softDeleteUser(selectedUser.value);
        setFeedbackMessage("User successfully archived.");
        setFeedbackType("success");
        setClearSelect(true);
        onUsersChanged(); // Propagate change upwards to trigger a re-fetch or other actions
      } catch (error) {
        console.error('Error deleting user:', error);
        setFeedbackMessage("Failed to archive user.");
        setFeedbackType("error");
      }
    } else {
      setFeedbackMessage("No user selected.");
      setFeedbackType("error");
    }
  };

  const handleSelectChange = (selectedOption) => {
    setSelectedUser(selectedOption ? selectedOption : null);
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
      {users.length > 0 ? (
        <>
          <Select
            options={users.map(user => ({
              value: user.user_id,
              label: `${user.firstname} ${user.lastname} (${user.username})`,
              user: user,
            }))}
            onChange={handleSelectChange}
            placeholder="Search by username"
            isClearable
            value={selectedUser}
            className="mb-4"
            styles={customSelectStyles}
          />
          {selectedUser && (
            <div className="space-y-4 mb-4">
              <div><strong>First Name:</strong> {selectedUser.user.firstname}</div>
              <div><strong>Last Name:</strong> {selectedUser.user.lastname}</div>
              <div><strong>Username:</strong> {selectedUser.user.username}</div>
            </div>
          )}
          <Button type="button" onClick={handleSubmit} text="DELETE" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" />
        </>
      ) : (
        <p className="text-center text-gray-500">No users available for deletion.</p>
      )}
      {feedbackMessage && (
        <div className={`text-center my-4 ${feedbackType === "success" ? "text-green-500" : feedbackType === "error" ? "text-red-500" : "text-gray-500"}`}>
          {feedbackMessage}
        </div>
      )}
    </div>
  );
};

export default DeleteUserForm;
