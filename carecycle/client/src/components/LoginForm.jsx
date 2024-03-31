// LoginForm.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext"; // Adjust the import path as needed
import Button from "./Button"; // Adjust the import path as needed
import DropDown from "./DropDown"; // Adjust the import path as needed
import { useTranslation } from 'react-i18next';
import { fetchUserTypes } from '../api/dropdownApi';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    userTypeID: '', 
    username: '',
    password: '',
    // Add other form fields as necessary
  });
  
  const { setUserType } = useUser();
  const [localUserType, setLocalUserType] = useState('');
  const [userTypes, setUserTypes] = useState([]); 
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation('loginForm');
  const navigate = useNavigate();

  // Fetch user types from the API
  useEffect(() => {
    let isMounted = true;
    const loadUserTypes = async () => {
      try {
        const types = await fetchUserTypes();
        if (isMounted) {
          setUserTypes(types);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user types:", error);
        if (isMounted) setLoading(false);
      }
    };
  
    loadUserTypes();
    return () => {
      isMounted = false;
    };
  }, []);  

  useEffect(() => {
    console.log("Checking generated translation keys:");
    userTypes.forEach(type => {
      console.log(`Generated key for ${type.role}: userTypes.${type.role.replace('/', '_')}`);
    });
  }, [userTypes, t]); 

  const handleDropdownChange = (name, value) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  console.log("Manual test for CA_Employee translation:", t('userTypes.CA_Employee'));
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await setUserType(localUserType || 'admin');
      console.log('User Type set to:', localUserType || 'admin');
      // Ensure navigation only occurs after the state is updated
      navigate('/dashboard');
    } catch (error) {
      console.error("Error during login:", error);
      // Handle error (e.g., showing an error message to the user)
    }
  };

  const handleForgotPasswordClick = (event) => {
    event.preventDefault();
    console.log("Forgot Password clicked");
    // Placeholder for forgot password functionality
  };

  const isMobile = window.innerWidth < 768;

  if (loading) {
    return <div>Loading...</div>; // Render loading state
  }

  return (
    <form
      key={i18n.language} 
      className="flex flex-col items-center justify-center min-h-screen"
      onSubmit={handleSubmit}
      style={{ marginTop: isMobile ? '-15rem' : '0' }}
    >
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full" style={{ marginTop: isMobile ? '-3rem' : '0' }}>
        <div className="absolute top-5 right-5"> {/* Language toggle position */}
          <button
            type="button"
            className='px-4 py-2 text-sm text-white bg-[#16839B] rounded-full hover:bg-[#106680] transition-colors'
            onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en')}>
            {i18n.language.toUpperCase()}
          </button>
        </div>
        <h2 className="text-2xl font-medium text-gray-700 mb-4 text-center">{t('loginForm:loginTitle')}</h2>
        <DropDown
          options={userTypes.map(type => ({
            // Replace or adjust the role string to match the new key format
            label: t(`userTypes.${type.role.replace('/', '_')}`), 
            value: type.usertype_id
          }))}
          placeholder={t('loginForm:userTypePlaceholder')}
          selectedValue={formData.userType}
          onSelect={(value) => handleDropdownChange('userType', value)}
        />
        <input
          type="text"
          placeholder={t('loginForm:usernamePlaceholder')}
          name="username"
          className="w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring focus:border-blue-300 mb-4 mt-4"
        />
        <input
          type="password"
          placeholder={t('loginForm:passwordPlaceholder')} 
          name="password"
          className="w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring focus:border-blue-300 mb-4"
        />
        <Button type="submit" text={t('loginForm:loginButton')} />
        <a href="#" onClick={handleForgotPasswordClick} className="mt-4 text-center text-sm font-semibold" style={{ color: '#16839B' }}>
        {t('loginForm:forgotPassword')}
        </a>
      </div>
    </form>
  );
};

export default LoginForm;
