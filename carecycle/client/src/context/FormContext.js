import React, { createContext, useContext, useState } from 'react';

const FormContext = createContext();

export const useForm = () => useContext(FormContext);

export const FormProvider = ({ children }) => {
    const [formData, setFormData] = useState({});
    const [workshopName, setWorkshopName] = useState('');

    const getSavedWorkshopId = () => {
        const workshopData = localStorage.getItem('workshopId');
        if (workshopData) {
            const { expiry, id } = JSON.parse(workshopData);
            const now = new Date();
            if (now.getTime() > expiry) {
                localStorage.removeItem('workshopId');
                return '';
            }
            return id;
        }
        return '';
    };

    const [workshopId, setWorkshopIdInternal] = useState(getSavedWorkshopId);

    const setWorkshopId = (newWorkshopId) => {
        const now = new Date();
        const expiry = now.getTime() + (4 * 60 * 60 * 1000); // 4 hours from now
        const workshopData = JSON.stringify({ id: newWorkshopId, expiry });
        localStorage.setItem('workshopId', workshopData);
        setWorkshopIdInternal(newWorkshopId);
    };

    const clearWorkshopId = () => {
        localStorage.removeItem('workshopId');
        setWorkshopIdInternal('');
    };

    const updateFormData = (newData) => {
        if (Object.keys(newData).length === 0) {
            setFormData({});
        } else {
            setFormData(prevFormData => ({ ...prevFormData, ...newData }));
        }
    };

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
