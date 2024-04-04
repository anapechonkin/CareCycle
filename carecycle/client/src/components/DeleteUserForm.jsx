import React, { useState, useEffect } from "react";
import Select from 'react-select';
import Button from "./Button";
import { getUsers, softDeleteUser } from "../api/userApi";
import { useTranslation } from "react-i18next";

const DeleteUserForm = ({ onUsersChanged }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const [clearSelect, setClearSelect] = useState(false);
  const { t } = useTranslation('deleteUserForm');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getUsers();
        const activeUsers = fetchedUsers.filter(user => user.is_active); // Ensure is_active is correctly used
        setUsers(activeUsers.length ? activeUsers : []);
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

  // A helper function to manage feedback messages
  const handleFeedback = (message, type) => {
    setFeedbackMessage(message);
    setFeedbackType(type);
    // Automatically clear feedback message after 3 seconds
    setTimeout(() => {
      setFeedbackMessage("");
      setFeedbackType("");
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!selectedUser || !selectedUser.value) {
      handleFeedback(t('deleteUserForm:feedback.noUserSelected'), "error");
      return; // Exit if no user is selected
    }
  
    try {
      await softDeleteUser(selectedUser.value);
      console.log("User successfully archived:", selectedUser);
      handleFeedback(t('deleteUserForm:feedback.userArchivedSuccess'), "success");    
      setClearSelect(true); // Clear the select input after successful deletion
      if (typeof onUsersChanged === "function") {
        onUsersChanged(); // Propagate change upwards to trigger a re-fetch or other actions
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      handleFeedback(t('deleteUserForm:feedback.userArchiveError'), "error");
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
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">{t('deleteUserForm:title')}</h2>
      {users.length > 0 ? (
        <>
          <Select
            options={users.map(user => ({
              value: user.user_id,
              label: `${user.firstname} ${user.lastname} (${user.username})`,
              user: user,
            }))}
            onChange={handleSelectChange}
            placeholder={t('deleteUserForm:searchPlaceholder')}
            isClearable
            value={selectedUser}
            className="mb-4"
            styles={customSelectStyles}
          />
          {selectedUser && (
            <div className="space-y-4 mb-4">
              <div><strong>{t('deleteUserForm:userInfo.firstName')}</strong> {selectedUser.user.firstname}</div>
              <div><strong>{t('deleteUserForm:userInfo.lastName')}</strong> {selectedUser.user.lastname}</div>
              <div><strong>{t('deleteUserForm:userInfo.username')}</strong> {selectedUser.user.username}</div>
            </div>
          )}
          <Button type="button" onClick={handleSubmit} text={t('deleteUserForm:deleteButtonText')} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" />
        </>
      ) : (
        <p className="text-center text-gray-500">{t('deleteUserForm:noUsersAvailable')}</p>
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
