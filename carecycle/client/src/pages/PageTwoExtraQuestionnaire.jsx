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
import Checkbox from "../components/Checkbox";

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
    setModalContent(info);
    setShowModal(true);
  };
  
  const handlePreferNotToAnswerChange = () => {
    setPreferNotToAnswer(!preferNotToAnswer);
    if (!preferNotToAnswer) {
      setSelectedGenders({});
      setOther('');
    }
  };

  const renderGenderIdentities = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 place-items-start ml-12">
        {genderIdentities.map(({ id, name, info }) => (
          <div key={id} className="flex justify-between items-center w-full px-4">
            <div className="flex items-center space-x-2">
              <button onClick={() => handleInfoClick(info)} className="flex-shrink-0">
                <FaInfoCircle className="text-xl text-black" />
              </button>
              <Checkbox
                options={[{ id, label: name, checked: !!selectedGenders[id], disabled: preferNotToAnswer }]}
                onChange={() => toggleGenderSelection(id)}
              />
            </div>
            <div className="flex-grow"></div> {/* Invisible spacer */}
          </div>
        ))}
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
          <div className="flex justify-center mt-8">
            <input
              type="text"
              placeholder="If other, please specify"
              value={other}
              onChange={e => setOther(e.target.value)}
              disabled={preferNotToAnswer}
              className="w-full max-w-md p-4 border-2 border-gray-400 rounded-lg text-lg"
            />
          </div>
          <div className="flex justify-center mt-4">
            <Checkbox 
              options={[{ id: 'pnta', label: 'Prefer Not To Answer', checked: preferNotToAnswer }]}
              onChange={handlePreferNotToAnswerChange}
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
