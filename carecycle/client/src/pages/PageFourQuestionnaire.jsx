import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Banner from "../components/Banner";
import Shadow from "../components/Shadow";
import Footer from "../components/Footer";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { useForm } from '../context/FormContext';
import { addClientStat } from '../api/clientStatApi';
import { lookupPostalCode, addPostalCode } from '../api/postalCodeApi';
import { addClientStatGenderIdentities } from '../api/genderIdentityApi'; 
import { addClientStatsMapAreas } from "../api/mapAreaApi";
import { addClientStatSelfIdentification } from "../api/selfIdApi";
import { useTranslation } from 'react-i18next'; 

const PageFourQuestionnaire = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('pageFourQuestionnaire'); 
  const { formData, 
          updateFormData, 
          workshopId, 
          questionnaireCompleted, 
          resetQuestionnaireCompletion, 
          clearFormData,
          skippedToRules,
          resetSkippedToRules
         } = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [rulesAccepted, setRulesAccepted] = useState(null);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);

  const handlePostalCode = async (postalCode) => {
    if (postalCode.toUpperCase() === "PREFER NOT TO ANSWER") {
      return 1; // Assuming '1' is the ID reserved for "Prefer Not To Answer"
    }

    try {
      const lookupResult = await lookupPostalCode(postalCode);
      return lookupResult.postal_code_id;
    } catch (error) {
      const addResult = await addPostalCode(postalCode);
      return addResult.postal_code_id;
    }
  };

  const handleSubmitQuestionnaire = async () => {
    try {
      const postalCodeId = await handlePostalCode(formData.postalCode);
  
      const submissionData = {
        yearOfBirth: formData.yearOfBirth,
        customGender: formData.custom_gender,
        primaryGenderId: formData.primaryGender.id,
        postalCodeId,
        workshopId,
        languageId: formData.language.id,
        newcomerStatusId: formData.newcomerStatus.id,
        newcomerComment: formData.newcomerComment,
        userId: null, // Assuming user authentication isn't set up yet, thus 'null'
      };
  
      const clientStatResult = await addClientStat(submissionData);
      console.log('ClientStat added successfully:', clientStatResult);
  
      if (clientStatResult && formData.genderIdentities && formData.genderIdentities.length > 0) {
        const genderIdentityIds = formData.genderIdentities.map(identity => identity.id);
        const genderIdentityResult = await addClientStatGenderIdentities(clientStatResult.cs_id, genderIdentityIds);
        console.log('Gender identities added successfully:', genderIdentityResult);
      }
  
      if (clientStatResult && formData.mapSelections && formData.mapSelections.length > 0) {
        const mapAreaIds = formData.mapSelections.map(area => area.mapID);
        const mapAreaResult = await addClientStatsMapAreas(clientStatResult.cs_id, mapAreaIds);
        console.log('Map areas added successfully:', mapAreaResult);
      }

      if (clientStatResult && formData.selfIdentificationOptions && formData.selfIdentificationOptions.length > 0) {
        const selfIds = formData.selfIdentificationOptions.map(option => option.id);
        const selfIdResult = await addClientStatSelfIdentification(clientStatResult.cs_id, selfIds);
        console.log('Self-identification options added successfully:', selfIdResult);
      }
      
  
      // Decide which modal message to show based on rulesAccepted
      if (rulesAccepted === false) {
        // If the user declined, set up the first modal to inform and prompt to give back the device
        setModalMessage(t('pageFourQuestionnaire:modal.declineMessage'));
        setIsModalOpen(true);
      } else {
        // If the user accepted or in any other case, just show the success message
        setModalMessage(t('pageFourQuestionnaire:modal.acceptMessage'));
        setIsModalOpen(true);
      }
  
      // Reset formData to initial state after successful submission
      updateFormData({
        postalCode: "",
        primaryGender: {},
        yearOfBirth: "",
        customGender: "",
        genderIdentities: [],
        mapSelections: [],
        newcomerStatus: {},
        newcomerComment: "",
        selfIdentificationOptions: [],
        consent: null,
        language: "",
        // Add other fields as required by your form's initial state
      });

      return true;
  
    } catch (error) {
      console.error('Submission error:', error);
      setModalMessage(t('pageFourQuestionnaire:submissionFailureMessage'));
      setIsModalOpen(true);
      return false;
    }
  }; 

  const handleAcceptOrDeclineRules = async () => {
    // Check if the user has not made a choice yet
    if (rulesAccepted === null) {
        // Set modal message instructing the user to accept or decline the rules
        setModalMessage(t('pageFourQuestionnaire:modal.pleaseChooseMessage'));
        setIsModalOpen(true);
        return; // Prevent further execution
    }

    let submissionSuccess = false;
  
    if (questionnaireCompleted) {
        submissionSuccess = await handleSubmitQuestionnaire();
        setSubmissionStatus(submissionSuccess ? 'success' : 'failure');
    }
  
    if (rulesAccepted) {
        setModalMessage(t('pageFourQuestionnaire:modal.acceptMessage'));
    } else {
        setModalMessage(t('pageFourQuestionnaire:modal.declineMessage'));
    }

    setIsModalOpen(true);
};

  // Adjust handleCloseModal to handle different scenarios more explicitly
  const handleCloseModal = (action) => {
    setIsModalOpen(false);

    // Action parameter helps distinguish between 'OK' and 'Cancel' clicks
    if (action === 'confirm' && !rulesAccepted) {
      // Show the overlay
      setShowOverlay(true);
      // If 'OK' is clicked after declining the rules
      // Close the first modal and start a delay before showing the second modal
      setTimeout(() => {
        // Hide the overlay right before showing the second modal
        setShowOverlay(false);
        setModalMessage(t('pageFourQuestionnaire:modal.finalMessage'));
        setIsSecondModalOpen(true);
      }, 5000); // Delay the second modal by 5 seconds (5000 milliseconds)
      } else if (action === 'cancel') {
        // If 'Cancel' is clicked, just close the modal
      } else {
      // This case handles the modal closing after accepting the rules or after any other scenario where we just need to close the modal and proceed
      clearFormData();
      navigate('/pageOneQuestionnaire');
      resetQuestionnaireCompletion();
    }
  };

  const handleSecondModalClose = () => {
    setIsSecondModalOpen(false);
    clearFormData();
    navigate('/pageOneQuestionnaire');
    resetQuestionnaireCompletion();
  };
  

  const handlePreviousClick = () => {
    if (skippedToRules) {
      // Reset the flag when navigating back
      resetSkippedToRules();
      navigate('/pageOneQuestionnaire');
    } else {
      navigate('/pageThreeQuestionnaire');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f6cdd0]">
      <NavBar />
      <Banner />
      <Shadow />
      <div className="flex-grow pt-20 pb-20 mt-24 flex flex-col items-center justify-center w-full">
        <div className="max-w-[900px] w-full px-4 lg:px-8 space-y-12">
          <h1 className="text-6xl font-bold mb-16 text-center text-[#704218] [text-shadow:0px_4px_4px_#00000040]"> {t('pageFourQuestionnaire:rulesAndValuesTitle')}</h1>
          <div className="overflow-auto h-80 border-2 border-black rounded-lg shadow-lg p-6 mb-6 bg-white text-xl">
            {t('pageFourQuestionnaire:rulesAndValuesContent', { returnObjects: true }).map((rule, index) => (
              <p key={index}>{rule}</p>
            ))}
          </div>
          <div className="flex justify-center mt-6 text-2xl">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="rulesAccepted"
                value="accept"
                checked={rulesAccepted === true}
                onChange={() => setRulesAccepted(true)}
              />
              <span className="ml-2"> {t('pageFourQuestionnaire:accept')}</span>
            </label>
            <label className="flex items-center mx-8 cursor-pointer">
              <input
                type="radio"
                name="rulesAccepted"
                value="decline"
                checked={rulesAccepted === false}
                onChange={() => setRulesAccepted(false)}
              />
              <span className="ml-2">{t('pageFourQuestionnaire:decline')}</span>
            </label>
          </div>
          <div className="flex items-center justify-between w-full mt-4">
            {submissionStatus && (
              <div
                style={{
                  color: submissionStatus === 'success' ? 'green' : 'red',
                }}
              >
                {submissionStatus === 'success'
                  ? t('submissionSuccessMessage')
                  : t('submissionFailureMessage')}
              </div>
            )}
          </div>
          <div className="flex items-center w-full mt-8">
            <Button
              text={t('previous')}
              onClick={handlePreviousClick}
              className="text-white bg-[#16839B] hover:bg-[#0f6a8b] font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-150 ease-in-out"
            />
            <Button
              text={t('submitQuestionnaireButtonText')}
              onClick={handleAcceptOrDeclineRules}
              className="text-white bg-[#16839B] hover:bg-[#0f6a8b] font-bold py-2 px-4 mx-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-150 ease-in-out"
              disabled={rulesAccepted === null}
            />
          </div>
          <div className="flex flex-col items-center space-y-2 mt-4">
            <div className="text-center">Page</div>
            <div className="flex space-x-2">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span className="font-bold">4</span>
            </div>
          </div>
        </div>
      </div>
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => handleCloseModal('cancel')}
        onConfirm={() => handleCloseModal('confirm')}
        showOkButton={rulesAccepted !== null}
        showCancelButton = {!rulesAccepted}
      >
        <p>{modalMessage}</p>
      </Modal>
      
      {/* Second modal for handling the decline case specifically */}
      <Modal 
        isOpen={isSecondModalOpen}
        onClose={handleSecondModalClose}
      >
        <p>{modalMessage}</p>
      </Modal>
      <Footer />
      {/* Overlay for processing */}
    {showOverlay && (
      <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000, // Ensure it's above other content
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          fontSize: '24px',
      }}>
         {t('pageFourQuestionnaire:overlayMessage')}
      </div>
    )}
    </div>
  );
};

export default PageFourQuestionnaire;
