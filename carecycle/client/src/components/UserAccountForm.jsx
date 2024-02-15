import React, { useState } from "react";
import Dropdown from "./DropDown"; // Assuming Dropdown is styled with Tailwind
import Button from "./Button"; // Using the original Button component without altering colors
import genderIdentities from "../data/genderIdentities"; // Assuming this path is correct
import mapRegions from "../data/mapRegions"; // Assuming this path is correct

const UserAccountForm = () => {
  const [userType, setUserType] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [searchUsername, setSearchUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [yearOfBirth, setYearOfBirth] = useState("");
  const [genderIdentity, setGenderIdentity] = useState("");
  const [placeOfOrigin, setPlaceOfOrigin] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", searchUsername);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted with:", { userType, username, password, firstName, lastName, yearOfBirth, genderIdentity, placeOfOrigin, postalCode });
    // Add your form submission logic here
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1900 }, (v, k) => `${currentYear - k}`).map((year) => ({ id: year, name: year }));

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
          options={["Admin", "Volunteer", "CA/Employee"].map(option => ({ id: option, name: option }))}
          placeholder="Select User Type"
          selectedOption={userType}
          onSelect={(option) => setUserType(option)}
        />
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16839B] transition duration-200"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16839B] transition duration-200"
        />
        <Dropdown
          options={yearOptions}
          placeholder="Year of Birth"
          selectedOption={yearOfBirth}
          onSelect={(option) => setYearOfBirth(option)}
        />
        <Dropdown
          options={genderIdentities.map(gi => ({ id: gi.id, name: gi.name }))}
          placeholder="Gender Identity"
          selectedOption={genderIdentity}
          onSelect={(option) => setGenderIdentity(option)}
        />
        <Dropdown
          options={mapRegions.map(region => ({ id: region.id, name: region.name }))}
          placeholder="Place of Origin"
          selectedOption={placeOfOrigin}
          onSelect={(option) => setPlaceOfOrigin(option)}
        />
        <input
          type="text"
          placeholder="Postal Code"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16839B] transition duration-200"
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
          <Button type="submit" text="ADD USER" />
        </div>
      </form>
    </div>
  );
};

export default UserAccountForm;
