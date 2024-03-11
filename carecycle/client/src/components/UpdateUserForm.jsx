import React, { useState, useEffect } from "react";
import Select from 'react-select'; 
import Button from "./Button";
import Checkbox from "./Checkbox";
import Dropdown from "./DropDown";
import { fetchUserTypes, fetchPrimaryGenderIdentities, fetchMapRegions } from "../api/dropdownApi";
import { updateUser, getUserById } from "../api/userApi";
import { fetchGenderIdentities, updateUserGenderIdentities } from "../api/genderIdentityApi";
import { lookupPostalCode, addPostalCode } from '../api/postalCodeApi';

// Updated to accept `users` as a prop
const UpdateUserForm = ({ onAddUser, users }) => {
  const [formData, setFormData] = useState({
    userTypeID: '',
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    yearOfBirth: '',
    primaryGenderId: '',
    mapID: '',
    postalCode: '',
    vegetable: '',
    isActive: false,
    postalCodeId: '',
  });

  const [filter, setFilter] = useState('all');
  const [userTypes, setUserTypes] = useState([]);
  const [primaryGenderIdentities, setPrimaryGenderIdentities] = useState([]);
  const [mapRegions, setMapRegions] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [genderIdentities, setGenderIdentities] = useState([]);
  const [selectedGenderIdentities, setSelectedGenderIdentities] = useState([]);
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [checkboxOptions, setCheckboxOptions] = useState([]); 

  useEffect(() => {
    async function fetchData() {
      const userTypesData = await fetchUserTypes();
      const primaryGenderIdentitiesData = await fetchPrimaryGenderIdentities();
      const mapRegionsData = await fetchMapRegions();
      const genderIdentitiesData = await fetchGenderIdentities();

      setUserTypes(userTypesData);
      setPrimaryGenderIdentities(primaryGenderIdentitiesData);
      setMapRegions(mapRegionsData);
      setGenderIdentities(genderIdentitiesData);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchUserData() {
      if (selectedUserId) {
        const userData = await getUserById(selectedUserId);
        // Setting form data based on fetched user data
        setFormData({
          userTypeID: userData.usertype_id || '',
          username: userData.username || '',
          email: userData.email || '',
          firstName: userData.firstname || '',
          lastName: userData.lastname || '',
          yearOfBirth: userData.year_of_birth ? userData.year_of_birth.toString() : '',
          primaryGenderId: userData.primary_gender_id,
          mapID: userData.map_id || '',
          postalCode: userData.postal_code || '',
          vegetable: userData.vegetable || '',
          isActive: userData.is_active || false,
          postalCodeId: userData.postal_code_id || '',
        });
        if (userData.gender_identities) {
          setSelectedGenderIdentities(userData.gender_identities.map(gi => gi.gender_identity_id));
        }
      }
    }
    fetchUserData();
  }, [selectedUserId]);

  // Update the `checkboxOptions` state based on `genderIdentities` and `selectedGenderIdentities`
  useEffect(() => {
    const options = genderIdentities.map(identity => ({
      id: identity.gender_identity_id,
      name: identity.type,
      checked: selectedGenderIdentities.includes(identity.gender_identity_id),
    }));
    setCheckboxOptions(options);
  }, [genderIdentities, selectedGenderIdentities]);

  const handleDropdownChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, selectedOption) => {
    if (name === 'username') {
      if (selectedOption) {
        setSelectedUserId(selectedOption.value);
      } else {
        setSelectedUserId(null);
        setFormData({ // Reset formData to its initial state
          userTypeID: '',
          username: '',
          email: '',
          firstName: '',
          lastName: '',
          yearOfBirth: '',
          primaryGenderId: '',
          mapID: '',
          postalCode: '',
          vegetable: '',
          isActive: false,
          postalCodeId: '',
        });
        setSelectedGenderIdentities([]);
        // Reset any other state that depends on the selected user
      }
    } else {
      // For custom dropdown components
      handleDropdownChange(name, selectedOption ? selectedOption.value : '');
    }
  };

  const handleChange = ({ target: { name, value, checked, type } }) => {
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleGenderIdentityCheckboxChange = (event, option) => {
    const updatedSelections = event.target.checked
        ? [...selectedGenderIdentities, option.id] // Add ID if checked
        : selectedGenderIdentities.filter(id => id !== option.id); // Remove ID if unchecked

    setSelectedGenderIdentities(updatedSelections);
};

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Handle the Postal Code
    const formattedPostalCode = formData.postalCode.toUpperCase().replace(/\s+/g, '');
    let postalCodeId;

    // Attempt to lookup the postal code
    const postalCodeResponse = await lookupPostalCode(formattedPostalCode);
    if (postalCodeResponse && postalCodeResponse.postal_code_id) {
      postalCodeId = postalCodeResponse.postal_code_id;
    } else {
      // If not found, add the postal code and get its ID
      const addedPostalCodeResponse = await addPostalCode(formattedPostalCode);
      if (addedPostalCodeResponse && addedPostalCodeResponse.postal_code_id) {
        postalCodeId = addedPostalCodeResponse.postal_code_id;
      } else {
        throw new Error('Failed to add postal code');
      }
    }

    // Prepare the user information for update, now including the postalCodeId
    const userInfoToUpdate = {
      ...formData,
      postalCodeId, // Include the postalCodeId obtained from the DB
    };

    // Remove the postalCode field as it's not expected by the updateUser API
    delete userInfoToUpdate.postalCode;

    // If the primary gender is updated from "Other" to "Male" or "Female",
    // remove associated gender identities
    if (formData.primaryGenderId !== 'Other') {
      // Modify userInfoToUpdate to exclude gender identities
      delete userInfoToUpdate.gender_identities;
    } else if (selectedGenderIdentities.length > 0) {
      // If the primary gender is "Other" and new gender identities are selected,
      // include these identities in the userInfoToUpdate
      userInfoToUpdate.gender_identities = selectedGenderIdentities;
    }

    // Update the user information with all fields
    const updateResponse = await updateUser(selectedUserId, userInfoToUpdate);
    console.log("Basic User Info Update Response:", updateResponse);

    // If there's a change in gender identities, update them separately
    if (formData.primaryGenderId !== 'Other' && selectedGenderIdentities.length > 0) {
      const genderUpdateResponse = await updateUserGenderIdentities(selectedUserId, selectedGenderIdentities);
      console.log("Gender Identities Update Response:", genderUpdateResponse);
    }

    // Fetch updated user data and log it
    const updatedUserData = await getUserById(selectedUserId);
    console.log("Updated User Data:", updatedUserData);

    await onAddUser();

    // Provide success feedback
    setFeedback({ message: 'User updated successfully!', type: 'success' });

    // Reset form data, selected user, and clear the feedback message after a few seconds
    setTimeout(() => {
      setFormData({
        userTypeID: '',
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        yearOfBirth: '',
        primaryGenderId: '',
        mapID: '',
        postalCode: '',
        vegetable: '',
        isActive: false,
        postalCodeId: '',
      });

      // Clear selected user and reset React Select
      setSelectedUserId(null);

      // Clear selected gender identities
      setSelectedGenderIdentities([]);

      // Optionally, reset checkboxes if necessary
      const resetCheckboxOptions = checkboxOptions.map(option => ({
        ...option,
        checked: false,
      }));
      setCheckboxOptions(resetCheckboxOptions);

      // Hide feedback message
      setFeedback({ message: '', type: '' });
    }, 5000); // Adjust the time as needed
  } catch (error) {
    console.error("Failed to update user:", error);
    setFeedback({ message: `Failed to update user: ${error.message}`, type: 'error' });
  }
};

  // Preparing user options for the dropdown
  const userOptions = Array.isArray(users) ? users.map(user => ({
    value: user.user_id,
    label: `${user.firstname} ${user.lastname} (${user.username})`,
  })) : [];

  //Filter users based on the 'filter' state
  const filteredUsers = Array.isArray(users) ? users.filter(user => {
    if (filter === 'active') return user.is_active;
    if (filter === 'archived') return !user.is_active;
    return true; // 'all' case, no filtering needed
  }) : [];

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
        options={filteredUsers.map(user => ({
          value: user.user_id,
          label: `${user.firstname} ${user.lastname} (${user.username})`,
          user: user,
        }))}
        onChange={(option) => handleSelectChange('username', option)}
        placeholder="Search by name or username"
        isClearable
        value={userOptions.find(option => option.value === selectedUserId) || null} // Ensure this line is correct
        className="mb-4"
        styles={customSelectStyles}
      />

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            id="email"
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16839B] transition duration-200"
          />
        </div>

        <div>
          <label htmlFor="userType" className="block text-sm font-medium text-gray-700">User Type</label>
          <Dropdown
            options={userTypes.map(({ usertype_id, role }) => ({ label: role, value: usertype_id }))}
            selectedValue={formData.userTypeID}
            onSelect={(value) => handleSelectChange('userTypeID', { value })}
            placeholder="Select User Type"
          />
        </div>

        <Checkbox
          title="Status"
          options={[{ id: "status", name: "Active", checked: formData.isActive }]}
          onChange={(event, option) => {
            handleChange({
              target: {
                name: "isActive",
                value: event.target.checked,
                type: 'checkbox',
              },
            });
          }}
        />

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

        <div>
          <label htmlFor="primaryGenderIdentity" className="block text-sm font-medium text-gray-700">Primary Gender Identity</label>
          <Dropdown
            options={primaryGenderIdentities.map(({ primary_gender_id, gender_name }) => ({
              label: gender_name,
              value: primary_gender_id,
            }))}
            selectedValue={formData.primaryGenderId}
            onSelect={value => handleDropdownChange('primaryGenderId', value)}
            placeholder="Select Primary Gender Identity"
          />
        </div>

        {/* Checkboxes for gender identities */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Gender Identities</label>
          <Checkbox
            title="Gender Identities"
            options={checkboxOptions}
            onChange={handleGenderIdentityCheckboxChange}
          />
        </div>

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

        <div>
          <label htmlFor="mapId" className="block text-sm font-medium text-gray-700">Place of Origin</label>
          <Dropdown
            options={mapRegions.map(({ map_id, map_area_name }) => ({
              label: map_area_name,
              value: map_id
            }))}
            selectedValue={formData.mapID}
            onSelect={(value) => handleDropdownChange('mapID', value)}
            placeholder="Select Place of Origin"
          />
        </div>

        <div>
          <label htmlFor="postalCodeId" className="block text-sm font-medium text-gray-700">Postal Code</label>
          <input
            id="postalCode"
            type="text"
            name="postalCode"
            value={formData.postalCode} // Ensure this uses postalCode, not postalCodeId
            onChange={handleChange}
            className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16839B] transition duration-200"
          />
        </div>

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

        <div className="flex justify-center">
          <Button type="submit" text="Update User" />
        </div>
            
        {/* Display feedback message */}
        {feedback.message && (
          <p className={`mt-4 text-${feedback.type === 'success' ? 'green-500' : 'red-500'}`}>
            {feedback.message}
          </p>
        )}
      </form>

    </div>
  );
};

export default UpdateUserForm;

