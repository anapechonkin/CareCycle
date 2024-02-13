import React, { createContext, useContext, useState, useEffect  } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [userType, setUserType] = useState(() => {
      // Try to get a saved user type from localStorage
      const savedUserType = localStorage.getItem('userType');
      return savedUserType || '';
    });
  
    useEffect(() => {
      // Save userType to localStorage whenever it changes
      localStorage.setItem('userType', userType);
    }, [userType]);
  
    return (
      <UserContext.Provider value={{ userType, setUserType }}>
        {children}
      </UserContext.Provider>
    );
  };
  