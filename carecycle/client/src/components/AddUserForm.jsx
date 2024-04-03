import React, { useState, useEffect } from 'react';
import Dropdown from './DropDown';
import Button from './Button';
import Checkbox from './Checkbox';
import { addUser } from '../api/userApi';
import { fetchPrimaryGenderIdentities, fetchUserTypes } from '../api/dropdownApi';
import { lookupPostalCode, addPostalCode } from '../api/postalCodeApi';
import { fetchGenderIdentities, addUserGenderIdentities } from '../api/genderIdentityApi';
import { fetchMapAreas, addUserMapAreas } from '../api/mapAreaApi'; // Importing the necessary API functions
import { useTranslation } from 'react-i18next';

const AddUserForm = ({ onAddUser }) => {
  const { t } = useTranslation('addUserForm');
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
          name: t(`addUserForm:genderIdentities.${identity.type}`),
          checked: false,
        }));
        setGenderIdentities(checkboxOptions);

        const fetchedMapAreas = await fetchMapAreas(); // Fetching map areas
        setMapAreas(fetchedMapAreas.map(area => ({
          ...area,
          id: `map_${area.map_id}`,
          name: t(`addUserForm:mapAreas.${area.map_area_name}`),
          checked: false,
        })));
      } catch (error) {
        console.error('Failed to fetch dropdown data:', error);
      }
    };

    fetchData();
  }, [t]);

const PREFER_NOT_TO_ANSWER_GENDER_ID = 1;

const handleGenderIdentityCheckboxChange = (event, option) => {
  const id = parseInt(option.id.replace('gender_', ''), 10);

  if (id === PREFER_NOT_TO_ANSWER_GENDER_ID) {
    if (event.target.checked) {
      // If "Prefer Not to Answer" is selected, clear all other selections
      setSelectedGenderIdentities([id]);
      setGenderIdentities(genderIdentities.map(identity => ({
        ...identity,
        checked: identity.gender_identity_id === PREFER_NOT_TO_ANSWER_GENDER_ID,
      })));
    } else {
      // Allow user to deselect "Prefer Not to Answer"
      setSelectedGenderIdentities([]);
      setGenderIdentities(genderIdentities.map(identity => ({
        ...identity,
        checked: false,
      })));
    }
  } else {
    if (event.target.checked) {
      // Deselect "Prefer Not to Answer" if other options are selected
      setSelectedGenderIdentities(prev => [
        ...prev.filter(identityId => identityId !== PREFER_NOT_TO_ANSWER_GENDER_ID),
        id
      ]);
      setGenderIdentities(genderIdentities.map(identity => {
        if (identity.gender_identity_id === id) {
          return { ...identity, checked: true };
        } else if (identity.gender_identity_id === PREFER_NOT_TO_ANSWER_GENDER_ID) {
          return { ...identity, checked: false };
        }
        return identity;
      }));
    } else {
      // Simply remove the deselected ID from selections
      setSelectedGenderIdentities(prev => prev.filter(identityId => identityId !== id));
      setGenderIdentities(genderIdentities.map(identity => ({
        ...identity,
        checked: identity.gender_identity_id === id ? false : identity.checked,
      })));
    }
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
  
      // Clear map areas
      setMapAreas([]);
      const resetMapAreas = mapAreas.map(area => ({
        ...area,
        checked: false
      }));
      setMapAreas(resetMapAreas);
  
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

  const PREFER_NOT_TO_ANSWER_MAP_ID = 1; 

  const handleMapCheckboxChange = (event, option) => {
    const id = parseInt(option.id.replace('map_', ''), 10);
  
    if (id === PREFER_NOT_TO_ANSWER_MAP_ID) {
      if (event.target.checked) {
        // If "Prefer Not to Answer" is selected, deselect all others and only keep this option
        setMapAreas(mapAreas.map(area => ({
          ...area,
          checked: area.map_id === PREFER_NOT_TO_ANSWER_MAP_ID,
        })));
      } else {
        // Allow user to deselect "Prefer Not to Answer" and clear all selections
        setMapAreas(mapAreas.map(area => ({
          ...area,
          checked: false,
        })));
      }
    } else {
      if (event.target.checked) {
        // Deselect "Prefer Not to Answer" if other options are selected and keep the current selection
        setMapAreas(mapAreas.map(area => {
          if (area.map_id === id) {
            return { ...area, checked: true };
          } else if (area.map_id === PREFER_NOT_TO_ANSWER_MAP_ID) {
            return { ...area, checked: false };
          }
          return area;
        }));
      } else {
        // Simply remove the deselected ID from selections
        setMapAreas(mapAreas.map(area => ({
          ...area,
          checked: area.map_id === id ? false : area.checked,
        })));
      }
    }
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
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">{t('addUserForm:formTitle')}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Dropdown
          options={userTypes.map(({ usertype_id, role }) => ({
            label: t(`addUserForm:userTypes.${role.toLowerCase()}`), // Assuming your translation keys match the roles
            value: usertype_id
          }))}
          placeholder={t('addUserForm:placeholders.selectUserType')}
          selectedValue={formData.userTypeID}
          onSelect={(value) => handleDropdownChange('userTypeID', value)}
        />
        {renderTextInput("username", t('placeholders.enterUsername'), formData.username)}
        {renderTextInput("email", t('placeholders.enterEmail'), formData.email)}
        {renderTextInput("password", t('placeholders.enterPassword'), formData.password, true)}
        {renderTextInput("firstName", t('placeholders.enterFirstName'), formData.firstName)}
        {renderTextInput("lastName", t('placeholders.enterLastName'), formData.lastName)}
        {renderTextInput("yearOfBirth", t('placeholders.enterYearOfBirth'), formData.yearOfBirth)}
        {renderTextInput("postalCode", t('placeholders.enterPostalCode'), formData.postalCode)}
        {renderTextInput("vegetable", t('placeholders.enterVegetable'), formData.vegetable)}
        <Dropdown
          options={primaryGenderIdentities.map(({ primary_gender_id, gender_name }) => ({ label: t(`addUserForm:primaryGenders.${gender_name.toLowerCase()}`), value: primary_gender_id }))}
          placeholder={t('addUserForm:placeholders.selectPrimaryGender')}
          selectedValue={formData.primaryGenderId}
          onSelect={(value) => handleDropdownChange('primaryGenderId', value)}
        />
        {
          formData.primaryGenderId === 4 &&
          <Checkbox
            title={t('addUserForm:labels.genderIdentities')}
            options={genderIdentities}
            onChange={(event, option) => handleGenderIdentityCheckboxChange(event, option)}
          />
        }
        {/* Rendering map area checkboxes */}
        {mapAreas.length > 0 && (
          <div>
            <Checkbox
              title={t('addUserForm:labels.mapAreas')}
              options={mapAreas}
              onChange={(event, option) => handleMapCheckboxChange(event, option)}
            />
          </div>
        )}
        <Button type="submit" text={t('addUserForm:buttonText')} />
      </form>
      {feedback.message && <p className={`mt-4 text-${feedback.type === 'success' ? 'green' : 'red'}-500`}>{feedback.message}</p>}
    </div>
  );
};

export default AddUserForm;
