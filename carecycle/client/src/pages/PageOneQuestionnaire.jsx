import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import Banner from '../components/Banner';
import Shadow from '../components/Shadow';
import Footer from '../components/Footer';
import Dropdown from '../components/DropDown';
import Button from '../components/Button';
import Checkbox from '../components/Checkbox';
import Modal from '../components/Modal';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';
import { fetchPreferredLanguage } from '../api/dropdownApi';
import { useTranslation } from 'react-i18next'; 

const PageOneQuestionnaire = () => {
  const { formData, updateFormData, workshopId, workshopName, clearFormData, enableSkippedToRules  } = useForm();
  const [selectedLanguage, setSelectedLanguage] = useState(formData.language || '');
  const [postalCode, setPostalCode] = useState(formData.postalCode || '');
  const [yearOfBirth, setYearOfBirth] = useState(formData.yearOfBirth || '');
  const [preferNotToAnswerPostal, setPreferNotToAnswerPostal] = useState(formData.postalCode === 'Prefer Not To Answer');
  const [preferNotToAnswerYear, setPreferNotToAnswerYear] = useState(formData.yearOfBirth === '0000');
  const [declined, setDeclined] = useState(false);  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalContext, setModalContext] = useState('');
  const [languageOptions, setLanguageOptions] = useState([]);
  const [selectedLanguageId, setSelectedLanguageId] = useState(formData.language?.id || '');
  const [selectedLanguageLabel, setSelectedLanguageLabel] = useState(formData.language?.label || '');
  const { t, i18n } = useTranslation('pageOneQuestionnaire', 'startQuestionnaire'); 

  const navigate = useNavigate();

  // Fetch preferred language options from the server
  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const fetchedLanguages = await fetchPreferredLanguage();
        const languageOptions = fetchedLanguages.map((lang) => ({
          value: lang.language_id,
          label: t(`pageOneQuestionnaire:languages.${lang.language_name}`),
        }));
        setLanguageOptions(languageOptions);
        // After language fetch, ensure disabled states are correct based on `declined`
        setPreferNotToAnswerPostal(declined || formData.postalCode === 'Prefer Not To Answer');
        setPreferNotToAnswerYear(declined || formData.yearOfBirth === '0000');
      } catch (error) {
        console.error("Error loading languages:", error);
      }
    };
  
    loadLanguages();
  }, [t, declined, formData.postalCode, formData.yearOfBirth]);  

  // Define the handleLanguageSelect function
  const handleLanguageSelect = (selectedOptionValue) => {
    const selectedLanguageOption = languageOptions.find(lang => lang.value === selectedOptionValue);
    
    if (selectedLanguageOption) {
      // Update formData with structured language information
      const updatedFormData = {
        ...formData,
        language: {
          id: selectedOptionValue,
          label: selectedLanguageOption.label
        }
      };
      updateFormData(updatedFormData);
  
      // Update local state if necessary, but ensure formData is the source of truth for form submissions
      setSelectedLanguageId(selectedOptionValue);
      setSelectedLanguageLabel(selectedLanguageOption.label);
    }
  };

  useEffect(() => {
    if (formData.language) {
      setSelectedLanguageId(formData.language.id);
      setSelectedLanguageLabel(formData.language.label);
    }
  }, [formData.language]);
  
 // Use the useEffect hook to update the "Prefer Not To Answer" states when the "declined" state changes
  useEffect(() => {
    // If declined is true, disable the inputs and set "Prefer Not To Answer"
    if (declined === true) {
        setPreferNotToAnswerPostal(true);
        setPreferNotToAnswerYear(true);
    } else {
        // If declined is not true (either false or null), ensure the form is re-enabled
        // You might also want to clear "Prefer Not To Answer" selections here if that fits your logic
        setPreferNotToAnswerPostal(false);
        setPreferNotToAnswerYear(false);
    }
}, [declined]);

useEffect(() => {
  // Reflect formData updates
  console.log("Initial formData.consent:", formData.consent);
  setPreferNotToAnswerPostal(formData.postalCode === 'Prefer Not To Answer');
  setPreferNotToAnswerYear(formData.yearOfBirth === '0000');
  // Initialize declined state based on the initial value of formData.consent
  if (formData.consent === 'decline') {
    setDeclined(true);
  } else if (formData.consent === 'accept') {
    setDeclined(false);
  } else {
    // If formData.consent is undefined or null, keep declined as null
    setDeclined(null);
  }
}, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'postalCode') {
      setPostalCode(value);
    } else if (name === 'yearOfBirth') {
      setYearOfBirth(value);
    }
    updateFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (optionId, isChecked) => {
    if (optionId === 'postal') {
      setPostalCode('');
      setPreferNotToAnswerPostal(isChecked);
      updateFormData({ ...formData, postalCode: isChecked ? 'Prefer Not To Answer' : postalCode });
    } else if (optionId === 'year') {
      setYearOfBirth('');
      setPreferNotToAnswerYear(isChecked);
      updateFormData({ ...formData, yearOfBirth: isChecked ? '0000' : yearOfBirth });
    }
  };

  const handleConsentChange = (event) => {
    const value = event.target.value; // 'accept' or 'decline'
    const isDeclined = value === 'decline';
    updateFormData({ ...formData, consent: value });
    //setDeclined(isDeclined);
  };

  const handleClick = () => {
    // Add validation to ensure required fields are answered
    if (declined === null) {
        setModalContent('modal.consentRequired');
        setIsModalOpen(true);
        return;
    } 
    if (declined === true) {
        setModalContent('modal.declineMessage');
        setModalContext("declineConsent");
        setIsModalOpen(true);
        return;
    } 
    // Check if postal code and year of birth are answered
    if ((!postalCode && !preferNotToAnswerPostal) || (!yearOfBirth && !preferNotToAnswerYear)) {
        setModalContent('modal.answerAllQuestions');
        setIsModalOpen(true);
        return;
    }
  
    console.log("Current workshop ID:", workshopId);
    console.log("Current workshop name:", workshopName);
    console.log('FormData after page one for this client:', formData);
    navigate('/pageTwoQuestionnaire');
};
  
  const handleModalOk = () => {
    // Only navigate if the context is declineConsent
    if (modalContext === "declineConsent") {
      enableSkippedToRules();
      navigate('/pageFourQuestionnaire');
    }
    setIsModalOpen(false);
    setModalContext(''); // Reset the context to prevent unintended behavior
  };
  
  const handleModalCancel = () => {
    // Reset local component states
    setSelectedLanguage('');
    setPostalCode('');
    setYearOfBirth('');
    setPreferNotToAnswerPostal(false);
    setPreferNotToAnswerYear(false);
    setDeclined(null); // Optionally clear this if resetting decline state too
  
    // Use clearFormData to reset the form data in your context
    clearFormData();
  
    setIsModalOpen(false);
    setModalContext(''); // Reset context to clear it
  };  

  return (
    <div className="flex flex-col min-h-screen bg-[#f6cdd0]">
      <NavBar />
      <Banner />
      <Shadow />
      <div className="flex-grow pt-20 pb-20 mt-24 flex flex-col items-center justify-center w-full">
        <div className="max-w-[800px] w-full px-4 lg:px-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            {t('pageOneQuestionnaire:activeSession', { workshopName })}
          </h2>
          <h1 className="text-4xl font-bold mb-12 text-center text-[#704218] [text-shadow:0px_4px_4px_#00000040]">{t('pageOneQuestionnaire:pageTitle')}</h1>
          <h2 className="text-3xl font-bold mb-8 text-center text-[#8D5E32] [text-shadow:0px_4px_4px_#00000040]">{t('pageOneQuestionnaire:chooseLanguage')}</h2>
          <Dropdown
            options={languageOptions}
            placeholder={t('pageOneQuestionnaire:chooseLanguage')}
            onSelect={handleLanguageSelect}
            selectedValue={selectedLanguageId}
          />
          <p className="m-8 text-xl">{t('pageOneQuestionnaire:consentText')}</p>
          <div className="flex justify-center items-center space-x-8 mb-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="consent"
                value="accept"
                checked={declined === false}
                onChange={handleConsentChange}
              />
              <span className="ml-2">{t('pageOneQuestionnaire:accept')}</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="consent"
                value="decline"
                checked={declined === true}
                onChange={handleConsentChange}              />
              <span className="ml-2">{t('pageOneQuestionnaire:decline')}</span>
            </label>
          </div>
          <input
            type="text"
            placeholder={t('pageOneQuestionnaire:enterPostalCode')}
            className="mt-4 p-2 border border-black rounded-lg w-full"
            onChange={handleInputChange}
            name="postalCode"
            disabled={preferNotToAnswerPostal || declined === true}
            value={postalCode}
          />
          <Checkbox
            options={[{
              id: 'postal',
              name: t('pageOneQuestionnaire:preferNotToAnswer'),
              checked: preferNotToAnswerPostal,
              disabled: declined === true // Disable this checkbox if declined is true
            }]}
            onChange={() => handleCheckboxChange('postal', !preferNotToAnswerPostal)}
          />
          <input
            type="text"
            placeholder={t('pageOneQuestionnaire:enterYearOfBirth')}
            className="mt-4 p-2 border border-black rounded-lg w-full"
            onChange={handleInputChange}
            name="yearOfBirth"
            disabled={preferNotToAnswerYear || declined === true}
            value={yearOfBirth}
          />
          <Checkbox
            options={[{
              id: 'year',
              name: t('pageOneQuestionnaire:preferNotToAnswer'),
              checked: preferNotToAnswerYear,
              disabled: declined === true // Disable this checkbox if declined is true
            }]}
            onChange={() => handleCheckboxChange('year', !preferNotToAnswerYear)}
          />
          <div className="flex flex-col items-center mt-8 space-y-4">
          <Modal 
            isOpen={isModalOpen} 
            content={t(modalContent)} 
            onConfirm={handleModalOk}
            onClose={handleModalCancel} // Use handleModalCancel for both closing and canceling
            showCancelButton={true}
            showOkButton={true}
          >
            {t(modalContent)}
          </Modal>

            <Button
              text={t('pageOneQuestionnaire:nextPage')}
              className="text-white bg-[#16839B] hover:bg-[#0f6674]"
              onClick={handleClick}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PageOneQuestionnaire;
