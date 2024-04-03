import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Banner from "../components/Banner";
import Shadow from "../components/Shadow";
import Footer from "../components/Footer";
import Button from "../components/Button";
import Checkbox from "../components/Checkbox";
import Modal from "../components/Modal";
import Dropdown from "../components/DropDown"; // Assumes the Dropdown component is implemented
import { fetchMapAreas } from "../api/mapAreaApi";
import { fetchSelfIdentificationOptions } from "../api/selfIdApi";
import { fetchNewcomerStatus } from "../api/dropdownApi"; // Ensure this function is correctly implemented to fetch options
import { useForm } from '../context/FormContext';
import { useTranslation } from 'react-i18next';

const continentMapping = {
  "Prefer Not To Answer": [1], // Special case, might not be associated with a specific continent
  "Americas": [7, 8, 9, 10], // Adding the Caribbean
  "Europe": [11, 12, 13], // Northwestern, Eastern, Mediterranean Europe
  "Asia": [2, 3, 4, 5, 6], // Including Middle East, Near East, Southeastern Asia, South Asia, Central Asia
  "Africa": [15, 16, 17, 18, 19], // Northern, Western, Central, Eastern, Southern Africa
  "Oceania": [14], // South Pacific (including Australia)
};

const PageThreeQuestionnaire = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('pageThreeQuestionnaire');
  // Accesses form context for global form state management.
  const { formData, updateFormData, workshopId, markQuestionnaireCompleted } = useForm();
  // State management for dynamic form elements and modal.
  const [mapAreas, setMapAreas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [newcomerStatus, setNewcomerStatus] = useState(formData.newcomerStatus || '');
  const [newcomerStatusOptions, setNewcomerStatusOptions] = useState([]);
  const [newcomerComment, setNewcomerComment] = useState('');
  const [selfIdOptions, setSelfIdOptions] = useState([]);
  const [groupedMapAreas, setGroupedMapAreas] = useState({});
  const [isFormValid, setIsFormValid] = useState(false); 

  // Example of transforming a string into camelCase
  const toCamelCase = (str) => {
    return str
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
  }

  // Effect hook for loading self-identification options on component mount.
  useEffect(() => {
    const loadSelfIdOptions = async () => {
      try {
        const data = await fetchSelfIdentificationOptions();
        setSelfIdOptions(data.map(option => {
          // Assuming option.option is the name of the option that needs translation
          // and it matches a key in your translation JSON files
          // Convert the option name to camelCase or another consistent format
          const optionKey = toCamelCase(option.option);
          return {
            ...option,
            id: option.self_identification_id,
            // Use the converted key to fetch the translation
            name: t(`pageThreeQuestionnaire:selfIdentificationOptions.${optionKey}`),
            checked: formData.selfIdentificationOptions?.some(selection => selection.id === option.self_identification_id) || false,
          };
        }));
      } catch (error) {
        console.error("Failed to fetch self-identification options:", error);
      }
    };
  
    loadSelfIdOptions();
  }, [t, formData.selfIdentificationOptions]);

  // Effect hook for loading map area data on component mount or form data changes.
  useEffect(() => {
    const loadMapAreas = async () => {
      try {
        const areas = await fetchMapAreas(); 
        setMapAreas(areas.map(area => {
          // Standardize the map area name to closely match translation keys
          // This should reflect the exact structure of keys in your translation files
          const standardizedKey = area.map_area_name.replace(/\s+/g, '_').replace(/\(/g, '').replace(/\)/g, '').replace(/__+/g, '_');
          return {
            ...area,
            id: area.map_id,
            // Ensure the key transformation here matches exactly with your translation key structure
            name: t(`pageThreeQuestionnaire:mapAreas.${standardizedKey}`),
            checked: formData.mapSelections?.some(selection => selection.mapID === area.map_id) || false,
          };
        }));
      } catch (error) {
        console.error("Failed to fetch map areas:", error);
      }
    };
    loadMapAreas();
  }, [t, formData.mapSelections]);
    
  // Loads newcomer status options from an API on component mount and sets the initial value.
  useEffect(() => {
    const loadNewcomerStatusOptions = async () => {
      try {
        const statuses = await fetchNewcomerStatus();
        const mappedStatuses = statuses.map(status => ({
          value: status.newcomer_status_id,
          // Use a function to transform `status.status` into a key, or directly use `status.status`
          // as keys if they're already standardized in your translation files.
          label: t(`pageThreeQuestionnaire:newcomerStatusOptions.${status.status.replace(/\s+/g, '_').replace(/[\(\)]/g, '')}`),
        }));
        setNewcomerStatusOptions(mappedStatuses);
  
        // Set the initial value for the dropdown if formData already has a newcomerStatus
        if (formData.newcomerStatus) {
          const existingStatus = mappedStatuses.find(status => status.value === formData.newcomerStatus.id);
          if (existingStatus) {
            setNewcomerStatus(formData.newcomerStatus.id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch newcomer statuses:", error);
      }
    };
    loadNewcomerStatusOptions();
  }, [t, formData.newcomerStatus]); // Add 't' to the dependency array to ensure the effect reruns if the language changes

useEffect(() => {
  // Initialize newcomerComment state based on form data
  setNewcomerComment(formData.newcomerComment || ''); // Set to newcomerComment if available, otherwise set to an empty string
}, [formData.newcomerComment]); // Depend on formData.newcomerComment to reset if it changes

useEffect(() => {
  const grouped = Object.keys(continentMapping).reduce((acc, continent) => {
    // Ensure the key matches the format in your JSON files. This example assumes camelCase.
    let formattedContinentKey = continent.charAt(0).toLowerCase() + continent.slice(1).replace(/ /g, '');
    let continentTranslationKey = `pageThreeQuestionnaire:continents.${formattedContinentKey}`;
    let continentName = t(continentTranslationKey);
    
    console.log(`Key: ${continentTranslationKey}, Translated: ${continentName}`); // Debug log for translation check
    
    // Keep the original logic for filtering map areas
    acc[continentName] = mapAreas.filter(area => continentMapping[continent].includes(area.id));
    return acc;
  }, {});

  setGroupedMapAreas(grouped);
}, [mapAreas, t]); // Added 't' to dependencies to ensure re-calculation when translations load

  // Effect hook for validating the form on every change to the form data.
  useEffect(() => {
    // Perform validation checks
    const validateForm = () => {
      // Check for newcomer status selection
      const hasNewcomerStatus = !!formData.newcomerStatus;
      // Check for at least one map area selection
      const hasMapSelection = formData.mapSelections && formData.mapSelections.length > 0;
      // Check for at least one self-identification option selection
      const hasSelfIdOption = formData.selfIdentificationOptions && formData.selfIdentificationOptions.length > 0;

      // Update the isFormValid state based on these checks
      setIsFormValid(hasNewcomerStatus && hasMapSelection && hasSelfIdOption);
    };

    validateForm();
  }, [formData.newcomerStatus, formData.mapSelections, formData.selfIdentificationOptions]); // Depend on formData sections


  const handleSelect = (selectedOptionValue) => {
    const selectedOption = newcomerStatusOptions.find(option => option.value === selectedOptionValue);

    if (selectedOption) {
      // Update the formData with an object containing both id and label
      updateFormData({
        ...formData,
        newcomerStatus: { id: selectedOptionValue, label: selectedOption.label },
      });
      // Optionally update local state, if necessary
      setNewcomerStatus(selectedOptionValue);
    }
  };

  const handleNewcomerCommentChange = (e) => {
    const comment = e.target.value;
    setNewcomerComment(comment); // Updates local state for the textarea
    updateFormData({
      ...formData,
      newcomerComment: comment, // Ensures formData includes the newcomer comment
    });
  };

  // Handles navigation to the next page, ensuring at least one map area is selected.
  const handleNextClick = () => {
    let missingSectionsKeys = [];
  
    // Check if newcomer status is selected
    if (!formData.newcomerStatus) {
      missingSectionsKeys.push("selectAnewcomerStatus");
    }
  
    // Check if at least one self-identification option is selected
    if (!(formData.selfIdentificationOptions && formData.selfIdentificationOptions.length > 0)) {
      missingSectionsKeys.push("selectAtLeastOneSelfIdentificationOption");
    }
  
    // Check if at least one map area is selected
    if (!(formData.mapSelections && formData.mapSelections.length > 0)) {
      missingSectionsKeys.push("selectAtLeastOneMapArea");
    }
  
    // If any sections are missing, show a modal with a combined message and prevent navigation
    if (missingSectionsKeys.length > 0) {
      let messageParts = missingSectionsKeys.map(key => t(`pageThreeQuestionnaire:modalMessages.${key}`));
      let message = t('pageThreeQuestionnaire:modalMessages.pleaseSelect') +
                    messageParts.join(", ") + 
                    t('pageThreeQuestionnaire:modalMessages.continue');
      
      setModalContent(message);
      setShowModal(true);
      return;
    }
  
    // If all checks pass, proceed with the navigation
    console.log("Proceeding with workshop ID:", workshopId);
    console.log("Newcomer Status:", formData.newcomerStatus.label);
    console.log("Map areas selected:", formData.mapSelections);
    console.log("Selected Self-Identification Options:", formData.selfIdentificationOptions);
    console.log("Updated FormData after page 3:", formData);
  
    // Mark the questionnaire as completed before navigating to the next page
    markQuestionnaireCompleted();
  
    navigate('/pageFourQuestionnaire');
  };
   

  // Navigation back to the previous page.
  const handlePreviousClick = () => {
    // Check if the primaryGender id matches the one you've designated for "Other"
    if (formData.primaryGender && formData.primaryGender.id === 4) {
      navigate('/pageTwoExtraQuestionnaire'); // Assuming this is the route for page 2.5
    } else {
      navigate('/pageTwoQuestionnaire'); // Assuming this is the route for page 2
    }
  };

  const PREFER_NOT_TO_ANSWER_ID = 1; 

  // Handles checkbox change for self-identification options and map areas.
  const handleSelfIdChange = (event, selectedOption) => {
      const isPreferNotToAnswerSelected = selectedOption.id === PREFER_NOT_TO_ANSWER_ID;
      
      const updatedOptions = selfIdOptions.map(option => {
          if (option.id === selectedOption.id) {
              return { ...option, checked: !option.checked }; // Toggle the current option
          } else if (isPreferNotToAnswerSelected) {
              return { ...option, checked: false }; // Uncheck all if Prefer Not To Answer is selected
          } else {
              return { ...option, checked: option.id === PREFER_NOT_TO_ANSWER_ID ? false : option.checked }; // Uncheck Prefer Not To Answer if any other option is selected
          }
      });

      setSelfIdOptions(updatedOptions);

      // Update formData with selected self-identification options
      const selectedOptions = updatedOptions.filter(option => option.checked).map(option => ({
          id: option.id,
          label: option.name,
      }));

      updateFormData({
          ...formData,
          selfIdentificationOptions: selectedOptions,
      });
  };

    // Handles changes in map area selection, updating both local and global state.
  const handleMapAreaChange = (event, selectedOption) => {
      const isPreferNotToAnswerSelected = selectedOption.id === PREFER_NOT_TO_ANSWER_ID;
      
      const updatedMapAreas = mapAreas.map(area => {
          if (area.id === selectedOption.id) {
              return { ...area, checked: !area.checked }; // Toggle the current option
          } else if (isPreferNotToAnswerSelected) {
              return { ...area, checked: false }; // Uncheck all if Prefer Not To Answer is selected
          } else {
              return { ...area, checked: area.id === PREFER_NOT_TO_ANSWER_ID ? false : area.checked }; // Uncheck Prefer Not To Answer if any other option is selected
          }
      });

      setMapAreas(updatedMapAreas);

      // Update formData with selected map areas
      const selectedAreas = updatedMapAreas.filter(area => area.checked).map(area => ({
          mapID: area.id,
          mapName: area.name,
      }));

      updateFormData({
          ...formData,
          mapSelections: selectedAreas,
      });
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-[#f6cdd0]">
      <NavBar />
      <Banner />
      <Shadow />
      <div className="flex-grow pt-20 pb-20 mt-24 flex flex-col items-center justify-center w-full">
        <div className="max-w-[800px] w-full px-4 lg:px-8 space-y-12">
          <h1 className="text-5xl font-bold mb-16 text-center text-[#704218]">{t('pageThreeQuestionnaire:title')}</h1>
          <Dropdown
            placeholder={t('pageThreeQuestionnaire:newcomerQuestion')}
            options={newcomerStatusOptions}
            onSelect={handleSelect}
            selectedValue={newcomerStatus}
          />
          <div className="flex flex-col items-center justify-center">
            <textarea
              className="w-full p-2 border rounded"
              placeholder={t('pageThreeQuestionnaire:commentPlaceholder')}
              maxLength="255"
              value={newcomerComment}
              onChange={handleNewcomerCommentChange}
              rows="5"
            ></textarea>
            <div className="text-right w-full pr-2">
              {`${newcomerComment.length}/255`}
            </div>
          </div>
          {/* Self-Identification Section */}
          <div className="w-full">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">{t('pageThreeQuestionnaire:selfIdentificationSection')}</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {selfIdOptions.map((option) => (
                <Checkbox
                  key={option.id}
                  options={[{
                    id: option.id.toString(),
                    name: option.name,
                    checked: option.checked,
                  }]}
                  onChange={(e) => handleSelfIdChange(e, option)}
                  // Pass any additional props if necessary
                />
              ))}
            </div>
          </div>
          <div className="w-full">
            <h2 className="text-xl font-semibold mb-4">{t('pageThreeQuestionnaire:originSection')}</h2>
            {Object.entries(groupedMapAreas).map(([continent, areas]) => (
              <div key={continent}>
                <h3 className="text-lg font-semibold">{continent}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {areas.map((area) => (
                    <div
                      key={area.id}
                      title={area.name} // Tooltip for the entire area
                      className="p-2" // Add padding or any other required styles
                    >
                      <Checkbox
                        options={[{
                          id: area.id.toString(),
                          name: area.name,
                          checked: area.checked,
                        }]}
                        onChange={(e) => handleMapAreaChange(e, area)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            {modalContent}
          </Modal>
          <div className="flex justify-between w-full mt-8">
            <Button text={t('pageThreeQuestionnaire:buttons.previous')}  onClick={handlePreviousClick} style={{ marginRight: '15px' }} />
            <Button text={t('pageThreeQuestionnaire:buttons.next')} onClick={handleNextClick} disabled={!isFormValid}/>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PageThreeQuestionnaire;
