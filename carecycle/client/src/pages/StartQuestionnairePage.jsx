import React from "react";
import NavBar from "../components/NavBar";
import Banner from "../components/Banner";
import Shadow from "../components/Shadow";
import Footer from "../components/Footer";
import Dropdown from "../components/DropDown";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

const StartQuestionnairePage = () => {

  const navigate = useNavigate();

  const handleClick = () => {
    // Any logic you need to execute before navigation
    navigate('/pageOneQuestionnaire');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f6cdd0]">
      <NavBar />
      <Banner />
      <Shadow />
      {/* Container div that centralizes and limits content width */}
      <div className="flex-grow pt-20 pb-20 mt-24 flex flex-col items-center justify-center w-full">
        <div className="max-w-[800px] w-full px-4 lg:px-8 space-y-12"> {/* Adjust max-width as needed */}
          <h1 className="text-6xl font-bold mb-16 text-center text-[#704218] [text-shadow:0px_4px_4px_#00000040]">Client Stats Questionnaire</h1>
          <Dropdown
            options={["Wednesday DIY", "Regular DIY", "Moonday", "Special Event", "Other"]}
            placeholder="Choose Type of Activity"
          />
          <img
            className="w-full h-auto rounded shadow-lg border-2 border-black"
            src="/photos/DIYWorkshop.jpg"
            alt="Lots of people working on bikes in a workshop, outside."
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
