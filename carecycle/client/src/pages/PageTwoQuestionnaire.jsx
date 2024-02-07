import React, { useState } from "react";
import NavBar from "../components/NavBar";
import Banner from "../components/Banner";
import Shadow from "../components/Shadow";
import Footer from "../components/Footer";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

const PageTwoQuestionnaire = () => {
  const navigate = useNavigate();
  const [selectedGender, setSelectedGender] = useState('');

  // Function to navigate based on gender selection
  const handleNextClick = () => {
    if (selectedGender === 'Other') {
      navigate('/pageTwoExtraQuestionnaire'); // Navigate to extra questions for "Other" selection
    } else {
      navigate('/pageThreeQuestionnaire'); // Navigate to the next page for all other selections
    }
  };
  
  //Function to navigate to previous page
  const handlePreviousClick = () => navigate('/pageOneQuestionnaire');

  // Function to handle gender selection
  const handleGenderChange = (event) => setSelectedGender(event.target.value);

  const genderOptions = [
    { label: "Male", imgSrc: "/icons/male.png" },
    { label: "Female", imgSrc: "/icons/female.png" },
    { label: "Other", imgSrc: "/icons/other.png" },
    { label: "Prefer Not to Answer", imgSrc: "/icons/noAnswer.png"  } 
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f6cdd0]">
      <NavBar />
      <Banner />
      <Shadow />
      <div className="flex-grow pt-20 pb-20 mt-24 flex flex-col items-center justify-center w-full">
        <div className="max-w-[800px] w-full px-4 lg:px-8 space-y-12">
        <h1 className="text-5xl font-bold mb-16 text-center text-[#704218] [text-shadow:0px_4px_4px_#00000040]">Gender</h1>
          <div className="grid grid-cols-4 gap-8 justify-items-center">
            {genderOptions.map(({ label, imgSrc }) => (
              <label key={label} className="flex flex-col items-center cursor-pointer">
                {imgSrc && <img src={imgSrc} alt={label} className="w-28 h-28 mb-2" />}
                {!imgSrc && <div className="w-24 h-24 mb-2 flex items-center justify-center text-lg font-semibold">X</div>} {/* Placeholder for "Prefer Not to Answer" */}
                <input
                  type="radio"
                  name="gender"
                  value={label}
                  checked={selectedGender === label}
                  onChange={handleGenderChange}
                  className="mb-1"
                />
                {label}
              </label>
            ))}
          </div>
          <div className="flex justify-between w-full mt-8">
            <Button 
              text="PREVIOUS QUESTION"
              onClick={handlePreviousClick}
              className="text-white bg-[#16839B] hover:bg-[#0f6a8b] font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-150 ease-in-out"
            />
            <Button 
              text="NEXT QUESTION"
              onClick={handleNextClick}
              className="text-white bg-[#16839B] hover:bg-[#0f6a8b] font-bold py-2 px-4 mx-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-150 ease-in-out"
            />
          </div>
          <div className="flex flex-col items-center space-y-2 mt-4">
            <div className="text-center">Page</div>
            <div className="flex space-x-2">
              <span>1</span>
              <span className="font-bold">2</span> {/* Highlight the current page */}
              <span>3</span>
              <span>4</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PageTwoQuestionnaire;