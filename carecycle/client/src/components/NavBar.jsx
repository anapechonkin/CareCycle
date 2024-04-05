import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext'; 
import { Link, useNavigate, useLocation  } from 'react-router-dom';
import Modal from './Modal'; // Adjust this path to match your file structure
import { useForm } from '../context/FormContext';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [logoutConfirmed, setLogoutConfirmed] = useState(false);
  const [logoutReason, setLogoutReason] = useState('');
  const [customReason, setCustomReason] = useState(''); // State for custom reason input
  const navigate = useNavigate();
  const location = useLocation(); 
  const { clearWorkshopId, clearFormData } = useForm();
  const { t, i18n } = useTranslation('navbar');
  const { userType, isAuthenticated, setIsAuthenticated } = useUser();
  const roleName = localStorage.getItem('roleName');
  
  console.log("Current userType in Navbar:", userType); 
 
  // Define user roles based on userType
  const userRoleMapping = {
    Admin: t('userRoleAdmin'),
    Volunteer: t('userRoleVolunteer'),
    'CA/Employee': t('userRoleCAEmployee'),
  };
  
  const userRole = userRoleMapping[userType] || t('defaultRole');

  // Style for clickable elements with hover effect
  const linkStyle = 'cursor-pointer hover:text-[#15839b] transition duration-150 ease-in-out text-white';

  // Open the logout modal
  const handleLogoutClick = () => {
    console.log('Logout button clicked');
    setIsLogoutModalOpen(true);
  };

  // Handle the logout logic after confirmation
  const handleLogoutConfirm = () => {
    const reason = logoutReason === t('specialEvent') || logoutReason === t('other') ? `${logoutReason}: ${customReason}` : logoutReason;
    console.log(`Logout confirmed with reason: ${reason}`);
    setIsLogoutModalOpen(false); // Close the modal
    setLogoutConfirmed(true); // Indicate that logout has been confirmed
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('roleName'); 
    // Reset language to English
    i18n.changeLanguage('en');
  };

  // useEffect hook to navigate after logout is confirmed
  useEffect(() => {
    if (logoutConfirmed) {
      console.log('Navigating to login page...');
      clearWorkshopId(); // Clear the workshopId from local storage
      clearFormData(); 
      navigate('/'); // Navigate to the login page
      setLogoutConfirmed(false); // Reset to prevent unintended navigation
    }
  }, [logoutConfirmed, navigate, clearWorkshopId, clearFormData]);

  return (
    <>
      <div className="fixed w-full h-[46px] top-0 left-0 bg-black flex justify-between items-center px-4 z-50">
        <div className="text-[#15839b] text-lg">{userRole}</div>
        <div className="space-x-4">
        {location.pathname !== '/dashboard' && <Link to="/dashboard" className={linkStyle}>{t('dashboard')}</Link>}
          <button className={linkStyle} onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en')}>
            {t('languageToggle')}
          </button>
          <button className={linkStyle} onClick={handleLogoutClick}>{t('logout')}</button>
        </div>
      </div>

      {isLogoutModalOpen && (
        <Modal 
            isOpen={isLogoutModalOpen}
            showOkButton = 'true'
            okButtonText={t('cancel')}
            onClose={() => setIsLogoutModalOpen(false)}>
          <div>
            <p className='text-lg mb-4'>{t('specialContextQuestion')}</p>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleLogoutConfirm();
            }}>
              <div className='text-lg mb-4'>
                {/* Iterate over reasons for a more dynamic approach */}
                {['badWeather', 'excellentWeather', 'specialEvent', 'nothingInParticular', 'other'].map((reasonKey) => (
                  <label key={reasonKey}>
                    <input 
                      type="radio" 
                      name="reason" 
                      value={t(reasonKey)} 
                      onChange={(e) => setLogoutReason(e.target.value)}
                    /> {t(reasonKey)}
                    {(reasonKey === 'specialEvent' || reasonKey === 'other') && logoutReason === t(reasonKey) && (
                      <input
                        type="text"
                        placeholder={t('pleaseSpecify')}
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        className="ml-2 border border-gray-400 rounded-md p-1"
                      />
                    )}
                    <br />
                  </label>
                ))}
              </div>
              <button type="submit" className="mt-4 bg-[#15839b] hover:bg-[#106680] text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out">
                {t('confirmLogout')}
              </button>
            </form>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Navbar;
