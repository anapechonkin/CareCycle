import React, { useState, useEffect } from 'react';
import Dropdown from './DropDown';
import Button from './Button';
import Checkbox from './Checkbox';
import { addUser } from '../api/userApi';
import { fetchPrimaryGenderIdentities, fetchUserTypes } from '../api/dropdownApi';
import { lookupPostalCode, addPostalCode } from '../api/postalCodeApi';
import { fetchGenderIdentities, addUserGenderIdentities } from '../api/genderIdentityApi';
import { fetchMapAreas, addUserMapAreas } from '../api/mapAreaApi'; // Importing the necessary API functions

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
    postalCode: '',
    vegetable: '',
    isActive: true,
    postalCodeId: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [primaryGenderIdentities, setPrimaryGenderIdentities] = useState([]);
  const [userTypes, setUserTypes] = useState([]);
  const [genderIdentities, setGenderIdentities] = useState([]);
  const [selectedGenderIdentities, setSelectedGenderIdentities] = useState([]);
  const [mapAreas, setMapAreas] = useState([]); // State for map areas

  useEffect(() => {
    const fetchData = async () => {
      try {
        setPrimaryGenderIdentities(await fetchPrimaryGenderIdentities());
        setUserTypes(await fetchUserTypes());

        const fetchedGenderIdentities = await fetchGenderIdentities();
        const checkboxOptions = fetchedGenderIdentities.map(identity => ({
          ...identity,
          id: `gender_${identity.gender_identity_id}`,
          name: identity.type,
          checked: false,
        }));
        setGenderIdentities(checkboxOptions);

        const fetchedMapAreas = await fetchMapAreas(); // Fetching map areas
        setMapAreas(fetchedMapAreas.map(area => ({
          ...area,
          id: `map_${area.map_id}`,
          name: area.map_area_name,
          checked: false,
        })));
      } catch (error) {
        console.error('Failed to fetch dropdown data:', error);
      }
    };

    fetchData();
  }, []);

  const handleGenderIdentityCheckboxChange = (event, option) => {
    const id = parseInt(option.id.replace('gender_', ''), 10);

    const updatedGenderIdentities = genderIdentities.map(identity =>
      identity.id === option.id ? { ...identity, checked: event.target.checked } : identity
    );
    setGenderIdentities(updatedGenderIdentities);

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
      const postalCodeResponse = await lookupPostalCode(formattedPostalCode);
      let postalCodeId = null;

      if (postalCodeResponse && postalCodeResponse.postal_code_id) {
        postalCodeId = postalCodeResponse.postal_code_id;
      } else {
        const addedPostalCodeResponse = await addPostalCode(formattedPostalCode);
        if (addedPostalCodeResponse && addedPostalCodeResponse.postal_code_id) {
          postalCodeId = addedPostalCodeResponse.postal_code_id;
        } else {
          throw new Error('Failed to add postal code');
        }
      }

      const formattedEmail = formData.email.trim().toLowerCase();
      if (!isValidEmail(formattedEmail)) {
        setFeedback({ message: 'Invalid email format.', type: 'error' });
        return;
      }

      const dataToSend = {
        ...formData,
        postalCode: formattedPostalCode,
        postalCodeId,
        email: formattedEmail,
      };

      const addedUser = await addUser(dataToSend);
      console.log('User added successfully:', addedUser);

      const userId = addedUser.user_id;
      if (selectedGenderIdentities.length > 0) {
        const genderIdentityResponse = await addUserGenderIdentities(userId, selectedGenderIdentities);
        console.log('Gender identities added successfully:', genderIdentityResponse);
      }

      if (mapAreas.some(area => area.checked)) { // Check if any map area is selected
        const selectedMapAreas = mapAreas.filter(area => area.checked).map(area => area.map_id);
        const mapAreaResponse = await addUserMapAreas(userId, selectedMapAreas);
        console.log('Map areas added successfully:', mapAreaResponse);
      }

      setSelectedGenderIdentities([]);
      const resetGenderIdentities = genderIdentities.map(genderIdentity => ({
        ...genderIdentity,
        checked: false
      }));
      setGenderIdentities(resetGenderIdentities);
      
      await onAddUser();
      setFeedback({ message: 'User added successfully!', type: 'success' });
      setTimeout(() => {
        setFeedback({ message: '', type: '' });
      }, 5000);

      setFormData(initialFormState);
    } catch (error) {
      console.error('Failed to add user:', error);
      setFeedback({ message: `Failed to add user: ${error.message}`, type: 'error' });

      setTimeout(() => {
        setFeedback({ message: '', type: '' });
      }, 5000);
    }
  };

  const handleMapCheckboxChange = (event, option) => {
    const id = parseInt(option.id.replace('map_', ''), 10);

    const updatedMapAreas = mapAreas.map(area =>
      area.id === option.id ? { ...area, checked: event.target.checked } : area
    );
    setMapAreas(updatedMapAreas);
  };

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
          options={primaryGenderIdentities.map(({ primary_gender_id, gender_name }) => ({ label: gender_name, value: primary_gender_id }))}
          placeholder="Select Primary Gender Identity"
          selectedValue={formData.primaryGenderId}
          onSelect={(value) => handleDropdownChange('primaryGenderId', value)}
        />
        {
          formData.primaryGenderId === 4 &&
          <Checkbox
            title="Select Gender Identities"
            options={genderIdentities}
            onChange={(event, option) => handleGenderIdentityCheckboxChange(event, option)}
          />
        }
        {/* Rendering map area checkboxes */}
        {mapAreas.length > 0 && (
          <div>
            <Checkbox
              title="Select Map Areas"
              options={mapAreas}
              onChange={(event, option) => handleMapCheckboxChange(event, option)}
            />
          </div>
        )}
        <Button type="submit" text="Add User" />
      </form>
      {feedback.message && <p className={`mt-4 text-${feedback.type === 'success' ? 'green' : 'red'}-500`}>{feedback.message}</p>}
    </div>
  );
};

export default AddUserForm;
