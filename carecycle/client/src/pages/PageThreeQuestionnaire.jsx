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

const PageThreeQuestionnaire = () => {
  const navigate = useNavigate();
  // Accesses form context for global form state management.
  const { formData, updateFormData, workshopId } = useForm();
  // State management for dynamic form elements and modal.
  const [mapAreas, setMapAreas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [newcomerStatus, setNewcomerStatus] = useState(formData.newcomerStatus || '');
  const [newcomerStatusOptions, setNewcomerStatusOptions] = useState([]);
  const [newcomerComment, setNewcomerComment] = useState('');
  const [selfIdOptions, setSelfIdOptions] = useState([]);
  
  // Effect hook for loading self-identification options on component mount.
  useEffect(() => {
    const loadSelfIdOptions = async () => {
      try {
        const data = await fetchSelfIdentificationOptions();
        setSelfIdOptions(data.map(option => ({
          ...option,
          id: option.self_identification_id,
          name: option.option,
          checked: false,
        })));
      } catch (error) {
        console.error("Failed to fetch self-identification options:", error);
      }
    };
    
    loadSelfIdOptions();
  }, []);

  // Effect hook for loading map area data on component mount or form data changes.
  useEffect(() => {
    const loadMapAreas = async () => {
      try {
        const areas = await fetchMapAreas(); 
        setMapAreas(areas.map(area => ({
          ...area,
          id: area.map_id,
          name: area.map_area_name,
          checked: formData.mapSelections?.some(selection => selection.mapID === area.map_id) || false,
        })));
      } catch (error) {
        console.error("Failed to fetch map areas:", error);
      }
    };
    loadMapAreas();
  }, [formData.mapSelections]);

  // Loads newcomer status options from an API on component mount.
  useEffect(() => {
    const loadNewcomerStatusOptions = async () => {
      try {
        const statuses = await fetchNewcomerStatus();
        setNewcomerStatusOptions(statuses.map(status => ({
          value: status.newcomer_status_id,
          label: status.status,
        })));
      } catch (error) {
        console.error("Failed to fetch newcomer statuses:", error);
      }
    };
    loadNewcomerStatusOptions();
  }, []);

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
    if (!formData.mapSelections || formData.mapSelections.length === 0) {
      setModalContent("Please select at least one map area to continue.");
      setShowModal(true);
      return;
    }

    console.log("Proceeding with workshop ID:", workshopId);
    console.log("Newcomer Status:", formData.newcomerStatus.label);
    console.log("Map areas selected:", formData.mapSelections);
    console.log("Selected Self-Identification Options:", formData.selfIdentificationOptions);
    console.log("Updated FormData after page 3:", formData);

    navigate('/pageFourQuestionnaire');
  };

  // Navigation back to the previous page.
  const handlePreviousClick = () => navigate('/pageTwoExtraQuestionnaire');

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
          <h1 className="text-5xl font-bold mb-16 text-center text-[#704218]">Place of Origin</h1>
          <Dropdown
            placeholder="Do you consider yourself to be a newcomer?"
            options={newcomerStatusOptions}
            onSelect={handleSelect}
            selectedValue={newcomerStatus}
          />
          <div className="flex flex-col items-center justify-center">
            <textarea
              className="w-full p-2 border rounded"
              placeholder="Leave a comment (optional)"
              maxLength="255"
              value={newcomerComment}
              onChange={handleNewcomerCommentChange}
              rows="5"
            ></textarea>
            <div className="text-right w-full pr-2">
              {`${newcomerComment.length}/255`}
            </div>
          </div>
          <Checkbox
            title="Do you consider yourself to be a:"
            options={selfIdOptions}
            onChange={handleSelfIdChange}
          />
          <Checkbox
            title="Where do you consider your origins to be?"
            options={mapAreas}
            onChange={handleMapAreaChange}
          />
          <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            {modalContent}
          </Modal>
          <div className="flex justify-between w-full mt-8">
            <Button text="PREVIOUS QUESTION" onClick={handlePreviousClick} style={{ marginRight: '15px' }} />
            <Button text="NEXT QUESTION" onClick={handleNextClick} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PageThreeQuestionnaire;
