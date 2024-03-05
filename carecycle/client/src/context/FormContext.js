import React, { createContext, useContext, useState, useEffect } from 'react';

const FormContext = createContext();

export const useForm = () => useContext(FormContext);

export const FormProvider = ({ children }) => {
    const [formData, setFormData] = useState({});
    const [workshopId, setWorkshopIdInternal] = useState(() => {
      const savedWorkshopId = localStorage.getItem('workshopId');
      return savedWorkshopId || '';
    });

    useEffect(() => {
      localStorage.setItem('workshopId', workshopId);
    }, [workshopId]);

    const updateFormData = (newData) => {
        setFormData(prevFormData => ({ ...prevFormData, ...newData }));
    };

    const setWorkshopId = (newWorkshopId) => {
        setWorkshopIdInternal(newWorkshopId);
        localStorage.setItem('workshopId', newWorkshopId);
    };

    const clearWorkshopId = () => {
        localStorage.removeItem('workshopId');
        setWorkshopIdInternal('');
    };

    return (
        <FormContext.Provider value={{
            formData,
            updateFormData,
            workshopId,
            setWorkshopId,
            clearWorkshopId
        }}>
            {children}
        </FormContext.Provider>
    );
};
