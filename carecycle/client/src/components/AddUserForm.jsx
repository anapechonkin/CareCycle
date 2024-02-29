import React, { useState, useEffect } from 'react';
import Dropdown from './DropDown';
import Button from './Button';
import { addUser } from '../api/userApi';
import { fetchPrimaryGenderIdentities, fetchMapRegions, fetchUserTypes } from '../api/dropdownApi';
import { lookupPostalCode } from '../api/postalCodeApi';

const AddUserForm = () => {
  const [formData, setFormData] = useState({
    userTypeID: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    yearOfBirth: '',
    primaryGenderId: '',
    mapID: '',
    postalCode: '',
    vegetable: '',
    isActive: true,
    postalCodeId: '', // Initialize postalCodeId here
  });
  

  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [genderIdentities, setGenderIdentities] = useState([]);
  const [mapRegions, setMapRegions] = useState([]);
  const [userTypes, setUserTypes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setGenderIdentities(await fetchPrimaryGenderIdentities());
        setMapRegions(await fetchMapRegions());
        setUserTypes(await fetchUserTypes());
      } catch (error) {
        console.error('Failed to fetch dropdown data:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDropdownChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Retrieve postal code ID
      const postalCodeId = await lookupPostalCode(formData.postalCode);
      if (!postalCodeId) {
        throw new Error('Invalid postal code');
      }
  
      // Add postal code ID to the form data
      const dataToSend = {
        ...formData,
        postalCodeId, // Ensure this is always defined
      };
  
      // Add user with updated data
      const addedUser = await addUser(dataToSend);
      console.log('User added successfully:', addedUser);
      setFeedback({ message: 'User added successfully!', type: 'success' });
  
      // Reset form data
      setFormData({
        userTypeID: '',
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        yearOfBirth: '',
        primaryGenderId: '',
        mapID: '',
        postalCode: '',
        vegetable: '',
        isActive: true,
        postalCodeId: '', // Reset this as well to maintain consistency
      });
    } catch (error) {
      console.error('Failed to add user:', error);
      setFeedback({ message: `Failed to add user: ${error.message}`, type: 'error' });
    }
  };
  
  
  
  // Function to render text input fields
  function renderTextInput(name, placeholder, value, isPassword = false) {
    return (
      <input
        type={isPassword ? "password" : "text"}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16839B] transition duration-200"
      />
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 mt-10 mb-10">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Add User</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Dropdown
          options={userTypes.map(({ usertype_id, role }) => ({ label: role, value: usertype_id }))}
          placeholder="Select User Type"
          selectedValue={formData.userTypeID}
          onSelect={(value) => handleDropdownChange('userTypeID', value)}
        />
        {renderTextInput("username", "Username", formData.username)}
        {renderTextInput("password", "Password", formData.password, true)}
        {renderTextInput("firstName", "First Name", formData.firstName)}
        {renderTextInput("lastName", "Last Name", formData.lastName)}
        {renderTextInput("yearOfBirth", "Year of Birth (YYYY)", formData.yearOfBirth)}
        {renderTextInput("postalCode", "Postal Code", formData.postalCode)}
        {renderTextInput("vegetable", "Vegetable", formData.vegetable)}
        <Dropdown
          options={genderIdentities.map(({ primary_gender_id, gender_name }) => ({ label: gender_name, value: primary_gender_id }))}
          placeholder="Gender Identity"
          selectedValue={formData.primaryGenderId}
          onSelect={(value) => handleDropdownChange('primaryGenderId', value)}
        />
        <Dropdown
          options={mapRegions.map(({ map_id, map_area_name }) => ({ label: map_area_name, value: map_id }))}
          placeholder="Map Region"
          selectedValue={formData.map_id}
          onSelect={(value) => handleDropdownChange('mapID', value)}
        />
        <Button type="submit" text="Add User" />
      </form>
      {feedback.message && <p className={`mt-4 text-${feedback.type === 'success' ? 'green' : 'red'}-500`}>{feedback.message}</p>}
    </div>
  );
};

export default AddUserForm;
