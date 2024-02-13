import React, { useState } from "react";
import genderIdentities from "../data/genderIdentities"; 
import Banner from "../components/Banner";
import NavBar from "../components/NavBar";
import Shadow from "../components/Shadow";
import Footer from "../components/Footer";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";
import { FaInfoCircle } from "react-icons/fa"; 

const PageTwoExtraQuestionnaire = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [selectedGenders, setSelectedGenders] = useState({});
  const [other, setOther] = useState('');
  const [preferNotToAnswer, setPreferNotToAnswer] = useState(false);

  const handlePreviousClick = () => navigate('/pageTwoQuestionnaire');
  const handleNextClick = () => navigate('/pageThreeQuestionnaire');
  
  const toggleGenderSelection = (id) => {
    if (preferNotToAnswer) return;
    setSelectedGenders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleInfoClick = (info) => {
    // Directly assign the HTML string to modalContent
    setModalContent(info);
    setShowModal(true);
  };
  
  const handlePreferNotToAnswer = () => {
    setPreferNotToAnswer(!preferNotToAnswer);
    if (!preferNotToAnswer) {
      setSelectedGenders({});
      setOther('');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f6cdd0]">
      <NavBar />
      <Banner />
      <Shadow />
      <div className="flex-grow pt-20 pb-20 mt-24 flex flex-col items-center justify-center w-full">
        <div className="max-w-[800px] w-full px-4 lg:px-8 space-y-12">
        <h1 className="text-5xl font-bold mb-16 text-center text-[#704218] [text-shadow:0px_4px_4px_#00000040]">All Applicable Gender Identities</h1>
          <div className="grid grid-cols-2 gap-6">
            {genderIdentities.map(({ id, name, info }) => (
              <div key={id} className="flex items-center space-x-3">
                <FaInfoCircle onClick={() => handleInfoClick(info)} className="text-2xl cursor-pointer" />
                <input
                  type="checkbox"
                  checked={!!selectedGenders[id]}
                  onChange={() => toggleGenderSelection(id)}
                  disabled={preferNotToAnswer}
                  className="form-checkbox h-6 w-6"
                />
                <label className="text-xl">{name}</label>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <input
              type="text"
              placeholder="If other, enter here"
              value={other}
              onChange={e => setOther(e.target.value)}
              disabled={preferNotToAnswer}
              className="w-full max-w-md p-4 border-2 border-gray-400 rounded-lg text-lg"
            />
          </div>
          <div className="flex justify-center mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferNotToAnswer}
                onChange={handlePreferNotToAnswer}
                className="form-checkbox h-6 w-6"
              />
              <span className="ml-2 text-xl">Prefer Not To Answer</span>
            </label>
          </div>
          <div className="flex justify-between w-full mt-8">
            <Button 
                    text="PREVIOUS QUESTION" 
                    onClick={handlePreviousClick} 
                    className="text-lg py-3 px-6" />
            <Button 
                    text="NEXT QUESTION" 
                    onClick={handleNextClick} 
                    className="text-lg py-3 px-6 mx-4" />
          </div>
          <div className="flex flex-col items-center space-y-2 mt-8">
            <div className="text-center text-lg">Page</div>
            <div className="flex space-x-2 text-lg">
              <span>1</span>
              <span>2</span>
              <span className="font-bold">2.5</span>
              <span>3</span>
              <span>4</span>
            </div>
          </div>
        </div>
      </div>
      {/* Modal component */}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} htmlContent={modalContent} />
      <Footer />
    </div>
  );
};

export default PageTwoExtraQuestionnaire;
