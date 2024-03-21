import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Banner from "../components/Banner";
import Shadow from "../components/Shadow";
import Footer from "../components/Footer";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { FaInfoCircle } from "react-icons/fa";
import Checkbox from "../components/Checkbox";
import { fetchGenderIdentities } from "../api/genderIdentityApi";
import { useForm } from '../context/FormContext';
import mockGenderIdentities from "../data/genderIdentities";

const PageTwoExtraQuestionnaire = () => {
  const navigate = useNavigate();
  const { formData, updateFormData, workshopId } = useForm();
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [selectedGenders, setSelectedGenders] = useState({});
  const [preferNotToAnswer, setPreferNotToAnswer] = useState(false);
  const [genderIdentities, setGenderIdentities] = useState([]);
  const [otherGenderIdentity, setOtherGenderIdentity] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dbData = await fetchGenderIdentities();
        const enhancedData = dbData.map(dbItem => {
          const additionalInfo = mockGenderIdentities.find(mockItem => mockItem.name.toLowerCase() === dbItem.type.toLowerCase());
          return {
            gender_identity_id: dbItem.gender_identity_id,
            type: dbItem.type,
            info: additionalInfo ? additionalInfo.info : 'No additional information.',
            checked: formData.genderIdentities?.some(genderIdentity => genderIdentity.id === dbItem.gender_identity_id.toString()),
          };
        });
        setGenderIdentities(enhancedData);
        
        // Initialize selectedGenders based on formData
        const selectedFromFormData = formData.genderIdentities?.reduce((acc, curr) => {
          acc[curr.id] = true;
          return acc;
        }, {}) || {};
  
        // Include "Prefer Not To Answer" in selectedGenders if it's initially selected
        if (formData.genderIdentities?.some(identity => identity.id === "1")) {
          selectedFromFormData["1"] = true;
        }
  
        setSelectedGenders(selectedFromFormData);
        
        // Initialize preferNotToAnswer state based on form data
        setPreferNotToAnswer(formData.genderIdentities?.some(identity => identity.id === "1"));
      
        // Initialize otherGenderIdentity state based on form data
        setOtherGenderIdentity(formData.custom_gender || ''); // Set to custom_gender if available, otherwise empty string

      } catch (error) {
        console.error("Failed to fetch gender identities", error);
      }
    };
    fetchData();
  }, [formData.genderIdentities, formData.custom_gender]); // Depend on formData.genderIdentities to reset if it changes
  
  // Adjusted to handle the correct properties
  const handlePreviousClick = () => navigate('/pageTwoQuestionnaire');

  const handleNextClick = () => {
    const selectedGenderIdentities = Object.entries(selectedGenders)
      .filter(([_, isSelected]) => isSelected)
      .map(([id, _]) => ({
        id: id, // Keep the ID
        name: genderIdentities.find(identity => identity.gender_identity_id.toString() === id).type // Find and keep the name
      }));
    
    // Validation logic to ensure either a selection is made or a custom gender is provided
    if (selectedGenderIdentities.length === 0 && !preferNotToAnswer && !otherGenderIdentity.trim()) {
      // No selections made and no custom gender provided, show reminder modal
      setModalContent("<p>Please select at least one gender identity, choose 'Prefer Not To Answer', or specify another identity to continue.</p>");
      setShowModal(true);
      return; // Stop execution to prevent navigation
    }
  
    // Proceed with navigation and data handling as before, but with the updated structure
    const currentFormData = { ...formData };
    
    // Include selected gender identities or 'Prefer Not To Answer' if that was chosen
    currentFormData.genderIdentities = preferNotToAnswer ? [{ id: "1", name: "Prefer Not To Answer" }] : selectedGenderIdentities;
  
    // Include custom gender if provided
    if (otherGenderIdentity.trim()) {
      currentFormData.custom_gender = otherGenderIdentity.trim();
    } else {
      // Ensure there's no stale custom_gender value if none is provided
      delete formData.custom_gender;
    }
  
    updateFormData(currentFormData);
  
    // Log and navigate
    console.log("Current workshop ID:", workshopId);
    console.log('Selected Gender Identities:', selectedGenderIdentities.map(identity => `${identity.name} (ID: ${identity.id})`));
    console.log('Updated FormData after page 2.5:', currentFormData);
    
    navigate('/pageThreeQuestionnaire');
  };
  
  
  const handlePreferNotToAnswerChange = (isChecked) => {
    setPreferNotToAnswer(isChecked);
    if (isChecked) {
      // Clear other selections if 'Prefer Not To Answer' is checked
      setSelectedGenders({ "1": true }); // Assuming "Prefer Not To Answer" has ID 1
    } else {
      // Reset the selectedGenders state, removing "Prefer Not To Answer"
      const { "1": _, ...rest } = selectedGenders;
      setSelectedGenders(rest);
    }
  };

  // Adjust the toggle function to work with 'gender_identity_id'
  const toggleGenderSelection = (gender_identity_id) => {
    if (preferNotToAnswer) return;
    setSelectedGenders(prev => ({ ...prev, [gender_identity_id]: !prev[gender_identity_id] }));
  };

  const handleInfoClick = (info) => {
    setModalContent(info);
    setShowModal(true);
  };

  // Assuming you have the otherGenderIdentity state setup
const handleOtherGenderIdentityChange = (e) => {
  const value = e.target.value;
  setOtherGenderIdentity(value);

  // Update form data immediately
  updateFormData({
    ...formData,
    customGender: value.trim() // Update custom_gender field
  })
;};


  const renderGenderIdentities = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 place-items-start ml-12">
        {genderIdentities.map(({ gender_identity_id, type, info }) => {
          const isPreferNotToAnswer = gender_identity_id === 1; // Assuming ID 1 is "Prefer Not To Answer"
          const handleChange = isPreferNotToAnswer
            ? () => handlePreferNotToAnswerChange(!preferNotToAnswer)
            : () => toggleGenderSelection(gender_identity_id.toString());

          return (
            <div key={gender_identity_id} className="flex justify-between items-center w-full px-4">
              <div className="flex items-center space-x-2">
                <button onClick={() => handleInfoClick(info)} className="flex-shrink-0">
                  <FaInfoCircle className="text-xl text-black" />
                </button>
                <Checkbox
                  options={[{
                    id: gender_identity_id.toString(),
                    name: type,
                    checked: isPreferNotToAnswer ? preferNotToAnswer : !!selectedGenders[gender_identity_id],
                    disabled: !isPreferNotToAnswer && preferNotToAnswer // Disable other checkboxes if 'Prefer Not To Answer' is checked
                  }]}
                  onChange={handleChange}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
};

  return (
    <div className="flex flex-col min-h-screen bg-[#f6cdd0]">
      <NavBar />
      <Banner />
      <Shadow />
      <div className="flex-grow pt-20 pb-20 mt-24 flex flex-col items-center justify-center w-full">
        <div className="max-w-[800px] w-full px-4 lg:px-8 space-y-12">
          <h1 className="text-5xl font-bold mb-16 text-center text-[#704218]">All Applicable Gender Identities</h1>
          {renderGenderIdentities()}
          <div className="mt-4">
                  <label htmlFor="customGenderIdentity" className="block text-sm font-medium text-gray-700">
                    If you can't find your gender identity in the list, please specify:
                  </label>
                  <input
                    type="text"
                    name="customGenderIdentity"
                    id="customGenderIdentity"
                    value={otherGenderIdentity}
                    onChange={handleOtherGenderIdentityChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Custom Gender Identity"
                  />
                </div>
          <div className="flex justify-between w-full mt-8">
            <Button text="PREVIOUS QUESTION" onClick={handlePreviousClick} className="text-lg py-3 px-6" />
            <Button text="NEXT QUESTION" onClick={handleNextClick} className="text-lg py-3 px-6 mx-4" />
          </div>
        </div>
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} htmlContent={modalContent} />
      <Footer />
    </div>
  );
};

export default PageTwoExtraQuestionnaire;
