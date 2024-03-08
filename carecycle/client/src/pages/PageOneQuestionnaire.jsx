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

const PageOneQuestionnaire = () => {
  const [postalCode, setPostalCode] = useState('');
  const [yearOfBirth, setYearOfBirth] = useState('');
  const [preferNotToAnswerPostal, setPreferNotToAnswerPostal] = useState(false);
  const [preferNotToAnswerYear, setPreferNotToAnswerYear] = useState(false);
  const [declined, setDeclined] = useState(null);
  const { formData, updateFormData, workshopId } = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const navigate = useNavigate();

  // Disable checkboxes when declined is true
  useEffect(() => {
    if (declined === true) {
      setPreferNotToAnswerPostal(true);
      setPreferNotToAnswerYear(true);
    }
  }, [declined, preferNotToAnswerPostal, preferNotToAnswerYear]);

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
      setPreferNotToAnswerPostal(isChecked);
      updateFormData({ ...formData, postalCode: isChecked ? 'Prefer Not To Answer' : postalCode });
    } else if (optionId === 'year') {
      setPreferNotToAnswerYear(isChecked);
      updateFormData({ ...formData, yearOfBirth: isChecked ? '0000' : yearOfBirth });
    }
  };

  const handleClick = () => {
    if (declined === null) {
      setModalContent('Please select an option to provide consent before continuing with the questionnaire.');
      setIsModalOpen(true);
    } else if (declined === true) {
      setModalContent('You have declined to participate in this questionnaire. Please give the device back to the volunteer/employee.');
      setIsModalOpen(true);
    } else {
      console.log("Current workshop ID:", workshopId);
      console.log('FormData after page one:', formData);
      navigate('/pageTwoQuestionnaire');
    }
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    setPostalCode('');
    setYearOfBirth('');
    setPreferNotToAnswerPostal(false);
    setPreferNotToAnswerYear(false);
    setDeclined(null);
    updateFormData({});
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-[#f6cdd0]">
      <NavBar />
      <Banner />
      <Shadow />
      <div className="flex-grow pt-20 pb-20 mt-24 flex flex-col items-center justify-center w-full">
        <div className="max-w-[800px] w-full px-4 lg:px-8">
          <h1 className="text-4xl font-bold mb-12 text-center text-[#704218] [text-shadow:0px_4px_4px_#00000040]">Stats Help Get Grants, Thank You!</h1>
          <h2 className="text-3xl font-bold mb-8 text-center text-[#8D5E32] [text-shadow:0px_4px_4px_#00000040]">Please Choose Language</h2>
          <Dropdown
            options={['English', 'French', 'Spanish', 'Hindi', 'Urdu', 'Punjabi']}
            placeholder="Select Language"
            onSelect={(selectedOption) => console.log("Selected option:", selectedOption)}
          />
          <p className="m-8 text-xl">I consent to the data obtained from this questionnaire being used for grant applications</p>
          <div className="flex justify-center items-center space-x-8 mb-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="consent"
                value="accept"
                checked={declined === false}
                onChange={() => { setDeclined(false); console.log("Consent: Accepted"); }}
              />
              <span className="ml-2">I accept</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="consent"
                value="decline"
                checked={declined === true}
                onChange={() => { setDeclined(true); console.log("Consent: Declined"); }}
              />
              <span className="ml-2">I decline</span>
            </label>
          </div>
          <input
            type="text"
            placeholder="Please Enter Your Postal Code"
            className="mt-4 p-2 border border-black rounded-lg w-full"
            onChange={handleInputChange}
            name="postalCode"
            disabled={preferNotToAnswerPostal || declined === true}
            value={postalCode}
          />
          <Checkbox
            options={[{ id: 'postal', name: 'Prefer Not To Answer', checked: preferNotToAnswerPostal }]}
            onChange={() => handleCheckboxChange('postal', !preferNotToAnswerPostal)}
          />
          <input
            type="text"
            placeholder="Please Enter Your Year of Birth (YYYY)"
            className="mt-4 p-2 border border-black rounded-lg w-full"
            onChange={handleInputChange}
            name="yearOfBirth"
            disabled={preferNotToAnswerYear || declined === true}
            value={yearOfBirth}
          />
          <Checkbox
            options={[{ id: 'year', name: 'Prefer Not To Answer', checked: preferNotToAnswerYear }]}
            onChange={() => handleCheckboxChange('year', !preferNotToAnswerYear)}
          />
          <div className="flex flex-col items-center mt-8 space-y-4">
            {isModalOpen && (
              // When setting up the Modal in your component's return statement
              <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onConfirm={handleModalConfirm}
                showCancelButton={false} // Example: Assuming you don't need a cancel button for now
              >
                {modalContent}
              </Modal>
            )}
            <Button
              text="NEXT QUESTION"
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
