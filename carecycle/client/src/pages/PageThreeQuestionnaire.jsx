import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Banner from "../components/Banner";
import Shadow from "../components/Shadow";
import Footer from "../components/Footer";
import Button from "../components/Button";
import Checkbox from "../components/Checkbox";
import Modal from "../components/Modal"; 
import { fetchMapAreas } from "../api/mapAreaApi";
import { useForm } from '../context/FormContext';

const PageThreeQuestionnaire = () => {
  const navigate = useNavigate();
  const { formData, updateFormData, workshopId } = useForm();
  const [mapAreas, setMapAreas] = useState([]);
  const [showModal, setShowModal] = useState(false); 
  const [modalContent, setModalContent] = useState(''); 

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

  const handleNextClick = () => {
    if (!formData.mapSelections || formData.mapSelections.length === 0) {
      setModalContent("Please select at least one map area to continue.");
      setShowModal(true);
      return;
    }

    // Before navigating, log the updated formData to the console
    console.log("Proceeding with workshop ID:", workshopId);
    console.log("Map areas selected:", formData.mapSelections);
    console.log("Updated FormData after page 3:", formData);

    navigate('/pageFourQuestionnaire'); // Adjust as necessary for your routing
  };

  const handlePreviousClick = () => navigate('/pageTwoExtraQuestionnaire');

  const handleCheckboxChange = (event, option) => {
    // Toggle the checked state of the selected option
    const updatedMapAreas = mapAreas.map(area => 
      area.id === option.id ? {...area, checked: !area.checked} : area
    );
    setMapAreas(updatedMapAreas);

    // Update the formData with the current selections
    updateFormData({
      ...formData,
      mapSelections: updatedMapAreas.filter(area => area.checked).map(area => ({
        mapID: area.id,
        mapName: area.name,
      }))
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
          {/* Render the Checkbox component for map area selections */}
          <Checkbox
            title="Select Map Areas"
            options={mapAreas}
            onChange={handleCheckboxChange}
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
