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
import { useTranslation } from 'react-i18next';

const StartQuestionnairePage = () => {
  const [workshops, setWorkshops] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { workshopId, setWorkshopId, setWorkshopName } = useForm();
  const { t } = useTranslation('startQuestionnaire');

  useEffect(() => {
    const loadWorkshops = async () => {
      try {
        const workshopsData = await fetchWorkshops();
        setWorkshops(workshopsData.map(workshop => ({
          value: workshop.workshop_id, 
          label: t(`startQuestionnaire:workshops.${workshop.name.replace(/[\s/]/g, '_')}`)
        })));
      } catch (error) {
        console.error("Error loading workshops:", error);
      }
    };

    loadWorkshops();
  }, [t]); // Include t in the dependency array to reload workshops when language changes

  const handleSelect = (selectedOptionValue) => {
    // Set the workshop ID in the context
    setWorkshopId(selectedOptionValue);

    // Find the workshop by its value (ID) in the workshops array
    const selectedWorkshop = workshops.find(workshop => workshop.value === selectedOptionValue);

    // If the workshop is found, set its name in the context
    if (selectedWorkshop) {
        setWorkshopName(selectedWorkshop.label);
    }
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
          <h1 className="text-6xl font-bold mb-16 text-center text-[#704218]">{t('startQuestionnaire:titleStartQuestionnaire')}</h1>
          <Dropdown
            options={workshops}
            placeholder={t('startQuestionnaire:chooseActivity')}
            onSelect={handleSelect}
            selectedValue={workshopId}
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
            htmlContent={t('startQuestionnaire:modalContentSelectWorkshop')}
            showOkButton={true}
            okButtonText={t('startQuestionnaire:okButton')}
          />
          <Button 
            onClick={handleClick}
            text={t('startQuestionnaire:startButtonQuestionnaire')}
            className="text-white bg-[#16839B] hover:bg-[#0f6a8b] font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-150 ease-in-out"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StartQuestionnairePage;
