import React, { useState } from "react";
import NavBar from "../components/NavBar";
import Banner from "../components/Banner";
import Shadow from "../components/Shadow";
import Footer from "../components/Footer";
import Button from "../components/Button";
import Modal from "../components/Modal"; 
import { useNavigate } from "react-router-dom";

const PageFourQuestionnaire = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [rulesAccepted, setRulesAccepted] = useState(null);

  const handleSubmitQuestionnaire = () => {
    // Placeholder for actual submission logic
    const submissionSuccess = true; // Simulate success

    if (submissionSuccess) {
      setModalMessage('You have successfully submitted the questionnaire.');
    } else {
      setModalMessage('There was an issue submitting your questionnaire. Please try again.');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate('/pageOneQuestionnaire'); // Navigate back to start a new session
  };

  const handlePreviousClick = () => navigate('/pageThreeQuestionnaire');

  return (
    <div className="flex flex-col min-h-screen bg-[#f6cdd0]">
      <NavBar />
      <Banner />
      <Shadow />
      <div className="flex-grow pt-20 pb-20 mt-24 flex flex-col items-center justify-center w-full">
        <div className="max-w-[900px] w-full px-4 lg:px-8 space-y-12">
          <h1 className="text-6xl font-bold mb-16 text-center text-[#704218] [text-shadow:0px_4px_4px_#00000040]">Rules and Values</h1>
          <div className="overflow-auto h-80 border-2 border-black rounded-lg shadow-lg p-6 mb-6 bg-white text-xl">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p><br></br>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
          <div className="flex justify-center mt-6 text-2xl">
            <label className="flex items-center m">
              <input
                type="radio"
                name="rulesAccepted"
                value="accept"
                checked={rulesAccepted === true}
                onChange={() => setRulesAccepted(true)}
              />
              <span className="ml-2">Accept</span>
            </label>
            <label className="flex items-center mx-8">
              <input
                type="radio"
                name="rulesAccepted"
                value="decline"
                checked={rulesAccepted === false}
                onChange={() => setRulesAccepted(false)}
              />
              <span className="ml-2">Decline</span>
            </label>
          </div>
          <div className="flex items-center w-full mt-8">
            <Button
              text="PREVIOUS QUESTION"
              onClick={handlePreviousClick}
              className="text-white bg-[#16839B] hover:bg-[#0f6a8b] font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-150 ease-in-out"
            />
            <Button
              text="SUBMIT QUESTIONNAIRE"
              onClick={handleSubmitQuestionnaire}
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
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <p>{modalMessage}</p>
      </Modal>
      <Footer />
    </div>
  );
};

export default PageFourQuestionnaire;
