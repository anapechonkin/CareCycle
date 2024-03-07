import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import Banner from "../components/Banner";
import Shadow from "../components/Shadow";
import Footer from "../components/Footer";
import Dropdown from "../components/DropDown";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";
import { useForm } from '../context/FormContext';
import { fetchWorkshops } from "../api/dropdownApi";

const StartQuestionnairePage = () => {
  const [workshops, setWorkshops] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { workshopId , setWorkshopId, clearWorkshopId } = useForm(); // Use the setWorkshopId directly for updating workshopId

  const handleStartNewSession = () => {
    clearWorkshopId(); // Clear workshopId to start a new session
  };

  useEffect(() => {
    const loadWorkshops = async () => {
      try {
        const workshopsData = await fetchWorkshops();
        setWorkshops(workshopsData.map(workshop => ({
          value: workshop.workshop_id, 
          label: workshop.name
        })));
      } catch (error) {
        console.error("Error loading workshops:", error);
      }
    };

    loadWorkshops();
  }, []);

  const handleSelect = (selectedOption) => {
    console.log("Selected option:", selectedOption);
    setWorkshopId(selectedOption); // This updates the workshopId in the context
  };

  const handleClick = () => {
    if (!workshopId) { // Check if no workshop is selected
      setIsModalOpen(true);
    } else {
      // Find the workshop by ID to log both ID and name
      const selectedWorkshop = workshops.find(workshop => workshop.value === workshopId);
      if (selectedWorkshop) {
        console.log(`Selected workshop ID: ${selectedWorkshop.value}, Name: ${selectedWorkshop.label}`);
      }
      navigate('/pageOneQuestionnaire');
    }
  };
  

  return (
    <div className="flex flex-col min-h-screen bg-[#f6cdd0]">
      <NavBar />
      <Banner />
      <Shadow />
      <div className="flex-grow pt-20 pb-20 mt-24 flex flex-col items-center justify-center w-full">
        <div className="max-w-[800px] w-full px-4 lg:px-8 space-y-12">
          <h1 className="text-6xl font-bold mb-16 text-center text-[#704218]">Client Stats Questionnaire</h1>
          <Button 
            onClick={handleStartNewSession} 
            className="start-new-session-button-styles"
            text="START NEW SESSION"
          />
          <Dropdown
            options={workshops}
            placeholder="Choose Type of Activity"
            onSelect={handleSelect}
            selectedValue={workshopId} // Ensure you are passing the correct value for controlled behavior
          />
          <img
            className="w-full h-auto rounded shadow-lg border-2 border-black"
            src="/photos/DIYWorkshop.jpg"
            alt="Workshop"
          />
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={() => setIsModalOpen(false)}
            htmlContent="<p>Please select a workshop before starting the questionnaire.</p>"
            showOkButton={true}
            okButtonText="OK"
          />
          <Button 
            onClick={handleClick}
            text="START QUESTIONNAIRE"
            className="text-white bg-[#16839B] hover:bg-[#0f6a8b] font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-150 ease-in-out"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StartQuestionnairePage;
