import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Banner from "../components/Banner";
import Shadow from "../components/Shadow";
import Footer from "../components/Footer";
import Button from "../components/Button";
import Dropdown from "../components/DropDown";
import Modal from "../components/Modal"; 
import { fetchMapRegions } from "../api/dropdownApi";
import { useForm } from '../context/FormContext';

const PageThreeQuestionnaire = () => {
  const navigate = useNavigate();
  const { formData, updateFormData, workshopId } = useForm();
  const [mapRegions, setMapRegions] = useState([]);
  const [showModal, setShowModal] = useState(false); // Add this state
  const [modalContent, setModalContent] = useState(''); // Add this state

  useEffect(() => {
    const loadMapRegions = async () => {
      try {
        const regions = await fetchMapRegions();
        setMapRegions(regions);
      } catch (error) {
        console.error("Failed to fetch map regions:", error);
      }
    };
    loadMapRegions();
  }, []);

  const handleNextClick = () => {
    // Check if a selection has been made
    if (!formData.mapSelection || !formData.mapSelection.mapID) {
      // Set the modal content to your reminder message
      setModalContent("Please make a selection to continue to the next page.");
      // Show the modal
      setShowModal(true);
      return; // Prevent navigation to the next page
    }
  
    // If a selection is made, potentially reset the modal content or handle as necessary
    console.log("Current workshop ID:", workshopId);
    console.log('Selected map region:', formData.mapSelection.mapName);
    console.log('Updated FormData after page 3:', formData);
    
    // Proceed to the next page
    navigate('/pageFourQuestionnaire');
  };

  const handlePreviousClick = () => navigate('/pageTwoExtraQuestionnaire');

  const handleDropdownChange = (selectedValue) => {
    // Find the selected map region object from the mapRegions array
    const selectedRegion = mapRegions.find(region => region.map_id === selectedValue);
  
    // Update the formData with an object that includes both the id and the name of the selected region
    if (selectedRegion) {
      updateFormData({
        ...formData,
        mapSelection: {
          mapID: selectedRegion.map_id,
          mapName: selectedRegion.map_area_name
        }
      });
    }
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
            options={mapRegions.map(({ map_id, map_area_name }) => ({
              label: map_area_name,
              value: map_id
            }))}
            selectedValue={formData.mapSelection ? formData.mapSelection.mapID : null}
            onSelect={handleDropdownChange}
            placeholder="Select Place of Origin"
          />
          <img
            className="w-full h-auto rounded shadow-lg border-2 border-black mb-4"
            src="/photos/map.jpeg"
            alt="Map of the world."
          />
          <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            {modalContent}
          </Modal>
          <div className="flex justify-between w-full mt-8">
            <Button text="PREVIOUS QUESTION" onClick={handlePreviousClick} className="text-white bg-[#16839B] hover:bg-[#0f6a8b] font-bold py-2 px-4 rounded" />
            <Button text="NEXT QUESTION" onClick={handleNextClick} className="text-white bg-[#16839B] hover:bg-[#0f6a8b] font-bold py-2 px-4 mx-4 rounded" />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PageThreeQuestionnaire;
