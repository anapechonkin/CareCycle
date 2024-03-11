import React, { useState, useEffect } from 'react';
import Dropdown from './DropDown';
import Button from './Button';
import Checkbox from './Checkbox';
import { addUser } from '../api/userApi';
import { fetchPrimaryGenderIdentities, fetchMapRegions, fetchUserTypes } from '../api/dropdownApi';
import { lookupPostalCode, addPostalCode } from '../api/postalCodeApi';
import { fetchGenderIdentities, addUserGenderIdentities } from '../api/genderIdentityApi';

const AddUserForm = ({ onAddUser }) => {
  const initialFormState = {
    userTypeID: '',
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    yearOfBirth: '',
    primaryGenderId: '',
    mapID: '',
    postalCode: '',
    vegetable: '',
    isActive: true,
    postalCodeId: '', // Keep postalCodeId in the initial state
  };

  const [formData, setFormData] = useState(initialFormState);
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [primaryGenderIdentities, setPrimaryGenderIdentities] = useState([]);
  const [mapRegions, setMapRegions] = useState([]);
  const [userTypes, setUserTypes] = useState([]);
  const [genderIdentities, setGenderIdentities] = useState([]);
  const [selectedGenderIdentities, setSelectedGenderIdentities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setPrimaryGenderIdentities(await fetchPrimaryGenderIdentities());
        setMapRegions(await fetchMapRegions());
        setUserTypes(await fetchUserTypes());

        const fetchedGenderIdentities = await fetchGenderIdentities();
        const checkboxOptions = fetchedGenderIdentities.map(identity => ({
          ...identity,
          id: `gender_${identity.gender_identity_id}`, // Ensure each ID is unique
          name: identity.type,
          checked: false,
        }));
        setGenderIdentities(checkboxOptions);
      } catch (error) {
        console.error('Failed to fetch dropdown data:', error);
      }
    };

    fetchData();
  }, []);

  const handleGenderIdentityCheckboxChange = (event, option) => {
    // Extract the numeric ID from the option's ID
    const id = parseInt(option.id.replace('gender_', ''), 10);
    
    // Update the checked state of the option
    const updatedGenderIdentities = genderIdentities.map(identity =>
      identity.id === option.id ? { ...identity, checked: event.target.checked } : identity
    );
    setGenderIdentities(updatedGenderIdentities);
    
    // Update selectedGenderIdentities state
    if (event.target.checked) {
      setSelectedGenderIdentities(prev => [...prev, id]);
    } else {
      setSelectedGenderIdentities(prev => prev.filter(selectedId => selectedId !== id));
    }
  };
  
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

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
        const formattedPostalCode = formData.postalCode.toUpperCase().replace(/\s+/g, '');
        
        // Attempt to lookup the postal code
        const postalCodeResponse = await lookupPostalCode(formattedPostalCode);
        
        let postalCodeId = null;
    
        // If the postal code is found
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

        // Format the email: trim and convert to lowercase
        const formattedEmail = formData.email.trim().toLowerCase();
        
        // Validate the formatted email
        if (!isValidEmail(formattedEmail)) {
          setFeedback({ message: 'Invalid email format.', type: 'error' });
          return; // Stop the form submission process
        }
    
        // Prepare the data for user addition, including the postal code ID
        const dataToSend = {
            ...formData,
            postalCode: formattedPostalCode, // Use the formatted postal code
            postalCodeId, // Add the received postalCodeId to the user data
            email: formattedEmail, // Use the formatted email
        };
    
        // Attempt to add the user with the updated data
        const addedUser = await addUser(dataToSend);
        console.log('User added successfully:', addedUser);

        // After successfully adding the user and retrieving their ID
        const userId = addedUser.user_id; // Adjust based on the actual property name in your response
        if (selectedGenderIdentities.length > 0) {
            const genderIdentityResponse = await addUserGenderIdentities(userId, selectedGenderIdentities);
            console.log('Gender identities added successfully:', genderIdentityResponse);
        }
  
        // Reset the selectedGenderIdentities
        setSelectedGenderIdentities([]);

        // Reset genderIdentities to uncheck all checkboxes
        const resetGenderIdentities = genderIdentities.map(genderIdentity => ({
            ...genderIdentity,
            checked: false
        }));
        setGenderIdentities(resetGenderIdentities); 
       
        await onAddUser(); // Call the handler to update the list of users
        // Show success feedback message
        setFeedback({ message: 'User added successfully!', type: 'success' });
    
        setTimeout(() => {
            // Clear feedback message after timeout
            setFeedback({ message: '', type: '' });
        }, 5000);
    
        // Reset form data to initial state after successful user addition
        setFormData(initialFormState);
    } catch (error) {
        console.error('Failed to add user:', error);
        setFeedback({ message: `Failed to add user: ${error.message}`, type: 'error' });
    
        setTimeout(() => {
            setFeedback({ message: '', type: '' });
        }, 5000);
    }
};
  
  // Restoring the renderTextInput function
  const renderTextInput = (name, placeholder, value, isPassword = false) => (
    <input
      type={isPassword ? "password" : "text"}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16839B] transition duration-200"
    />
  );

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
        {renderTextInput("email", "Email", formData.email)}
        {renderTextInput("password", "Password", formData.password, true)}
        {renderTextInput("firstName", "First Name", formData.firstName)}
        {renderTextInput("lastName", "Last Name", formData.lastName)}
        {renderTextInput("yearOfBirth", "Year of Birth (YYYY)", formData.yearOfBirth)}
        {renderTextInput("postalCode", "Postal Code", formData.postalCode)}
        {renderTextInput("vegetable", "Vegetable", formData.vegetable)}
        <Dropdown
          options={mapRegions.map(({ map_id, map_area_name }) => ({ label: map_area_name, value: map_id }))}
          placeholder="Select Map Region"
          selectedValue={formData.mapID}
          onSelect={(value) => handleDropdownChange('mapID', value)}
        />
        <Dropdown
          options={primaryGenderIdentities.map(({ primary_gender_id, gender_name }) => ({ label: gender_name, value: primary_gender_id }))}
          placeholder="Select Primary Gender Identity"
          selectedValue={formData.primaryGenderId}
          onSelect={(value) => handleDropdownChange('primaryGenderId', value)}
        />
        {
          formData.primaryGenderId === 4 && // Use the actual value for "other"
          <Checkbox
            title="Select Gender Identities"
            options={genderIdentities}
            onChange={(event, option) => handleGenderIdentityCheckboxChange(event, option)}
          />
        }
        <Button type="submit" text="Add User" />
      </form>
      {feedback.message && <p className={`mt-4 text-${feedback.type === 'success' ? 'green' : 'red'}-500`}>{feedback.message}</p>}
    </div>
  );
};

export default AddUserForm;
