// LoginForm.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext"; // Adjust the import path as needed
import Button from "./Button"; // Adjust the import path as needed
import DropDown from "./DropDown"; // Adjust the import path as needed
import { useTranslation } from 'react-i18next';

const LoginForm = () => {
  const { setUserType } = useUser();
  const [localUserType, setLocalUserType] = useState('');
  const { t, i18n } = useTranslation('loginForm');
  const navigate = useNavigate();

  const handleUserTypeChange = (selectedOption) => {
    setLocalUserType(selectedOption); 
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setUserType(localUserType || 'admin'); // Hardcode to 'Admin' or use the selected value
    console.log('User Type set to:', localUserType || 'admin');
    // Here, add your authentication logic
    navigate('/dashboard'); // Navigate after successful login
  };

  const handleForgotPasswordClick = (event) => {
    event.preventDefault();
    console.log("Forgot Password clicked");
    // Placeholder for forgot password functionality
  };

  const isMobile = window.innerWidth < 768;

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
          options={[t('loginForm:Admin'), t('loginForm:Volunteer'), t('loginForm:CA/Employee')]}
          placeholder={t('loginForm:userTypePlaceholder')}
          selectedOption={localUserType}
          onSelect={handleUserTypeChange}
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
