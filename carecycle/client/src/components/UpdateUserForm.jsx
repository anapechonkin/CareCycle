// UpdateUserForm.js
import React, { useState } from "react";
import Dropdown from "./DropDown";
import Button from "./Button";
import genderIdentities from "../data/genderIdentities";
import mapRegions from "../data/mapRegions";

const UpdateUserForm = () => {
  const [searchUsername, setSearchUsername] = useState("");
  const [formData, setFormData] = useState({
    userType: "",
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    yearOfBirth: "",
    genderIdentity: "",
    placeOfOrigin: "",
    postalCode: "",
  });

  const handleSearch = () => {
    console.log("Searching for user:", searchUsername);
    // Implement search logic here, typically setting formData with the user's existing data
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updating user:", formData);
    // Implement update user logic here
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 mt-10 mb-10">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Update User</h2>
      <div className="mb-8">
        <input type="text" placeholder="Search by Username" value={searchUsername} onChange={(e) => setSearchUsername(e.target.value)} className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16839B] transition duration-200" />
        <Button onClick={handleSearch} text="Search" />
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Dropdown options={["Admin", "Volunteer", "CA/Employee"].map(option => option)} placeholder="Select User Type" selectedOption={formData.userType} onSelect={value => setFormData({...formData, userType: value})} />
        <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16839B] transition duration-200" />
        <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16839B] transition duration-200" />
        <Dropdown options={genderIdentities.map(({name}) => name)} placeholder="Gender Identity" selectedOption={formData.genderIdentity} onSelect={value => setFormData({...formData, genderIdentity: value})} />
        <Dropdown options={mapRegions.map(({name}) => name)} placeholder="Place of Origin" selectedOption={formData.placeOfOrigin} onSelect={value => setFormData({...formData, placeOfOrigin: value})} />
        <input type="text" name="yearOfBirth" placeholder="Year of Birth" value={formData.yearOfBirth} onChange={handleChange} className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16839B] transition duration-200" />
        <input type="text" name="postalCode" placeholder="Postal Code" value={formData.postalCode} onChange={handleChange} className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16839B] transition duration-200" />
        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16839B] transition duration-200" />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16839B] transition duration-200" />
        <Button type="submit" text="UPDATE" onClick={handleSubmit} />
      </form>
    </div>
  );
};

export default UpdateUserForm;
