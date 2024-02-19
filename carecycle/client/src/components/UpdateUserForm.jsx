import React, { useState, useMemo } from "react";
import Select from 'react-select';
import Button from "./Button";
import Checkbox from "./Checkbox";
import genderIdentities from "../data/genderIdentities";
import mapRegions from "../data/mapRegions";
import users from "../data/mockUserData";

const UpdateUserForm = () => {
  const [formData, setFormData] = useState({
    searchUser: null, // State for the selected user from the search bar
    userType: "",
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    yearOfBirth: "",
    genderIdentity: "",
    placeOfOrigin: "",
    postalCode: "",
    vegetable: "",
    status: false,
  });

  const [filter, setFilter] = useState('all'); // 'all', 'active', 'archived'

  // State for the selected user from the search bar
  const [selectedUser, setSelectedUser] = useState(null);

  const userOptions = useMemo(() => users.filter(user => {
    switch (filter) {
      case 'active':
        return user.status === "Active";
      case 'archived':
        return user.status !== "Active";
      default:
        return true;
    }
  }).map(user => ({
    value: user.username,
    label: `${user.firstName} ${user.lastName} (${user.username})`,
    user: user,
  })), [filter]);

  const userTypeOptions = ["Admin", "Volunteer", "CA/Employee"].map(option => ({
    value: option,
    label: option,
  }));

  const genderIdentityOptions = genderIdentities.map(gi => ({
    value: gi.name,
    label: gi.name,
  }));

  const placeOfOriginOptions = mapRegions.map(region => ({
    value: region.name,
    label: region.name,
  }));

  const handleSelectChange = (field, selectedOption) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: selectedOption ? selectedOption.value : '',
    }));
  };

  const handleUserSelectChange = selectedOption => {
    if (selectedOption) {
      const { user } = selectedOption;
      setFormData({
        userType: user.userType,
        username: user.username,
        password: '', // Assuming you don't want to display the password
        firstName: user.firstName,
        lastName: user.lastName,
        yearOfBirth: user.yearOfBirth,
        genderIdentity: user.genderIdentity,
        placeOfOrigin: user.placeOfOrigin,
        postalCode: user.postalCode,
        vegetable: user.vegetable,
        status: user.status === "Active",
      });
    } else {
      // Reset form if no user is selected
      setFormData({
        userType: "",
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        yearOfBirth: "",
        genderIdentity: "",
        placeOfOrigin: "",
        postalCode: "",
        vegetable: "",
        status: false,
      });
    }
  };

  const handleChange = ({ target: { name, value, checked, type } }) => {
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated User:", formData);
    // Here you would typically send the update to your backend
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
    <div className="bg-white shadow rounded-lg p-8">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Update User</h2>

      <div className="flex justify-center gap-4 mb-4">
        {['all', 'active', 'archived'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === f ? 'bg-custom-teal text-white hover:bg-[#0f6a8b]' : 'bg-white text-gray-800 hover:bg-gray-100'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <Select
        options={userOptions}
        onChange={handleUserSelectChange}
        placeholder="Search by name or username"
        isClearable
        className="mb-4"
        styles={customSelectStyles}
      />
<form onSubmit={handleSubmit} className="space-y-4">
  {/* Username */}
  <div>
    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
    <input
      id="username"
      type="text"
      name="username"
      value={formData.username}
      onChange={handleChange}
      className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16839B] transition duration-200"
    />
  </div>

  {/* Password */}
  <div>
    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
    <input
      id="password"
      type="password"
      name="password"
      value={formData.password}
      onChange={handleChange}
      className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16839B] transition duration-200"
    />
  </div>

  {/* Status Checkbox */}
  <div className="flex items-center">
    <Checkbox
      title="Status"
      options={[{ id: "status", label: "Active", checked: formData.status }]}
      onChange={handleChange}
    />
  </div>

  {/* UserType */}
  <div>
    <label htmlFor="userType" className="block text-sm font-medium text-gray-700">User Type</label>
    <Select
      id="userType"
      name="userType"
      options={userTypeOptions}
      value={userTypeOptions.find(option => option.value === formData.userType)}
      onChange={(option) => handleSelectChange('userType', option)}
      styles={customSelectStyles}
    />
  </div>

  {/* FirstName */}
  <div>
    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
    <input
      id="firstName"
      type="text"
      name="firstName"
      value={formData.firstName}
      onChange={handleChange}
      className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16839B] transition duration-200"
    />
  </div>

  {/* LastName */}
  <div>
    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
    <input
      id="lastName"
      type="text"
      name="lastName"
      value={formData.lastName}
      onChange={handleChange}
      className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16839B] transition duration-200"
    />
  </div>

  {/* Gender Identity */}
  <div>
    <label htmlFor="genderIdentity" className="block text-sm font-medium text-gray-700">Gender Identity</label>
    <Select
      id="genderIdentity"
      name="genderIdentity"
      options={genderIdentityOptions}
      value={genderIdentityOptions.find(option => option.value === formData.genderIdentity)}
      onChange={(option) => handleSelectChange('genderIdentity', option)}
      styles={customSelectStyles}
    />
  </div>

  {/* YearOfBirth */}
  <div>
    <label htmlFor="yearOfBirth" className="block text-sm font-medium text-gray-700">Year of Birth</label>
    <input
      id="yearOfBirth"
      type="text"
      name="yearOfBirth"
      value={formData.yearOfBirth}
      onChange={handleChange}
      className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16839B] transition duration-200"
    />
  </div>

  {/* PlaceOfOrigin */}
  <div>
    <label htmlFor="placeOfOrigin" className="block text-sm font-medium text-gray-700">Place of Origin</label>
    <Select
      id="placeOfOrigin"
      name="placeOfOrigin"
      options={placeOfOriginOptions}
      value={placeOfOriginOptions.find(option => option.value === formData.placeOfOrigin)}
      onChange={(option) => handleSelectChange('placeOfOrigin', option)}
      styles={customSelectStyles}
    />
  </div>

  {/* PostalCode */}
  <div>
    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal Code</label>
    <input
      id="postalCode"
      type="text"
      name="postalCode"
      value={formData.postalCode}
      onChange={handleChange}
      className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16839B] transition duration-200"
    />
  </div>

  {/* Vegetable */}
  <div>
    <label htmlFor="vegetable" className="block text-sm font-medium text-gray-700">Vegetable</label>
    <input
      id="vegetable"
      type="text"
      name="vegetable"
      value={formData.vegetable}
      onChange={handleChange}
      className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16839B] transition duration-200"
    />
  </div>

  {/* Submit Button */}
  <div className="flex justify-center">
    <Button type="submit" text="Update User" />
  </div>
</form>


    </div>
  );
};

export default UpdateUserForm;
