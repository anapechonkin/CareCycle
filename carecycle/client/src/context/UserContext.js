import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [userType, setUserType] = useState(() => {
        // Try to get a saved user type from localStorage
        const savedUserType = localStorage.getItem('userType');
        return savedUserType || '';
    });

    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        // Check if a token is present in localStorage to determine authentication status
        return !!localStorage.getItem('token');
    });

    useEffect(() => {
        // Save userType to localStorage whenever it changes
        localStorage.setItem('userType', userType);
    }, [userType]);

    return (
        <UserContext.Provider value={{ userType, setUserType, isAuthenticated, setIsAuthenticated }}>
            {children}
        </UserContext.Provider>
    );
};
