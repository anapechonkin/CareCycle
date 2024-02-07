import React from "react";
import NavBar from "../components/NavBar";
import Banner from "../components/Banner";
import Shadow from "../components/Shadow";
import Footer from "../components/Footer";
import Button from "../components/Button"; // Assuming Button is your custom component
import { useNavigate } from "react-router-dom";

const PageTwoQuestionnaire = () => {
  const navigate = useNavigate();
  
  // Function to navigate to the next page
  const handleNextClick = () => {
    navigate('/pageThreeQuestionnaire'); // Assuming the next page's route is '/pageThreeQuestionnaire'
  };

  // Function to navigate to the previous page
  const handlePreviousClick = () => {
    navigate('/pageOneQuestionnaire'); // Assuming the previous page's route is '/pageOneQuestionnaire'
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f6cdd0]">
      <NavBar />
      <Banner />
      <Shadow />
      <div className="flex-grow pt-20 pb-20 mt-24 flex flex-col items-center justify-center w-full">
        <div className="max-w-[800px] w-full px-4 lg:px-8 space-y-12">
          {/* Content of your PageTwoQuestionnaire */}
          
          <div className="flex justify-between items-center w-full mt-8">
            <Button 
              text="PREVIOUS QUESTION"
              onClick={handlePreviousClick}
              className="text-white bg-[#16839B] hover:bg-[#0f6a8b] font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-150 ease-in-out"
            />
            <Button 
              text="NEXT QUESTION"
              onClick={handleNextClick}
              className="text-white bg-[#16839B] hover:bg-[#0f6a8b] font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-150 ease-in-out mx-4"
            />
          </div>
          <div className="flex space-x-2 justify-center">
            <span>Page</span>
            <span>1</span>
            <span className="font-bold">2</span> {/* Current Page */}
            <span>3</span>
            <span>4</span>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PageTwoQuestionnaire;
