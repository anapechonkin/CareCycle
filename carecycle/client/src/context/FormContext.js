import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for the form. This allows for easy sharing of form state and functions across components.
const FormContext = createContext();

// Custom hook to use the form context. This simplifies the process of accessing the form's context in components.
export const useForm = () => useContext(FormContext);

// The provider component for the form context. It initializes and manages the state and provides functions to update it.
export const FormProvider = ({ children }) => {
    // State for storing form data as an object.
    const [formData, setFormData] = useState({});
    // State for storing the workshop ID, initially set to an empty string.
    const [workshopId, setWorkshopIdInternal] = useState('');
    // State for storing the workshop name, initially set to an empty string.
    const [workshopName, setWorkshopNameInternal] = useState('');

    // Effect hook to load the workshop ID and name from localStorage on component mount.
    useEffect(() => {
        const workshopData = localStorage.getItem('workshopId');
        let isWorkshopIdValid = false;
    
        if (workshopData) {
            const { expiry, id } = JSON.parse(workshopData);
            const now = new Date();
            // Check if the stored workshop ID has expired.
            if (now.getTime() <= expiry) {
                // If not expired, update the workshop ID state and mark as valid.
                setWorkshopIdInternal(id);
                isWorkshopIdValid = true;
            } else {
                // If expired, remove the workshop ID from localStorage and reset state.
                localStorage.removeItem('workshopId');
                setWorkshopIdInternal('');
            }
        }
        
        // Load and set the workshop name from localStorage if the workshop ID is valid.
        if (isWorkshopIdValid) {
            const savedWorkshopName = localStorage.getItem('workshopName');
            if (savedWorkshopName) {
                setWorkshopNameInternal(savedWorkshopName);
            }
        } else {
            // If the workshop ID is not valid or expired, clear the workshop name from both localStorage and state.
            localStorage.removeItem('workshopName');
            setWorkshopNameInternal('');
        }
    }, []); // Dependency array is empty to ensure this runs only once on component mount.

    // Function to update the workshop ID in both localStorage and state, including setting an expiry time.
    const setWorkshopId = (newWorkshopId) => {
        const now = new Date();
        const expiry = now.getTime() + (4 * 60 * 60 * 1000); // Set expiry to 4 hours from now.
        const workshopData = JSON.stringify({ id: newWorkshopId, expiry });
        localStorage.setItem('workshopId', workshopData);
        setWorkshopIdInternal(newWorkshopId);
    };

    // Function to update the workshop name in both localStorage and state.
    const setWorkshopName = (name) => {
        localStorage.setItem('workshopName', name);
        setWorkshopNameInternal(name);
    };

    // Function to clear both the workshop ID and name from localStorage and state.
    const clearWorkshopId = () => {
        localStorage.removeItem('workshopId');
        localStorage.removeItem('workshopName');
        setWorkshopIdInternal('');
        setWorkshopNameInternal('');
    };

    // Function to update form data state. It merges new data with existing data.
    const updateFormData = (newData) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            ...newData
        }));
    };

    // Providing the form context with state and functions to be used by consuming components.
    return (
        <FormContext.Provider value={{
            formData,
            updateFormData,
            workshopId,
            setWorkshopId,
            clearWorkshopId,
            workshopName,
            setWorkshopName,
        }}>
            {children}
        </FormContext.Provider>
    );
};
