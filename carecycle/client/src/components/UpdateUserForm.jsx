import React, { useState, useEffect } from "react";
import Select from 'react-select'; 
import Button from "./Button";
import Checkbox from "./Checkbox";
import Dropdown from "./DropDown";
import { fetchUserTypes, fetchPrimaryGenderIdentities } from "../api/dropdownApi";
import { updateUser, getUserById } from "../api/userApi";
import { fetchGenderIdentities, updateUserGenderIdentities } from "../api/genderIdentityApi";
import { lookupPostalCode, addPostalCode } from '../api/postalCodeApi';
import { fetchMapAreas, updateUserMapAreas } from "../api/mapAreaApi";
import { useTranslation } from "react-i18next";

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

  const { t } = useTranslation('updateUserForm');
  const [filter, setFilter] = useState('all');
  const [userTypes, setUserTypes] = useState([]);
  const [primaryGenderIdentities, setPrimaryGenderIdentities] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [genderIdentities, setGenderIdentities] = useState([]);
  const [selectedGenderIdentities, setSelectedGenderIdentities] = useState([]);
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [mapAreas, setMapAreas] = useState([]);
  const [selectedMapAreas, setSelectedMapAreas] = useState([]);
  const [genderCheckboxOptions, setGenderCheckboxOptions] = useState([]);
  const [mapAreaCheckboxOptions, setMapAreaCheckboxOptions] = useState([]);
  const PREFER_NOT_TO_ANSWER_GENDER_ID = 1; 
  const PREFER_NOT_TO_ANSWER_MAP_ID = 1;
  
  useEffect(() => {
    async function fetchData() {
      const userTypesData = await fetchUserTypes();
      const primaryGenderIdentitiesData = await fetchPrimaryGenderIdentities();
      const mapRegionsData = await fetchMapAreas();
      const genderIdentitiesData = await fetchGenderIdentities();

      setUserTypes(userTypesData);
      setPrimaryGenderIdentities(primaryGenderIdentitiesData);
      setMapAreas(mapRegionsData);
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
          primaryGenderId: userData.primary_gender_id || '',
          mapID: userData.map_id || '',
          postalCode: userData.postal_code || '',
          vegetable: userData.vegetable || '',
          isActive: userData.is_active || false,
          postalCodeId: userData.postal_code_id || '',
        });
        if (userData.gender_identities) {
          setSelectedGenderIdentities(userData.gender_identities.map(gi => gi.gender_identity_id));
        }
        if (userData.map_areas) {
          setSelectedMapAreas(userData.map_areas.map(area => area.map_id));
        }
      }
    }
    fetchUserData();
  }, [selectedUserId]);

  // Update the `checkboxOptions` state based on `genderIdentities` and `mapAreas`
  useEffect(() => {
    const genderOptions = genderIdentities.map(identity => ({
      ...identity,
      id: `gender-${identity.gender_identity_id}`, // Prefixing 'gender-'
      name: t(`updateUserForm:genderIdentities.${identity.type}`),
      checked: selectedGenderIdentities.includes(identity.gender_identity_id),
    }));
    setGenderCheckboxOptions(genderOptions);
  
    const mapOptions = mapAreas.map(area => ({
      ...area,
      id: `map-${area.map_id}`, // Prefixing 'map-'
      name: t(`updateUserForm:mapAreas.${area.map_area_name}`),
      checked: selectedMapAreas.includes(area.map_id),
    }));
    setMapAreaCheckboxOptions(mapOptions);
  }, [t, genderIdentities, selectedGenderIdentities, mapAreas, selectedMapAreas]);

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
        setSelectedMapAreas([]);
        // Reset any other state that depends on the selected user
      }
    } else {
      // For custom dropdown components
      handleDropdownChange(name, selectedOption ? selectedOption.value : '');
    }
  };

  const handleChange = ({ target: { name, value, checked, type } }) => {
    console.log(`Before change:`, { ...formData }); // Log current state before change
    
    setFormData(prev => {
      const newState = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };
      
      console.log(`After change:`, { ...newState }); // Log what the new state will be
      return newState;
    });
  };  

  const handleGenderIdentityCheckboxChange = (event, option) => {
    const id = parseInt(option.id.replace('gender-', ''), 10); // Ensure correct parsing
  
    // Handling "Prefer Not to Answer" selection
    if (id === PREFER_NOT_TO_ANSWER_GENDER_ID) {
      if (event.target.checked) {
        setSelectedGenderIdentities([id]);
        setGenderCheckboxOptions(genderCheckboxOptions.map(opt => ({
          ...opt,
          checked: opt.id === `gender-${id}`,
        })));
      } else {
        setSelectedGenderIdentities([]);
        setGenderCheckboxOptions(genderCheckboxOptions.map(opt => ({
          ...opt,
          checked: false,
        })));
      }
    } else {
      const isPNASelected = selectedGenderIdentities.includes(PREFER_NOT_TO_ANSWER_GENDER_ID);
      const isSelected = selectedGenderIdentities.includes(id);
      if (event.target.checked && isPNASelected) {
        // If PNA is selected and user selects another, remove PNA and add new selection
        setSelectedGenderIdentities([id]);
      } else if (event.target.checked && !isSelected) {
        // Add new selection without PNA logic
        setSelectedGenderIdentities(prev => [...prev.filter(identityId => identityId !== PREFER_NOT_TO_ANSWER_GENDER_ID), id]);
      } else {
        // Remove selection
        setSelectedGenderIdentities(prev => prev.filter(identityId => identityId !== id));
      }
      
      // Update checkboxes
      setGenderCheckboxOptions(genderCheckboxOptions.map(opt => ({
        ...opt,
        checked: selectedGenderIdentities.includes(parseInt(opt.id.replace('gender-', ''), 10)),
      })));
    }
  };
  

  const handleMapAreasCheckboxesChange = (event, option) => {
    const id = parseInt(option.id.replace('map-', ''), 10); // Ensure correct parsing
  
    if (id === PREFER_NOT_TO_ANSWER_MAP_ID) {
      if (event.target.checked) {
        setSelectedMapAreas([id]);
        setMapAreaCheckboxOptions(mapAreaCheckboxOptions.map(opt => ({
          ...opt,
          checked: opt.id === `map-${id}`,
        })));
      } else {
        setSelectedMapAreas([]);
        setMapAreaCheckboxOptions(mapAreaCheckboxOptions.map(opt => ({
          ...opt,
          checked: false,
        })));
      }
    } else {
      const isPNASelected = selectedMapAreas.includes(PREFER_NOT_TO_ANSWER_MAP_ID);
      const isSelected = selectedMapAreas.includes(id);
      if (event.target.checked && isPNASelected) {
        // Remove PNA and add new selection
        setSelectedMapAreas([id]);
      } else if (event.target.checked && !isSelected) {
        // Add new selection without PNA logic
        setSelectedMapAreas(prev => [...prev.filter(mapId => mapId !== PREFER_NOT_TO_ANSWER_MAP_ID), id]);
      } else {
        // Remove selection
        setSelectedMapAreas(prev => prev.filter(mapId => mapId !== id));
      }
  
      // Update checkboxes
      setMapAreaCheckboxOptions(mapAreaCheckboxOptions.map(opt => ({
        ...opt,
        checked: selectedMapAreas.includes(parseInt(opt.id.replace('map-', ''), 10)),
      })));
    }
  };
  
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Normalize and validate the postal code.
      const formattedPostalCode = formData.postalCode.toUpperCase().replace(/\s+/g, '');
      let postalCodeId = null;
  
      const postalCodeResponse = await lookupPostalCode(formattedPostalCode);
      if (postalCodeResponse && postalCodeResponse.postal_code_id) {
        postalCodeId = postalCodeResponse.postal_code_id;
      } else {
        const addedPostalCodeResponse = await addPostalCode(formattedPostalCode);
        if (!addedPostalCodeResponse || !addedPostalCodeResponse.postal_code_id) {
          throw new Error('Failed to add postal code');
        }
        postalCodeId = addedPostalCodeResponse.postal_code_id;
      }
  
      // Validate the email format.
      const formattedEmail = formData.email.trim().toLowerCase();
      if (!isValidEmail(formattedEmail)) {
        setFeedback({ message: t('updateUserForm:feedbackMessages.invalidEmailFormat'), type: 'error' });        return;
      }
  
      // Prepare the data for the user update.
      const userInfoToUpdate = {
        ...formData,
        postalCodeId,
        email: formattedEmail,
      };
  
      // Update the user information.
      const updateResponse = await updateUser(selectedUserId, userInfoToUpdate);
  
      // Log updated user info to the console
      console.log('Updated User Info:', userInfoToUpdate);

      // Handle gender identities and map areas updates only if needed.
      if (formData.primaryGenderId === 4 && selectedGenderIdentities.length > 0) {
        await updateUserGenderIdentities(selectedUserId, selectedGenderIdentities);
      }
  
      if (selectedMapAreas.length > 0) {
        await updateUserMapAreas(selectedUserId, selectedMapAreas);
      }

      // Map selected IDs to their detailed objects for logging
      const detailedGenderIdentities = selectedGenderIdentities.map(id => 
        genderIdentities.find(identity => identity.gender_identity_id === id)
      );
      const detailedMapAreas = selectedMapAreas.map(id => 
        mapAreas.find(area => area.map_id === id)
      );
      console.log('Updated Gender Identities:', detailedGenderIdentities);
      console.log('Updated Map Areas:', detailedMapAreas);
  
      // Provide success feedback and potentially update user list or other parent component states
      setFeedback({ message: t('updateUserForm:feedbackMessages.userUpdatedSuccess'), type: 'success' });      if (typeof onAddUser === 'function') {
        onAddUser();
      }
  
      // Reset form data and clear selections
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
      setSelectedUserId('');
      setSelectedGenderIdentities([]);
      setSelectedMapAreas([]);
  
      // Clear the feedback message after some time
      setTimeout(() => {
        setFeedback({ message: '', type: '' });
      }, 5000);
    } catch (error) {
      console.error("Failed to update user:", error);
      setFeedback({ message: `${t('updateUserForm:feedbackMessages.userUpdateError')}: ${error.message}`, type: 'error' });      // Consider if you need to reset form state or perform other cleanup here in case of an error
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

  // Only display the notice if a user is selected and the user is archived
  const archivedNotice = selectedUserId && !formData.isActive ? (
    <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-4" role="alert">
      <p>{t('updateUserForm:archivedNotice')}</p>
    </div>
  ) : null;

  return (
    <div className="bg-white shadow rounded-lg p-8">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">{t('updateUserForm:formTitle')}</h2>
      {/* Notice for Archived Users */}
      {archivedNotice}
      <div className="flex justify-center gap-4 mb-4">
        {['all', 'active', 'archived'].map(filterOption => (
          <button
            key={filterOption}
            onClick={() => setFilter(filterOption)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === filterOption ? 'bg-custom-teal text-white hover:bg-[#0f6a8b]' : 'bg-white text-gray-800 hover:bg-gray-100'
            }`}
          >
            {t(`updateUserForm:filters.${filterOption}`)}
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
        placeholder={t('updateUserForm:placeholders.searchByNameOrUsername')}
        isClearable
        value={userOptions.find(option => option.value === selectedUserId) || null} // Ensure this line is correct
        className="mb-4"
        styles={customSelectStyles}
        noOptionsMessage={() => t('updateUserForm:noUsersFound')} 
      />
  
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">{t('updateUserForm:labels.username')}</label>
          <input
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            disabled={selectedUserId && !formData.isActive}
            className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16839B] transition duration-200"
          />
        </div>
  
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t('updateUserForm:labels.email')}</label>
          <input
            id="email"
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={selectedUserId && !formData.isActive}
            className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16839B] transition duration-200"
          />
        </div>
  
        <div>
          <label htmlFor="userType" className="block text-sm font-medium text-gray-700">{t('updateUserForm:labels.userType')}</label>
          <Dropdown
            options={userTypes.map(({ usertype_id, role }) => ({
              label: t(`updateUserForm:userTypes.${role}`), // Translate the role
              value: usertype_id,
            }))}
            selectedValue={formData.userTypeID}
            onSelect={(value) => handleSelectChange('userTypeID', { value })}
            placeholder={t('updateUserForm:placeholders.selectUserType')}
            disabled={selectedUserId && !formData.isActive}
          />
        </div>
  
        <Checkbox
          title={t('updateUserForm:labels.status')}
          options={[{ id: "status", name: t('updateUserForm:filters.active'), checked: formData.isActive }]}
          onChange={(event, option) => {
            handleChange({
              target: {
                name: "isActive",
                checked: event.target.checked, // Make sure this is correctly capturing the checkbox's checked state
                type: 'checkbox',
              },
            });
          }}
        />
  
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">{t('updateUserForm:labels.firstName')}</label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            disabled={selectedUserId && !formData.isActive}
            className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16839B] transition duration-200"
          />
        </div>
  
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">{t('updateUserForm:labels.lastName')}</label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            disabled={selectedUserId && !formData.isActive}
            className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16839B] transition duration-200"
          />
        </div>
  
        <div>
          <label htmlFor="primaryGenderIdentity" className="block text-sm font-medium text-gray-700">{t('updateUserForm:labels.primaryGender')}</label>
          <Dropdown
            options={primaryGenderIdentities.map(({ primary_gender_id, gender_name }) => ({
              label: t(`updateUserForm:primaryGenders.${gender_name}`),
              value: primary_gender_id,
            }))}
            selectedValue={formData.primaryGenderId}
            onSelect={value => handleDropdownChange('primaryGenderId', value)}
            placeholder={t('updateUserForm:placeholders.selectPrimaryGender')}
            disabled={selectedUserId && !formData.isActive}
          />
        </div>
  
        {/* Checkboxes for gender identities */}
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('updateUserForm:placeholders.selectGenderIdentities')}</label>
          <Checkbox
            title={t('updateUserForm:labels.genderIdentities')}
            options={genderCheckboxOptions}
            onChange={handleGenderIdentityCheckboxChange}
            disabled={selectedUserId && !formData.isActive}
          />
        </div>
  
        <div>
          <label htmlFor="yearOfBirth" className="block text-sm font-medium text-gray-700">{t('updateUserForm:labels.yearOfBirth')}</label>
          <input
            id="yearOfBirth"
            type="text"
            name="yearOfBirth"
            value={formData.yearOfBirth}
            onChange={handleChange}
            disabled={selectedUserId && !formData.isActive}
            className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16839B] transition duration-200"
          />
        </div>
  
        {/* Checkboxes for map areas */}
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('updateUserForm:placeholders.selectMapAreas')}</label>
          <Checkbox
            title={t('updateUserForm:labels.mapAreas')}
            options={mapAreaCheckboxOptions}
            onChange={handleMapAreasCheckboxesChange}
            disabled={selectedUserId && !formData.isActive}
          />
        </div>
  
        <div>
          <label htmlFor="postalCodeId" className="block text-sm font-medium text-gray-700">{t('updateUserForm:labels.postalCode')}</label>
          <input
            id="postalCode"
            type="text"
            name="postalCode"
            value={formData.postalCode} // Ensure this uses postalCode, not postalCodeId
            onChange={handleChange}
            disabled={selectedUserId && !formData.isActive}
            className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16839B] transition duration-200"
          />
        </div>
  
        <div>
          <label htmlFor="vegetable" className="block text-sm font-medium text-gray-700">{t('updateUserForm:labels.vegetable')}</label>
          <input
            id="vegetable"
            type="text"
            name="vegetable"
            value={formData.vegetable}
            onChange={handleChange}
            disabled={selectedUserId && !formData.isActive}
            className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16839B] transition duration-200"
          />
        </div>
  
        <div className="flex justify-center">
          <Button type="submit" text={t('updateUserForm:buttonText')}/>
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

