import React, { createContext, useContext, useState, useEffect } from 'react';

const FormContext = createContext();

export const useForm = () => useContext(FormContext);

export const FormProvider = ({ children }) => {
    const [formData, setFormData] = useState({});
    const [workshopId, setWorkshopIdInternal] = useState('');
    const [workshopName, setWorkshopNameInternal] = useState('');
    const [questionnaireCompleted, setQuestionnaireCompleted] = useState(false);
    const [skippedToRules, setSkippedToRules] = useState(false);

    useEffect(() => {
        const workshopData = localStorage.getItem('workshopId');
        let isWorkshopIdValid = false;
    
        if (workshopData) {
            const { expiry, id } = JSON.parse(workshopData);
            const now = new Date();
            if (now.getTime() <= expiry) {
                setWorkshopIdInternal(id);
                isWorkshopIdValid = true;
            } else {
                localStorage.removeItem('workshopId');
                setWorkshopIdInternal('');
            }
        }
        
        if (isWorkshopIdValid) {
            const savedWorkshopName = localStorage.getItem('workshopName');
            if (savedWorkshopName) {
                setWorkshopNameInternal(savedWorkshopName);
            }
        } else {
            localStorage.removeItem('workshopName');
            setWorkshopNameInternal('');
        }
    }, []);

    const setWorkshopId = (newWorkshopId) => {
        const now = new Date();
        const expiry = now.getTime() + (4 * 60 * 60 * 1000);
        const workshopData = JSON.stringify({ id: newWorkshopId, expiry });
        localStorage.setItem('workshopId', workshopData);
        setWorkshopIdInternal(newWorkshopId);
    };

    const setWorkshopName = (name) => {
        localStorage.setItem('workshopName', name);
        setWorkshopNameInternal(name);
    };

    const clearWorkshopId = () => {
        localStorage.removeItem('workshopId');
        localStorage.removeItem('workshopName');
        setWorkshopIdInternal('');
        setWorkshopNameInternal('');
    };

    const clearFormData = () => {
        setFormData({}); // Clear the form data
        setSkippedToRules(false);
    };

    const updateFormData = (newData) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            ...newData
        }));
    };

    const markQuestionnaireCompleted = () => {
        setQuestionnaireCompleted(true);
    };

    const resetQuestionnaireCompletion = () => {
        setQuestionnaireCompleted(false);
    };

    // Function to mark the questionnaire as completed
  const completeQuestionnaire = () => {
    setQuestionnaireCompleted(true);
  };

  // New function to set skippedToRules to true
  const enableSkippedToRules = () => {
    setSkippedToRules(true);
  };

  // New function to reset skippedToRules to false
  const resetSkippedToRules = () => {
        setSkippedToRules(false);
  };

    return (
        <FormContext.Provider value={{
            formData,
            updateFormData,
            workshopId,
            setWorkshopId,
            clearWorkshopId,
            clearFormData,
            workshopName,
            setWorkshopName,
            questionnaireCompleted,
            completeQuestionnaire,
            markQuestionnaireCompleted,
            resetQuestionnaireCompletion,
            skippedToRules,
            enableSkippedToRules,
            resetSkippedToRules
        }}>
            {children}
        </FormContext.Provider>
    );
};
