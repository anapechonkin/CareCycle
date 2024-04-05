import React, { useState, useEffect, startTransition } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext"; // Adjust the import path as needed
import Button from "./Button"; // Adjust the import path as needed
import DropDown from "./DropDown"; // Adjust the import path as needed
import { useTranslation } from 'react-i18next';
import { fetchUserTypes } from '../api/dropdownApi';
import { login } from '../api/loginApi';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    userTypeID: '', 
    username: '',
    password: '',
    // Add other form fields as necessary
  });
  
  const { setUserType, setIsAuthenticated } = useUser();
  //const [localUserType, setLocalUserType] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userTypes, setUserTypes] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false); 
  const [loginSuccess, setLoginSuccess] = useState('');
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

  // const handleDropdownChange = (name, value) => {
  //   setFormData(prevFormData => ({
  //     ...prevFormData,
  //     [name]: value,
  //   }));
  // };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoggingIn(true); // Indicate login is in process
    setLoginError(''); // Reset error message
  
    const credentials = {
      username: formData.username,
      password: formData.password,
    };
  
    try {
      const { token, userId, role } = await login(credentials);
  
      // Use startTransition for the state update if needed
      startTransition(() => {
        localStorage.setItem('token', token);
        // Optionally store userId and role if needed
        localStorage.setItem('userId', userId);
        localStorage.setItem('role', role);
        setIsAuthenticated(true); // Mark the user as authenticated
      });

      // Find the role name from userTypes or a predefined object
    const roleName = userTypes.find(type => type.usertype_id === role)?.role || 'Unknown Role';

    console.log("User authenticated successfully:", { userId, userType: roleName, username: formData.username });
    
      // Navigate to the dashboard or another route
      navigate('/dashboard'); // Adjust as per your routing setup
  
      // Display success message for a short duration, then clear form and message
      setLoginSuccess('Login successful!');
      setTimeout(() => {
        setLoginSuccess('');
        setFormData({
          userTypeID: '',
          username: '',
          password: '',
        });
      }, 3000); // Adjust time as needed
  
    } catch (error) {
      console.error("Login attempt failed:", error.message);
      setLoginError('Login failed. Please check your credentials.'); // Update user-facing error message
      setIsLoggingIn(false); // Reset login process indicator
  
      // Clear form fields and error message after a short delay
      setTimeout(() => {
        setLoginError('');
        setFormData({
          userTypeID: '', 
          username: '',
          password: '',
        });
      }, 3000); // Adjust time as needed
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
        {/* <DropDown
          options={userTypes.map(type => ({
            // Replace or adjust the role string to match the new key format
            label: t(`loginForm:userTypes.${type.role.replace('/', '_')}`), 
            value: type.usertype_id
          }))}
          placeholder={t('loginForm:userTypePlaceholder')}
          selectedValue={formData.userType}
          onSelect={(value) => handleDropdownChange('userType', value)}
        /> */}
        <input
          type="text"
          placeholder={t('loginForm:usernamePlaceholder')}
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring focus:border-blue-300 mb-4 mt-4"
        />
        <div className="relative w-full flex items-center">
  <input
    type={showPassword ? "text" : "password"}
    placeholder={t('loginForm:passwordPlaceholder')}
    name="password"
    value={formData.password}
    onChange={handleInputChange}
    className="w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring focus:border-blue-300"
    style={{ paddingRight: '40px' }} // Adjust the right padding to make room for the icon
  />
  <button
    onClick={toggleShowPassword}
    type="button"
    className="absolute right-0 pr-3 flex items-center text-sm leading-5 h-full"
    style={{ marginRight: '10px' }} // Adjust the margin if needed to align the icon inside the input
  >
     <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} className="text-gray-700" />
  </button>
</div>
        <Button type="submit" text={t('loginForm:loginButton')} />
        <a href="#" onClick={handleForgotPasswordClick} className="mt-4 text-center text-sm font-semibold" style={{ color: '#16839B' }}>
        {t('loginForm:forgotPassword')}
        </a>
      </div>
      {/* Render login error message if it exists */}
      {loginError && <p className="text-red-500">{loginError}</p>}
      {/* Render login success message if it exists */}
      {loginSuccess && <p className="text-green-500">{loginSuccess}</p>}
    </form>
  );
};

export default LoginForm;
