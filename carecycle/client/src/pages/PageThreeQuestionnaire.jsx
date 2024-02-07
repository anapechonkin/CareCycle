import React, { useState } from "react";
import NavBar from "../components/NavBar";
import Banner from "../components/Banner";
import Shadow from "../components/Shadow";
import Footer from "../components/Footer";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

const PageTwoExtraQuestionnaire = () => {
  const navigate = useNavigate();

  // Functions to navigate between pages
  const handleNextClick = () => navigate('/pageFourQuestionnaire');
  const handlePreviousClick = () => navigate('/pageTwoQuestionnaire');

  return (
    <div className="flex flex-col min-h-screen bg-[#f6cdd0]">
      <NavBar />
      <Banner />
      <Shadow />
      <div className="flex-grow pt-20 pb-20 mt-24 flex flex-col items-center justify-center w-full">
        <div className="max-w-[800px] w-full px-4 lg:px-8 space-y-12">
        <h1 className="text-5xl font-bold mb-16 text-center text-[#704218] [text-shadow:0px_4px_4px_#00000040]">Place of Origin</h1>
            {/*Page content */}
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
              <span>2</span>
              <span className="font-bold">3</span> {/* Highlight the current page */}
              <span>4</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PageTwoExtraQuestionnaire;
