import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext'; 
import { Link, useNavigate, useLocation  } from 'react-router-dom';
import Modal from './Modal'; // Adjust this path to match your file structure

const Navbar = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [logoutConfirmed, setLogoutConfirmed] = useState(false);
  const [logoutReason, setLogoutReason] = useState('');
  const [customReason, setCustomReason] = useState(''); // State for custom reason input
  const navigate = useNavigate();
  const location = useLocation(); 

  const { userType } = useUser();
  console.log("Current userType in Navbar:", userType); 

  // Define user roles based on userType
  const userRoleMapping = {
    admin: 'Admin',
    volunteer: 'Volunteer',
    'ca/employee': 'CA + Employees', // Ensure keys here match exactly with the values set in userType
  };
  
  const userRole = userRoleMapping[userType] || 'Default Role';

  // Style for clickable elements with hover effect
  const linkStyle = 'cursor-pointer hover:text-[#15839b] transition duration-150 ease-in-out text-white';

  // Open the logout modal
  const handleLogoutClick = () => {
    console.log('Logout button clicked');
    setIsLogoutModalOpen(true);
  };

  // Handle the logout logic after confirmation
  const handleLogoutConfirm = () => {
    const reason = logoutReason === 'Special Event' || logoutReason === 'Other' ? `${logoutReason}: ${customReason}` : logoutReason;
    console.log(`Logout confirmed with reason: ${reason}`);
    setIsLogoutModalOpen(false); // Close the modal
    setLogoutConfirmed(true); // Indicate that logout has been confirmed
  };

  // useEffect hook to navigate after logout is confirmed
  useEffect(() => {
    if (logoutConfirmed) {
      console.log('Navigating to login page...');
      navigate('/'); // Navigate to the login page
      setLogoutConfirmed(false); // Reset to prevent unintended navigation
    }
  }, [logoutConfirmed, navigate]);

  return (
    <>
      <div className="fixed w-full h-[46px] top-0 left-0 bg-black flex justify-between items-center px-4 z-50">
        <div className="text-[#15839b] text-lg">{userRole}</div>
        <div className="space-x-4">
        {location.pathname !== '/dashboard' && <Link to="/dashboard" className={linkStyle}>DASHBOARD</Link>}
          <button className={linkStyle} onClick={() => console.log('Language toggle clicked')}>FR/EN</button>
          <button className={linkStyle} onClick={handleLogoutClick}>LOGOUT</button>
        </div>
      </div>

      {isLogoutModalOpen && (
        <Modal 
            isOpen={isLogoutModalOpen} 
            showOkButton={true}
            buttonText='Cancel'
            onClose={() => {
                console.log('Closing modal...');
                setIsLogoutModalOpen(false);
             }}>
          <div>
            <p className='text-lg mb-4'>Is there a special context to the activity today?</p>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleLogoutConfirm();
            }}>
              <div className='text-lg mb-4'>
                {/* Radio buttons for logout reasons */}
                <label>
                  <input 
                    type="radio" 
                    name="reason" 
                    value="Bad Weather" 
                    onChange={(e) => setLogoutReason(e.target.value)} 
                  /> Bad Weather
                </label><br />
                <label>
                  <input 
                    type="radio" 
                    name="reason" 
                    value="Excellent Weather" 
                    onChange={(e) => setLogoutReason(e.target.value)} 
                  /> Excellent Weather
                </label><br />
                <label>
                  <input 
                    type="radio" 
                    name="reason" 
                    value="Special Event" 
                    onChange={(e) => setLogoutReason(e.target.value)} 
                  /> Special Event
                  {logoutReason === 'Special Event' && (
                    <input
                      type="text"
                      placeholder="Please specify"
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      className="ml-2 border border-gray-400 rounded-md p-1"
                    />
                  )}
                </label><br />
                <label>
                  <input 
                    type="radio" 
                    name="reason" 
                    value="Nothing in Particular" 
                    onChange={(e) => setLogoutReason(e.target.value)} 
                  /> Nothing in Particular
                </label><br />
                <label>
                  <input 
                    type="radio" 
                    name="reason" 
                    value="Other" 
                    onChange={(e) => setLogoutReason(e.target.value)} 
                  /> Other
                  {logoutReason === 'Other' && (
                    <input
                      type="text"
                      placeholder="Please specify"
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      className="ml-2 border border-gray-400 rounded-md p-1"
                    />
                  )}
                </label><br />
              </div>
              <button type="submit" className="mt-4 bg-[#15839b] hover:bg-[#106680] text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out">Confirm Logout</button>
            </form>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Navbar;
