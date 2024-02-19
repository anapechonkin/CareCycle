import React, { useState } from 'react';
import Dropdown from './DropDown';
import Button from './Button';
import genderIdentities from '../data/genderIdentities';
import mapRegions from '../data/mapRegions';

// Component to add a new user
const AddUserForm = () => {
  // State for form data
  const [formData, setFormData] = useState({
    userType: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    yearOfBirth: '',
    genderIdentity: '',
    placeOfOrigin: '',
    postalCode: '',
    vegetable: '',
    status: 'Active', // Initial status for new users
  });

  // Handle change in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Adding user:', formData);
    // Here, you'd implement the logic to add a user, including sending the status
  };

  // Render form
  return (
    <div className="bg-white shadow-lg rounded-lg p-8 mt-10 mb-10">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Add User</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Type Dropdown */}
        <Dropdown 
          options={["Admin", "Volunteer", "CA/Employee"].map((option) => ({ label: option, value: option }))}
          placeholder="Select User Type"
          selectedOption={formData.userType}
          onSelect={(value) => setFormData({ ...formData, userType: value })}
        />

        {/* Text Inputs */}
        {renderTextInput("username", "Username", formData.username, handleChange)}
        {renderTextInput("password", "Password", formData.password, handleChange, true)}
        {renderTextInput("firstName", "First Name", formData.firstName, handleChange)}
        {renderTextInput("lastName", "Last Name", formData.lastName, handleChange)}
        {renderTextInput("yearOfBirth", "Year of Birth", formData.yearOfBirth, handleChange)}
        {renderTextInput("postalCode", "Postal Code", formData.postalCode, handleChange)}
        {renderTextInput("vegetable", "Vegetable", formData.vegetable, handleChange)}

        {/* Gender Identity and Place of Origin Dropdowns */}
        <Dropdown
          options={genderIdentities.map(({ name }) => ({ label: name, value: name }))}
          placeholder="Gender Identity"
          selectedOption={formData.genderIdentity}
          onSelect={(value) => setFormData({ ...formData, genderIdentity: value })}
        />
        <Dropdown
          options={mapRegions.map(({ name }) => ({ label: name, value: name }))}
          placeholder="Place of Origin"
          selectedOption={formData.placeOfOrigin}
          onSelect={(value) => setFormData({ ...formData, placeOfOrigin: value })}
        />

        {/* Submit Button */}
        <Button type="submit" text="ADD" />
      </form>
    </div>
  );
};

// Function to render text input fields
function renderTextInput(name, placeholder, value, onChange, isPassword = false) {
  return (
    <input
      type={isPassword ? "password" : "text"}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16839B] transition duration-200"
    />
  );
}

export default AddUserForm;
