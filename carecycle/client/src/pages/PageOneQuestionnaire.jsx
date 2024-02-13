import React from 'react';
import NavBar from '../components/NavBar';
import Banner from '../components/Banner';
import Shadow from '../components/Shadow';
import Footer from '../components/Footer';
import Dropdown from '../components/DropDown';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

const PageOneQuestionnaire = () => {
  // States for managing individual preferences
  const [preferNotToAnswerPostal, setPreferNotToAnswerPostal] = React.useState(false);
  const [preferNotToAnswerYear, setPreferNotToAnswerYear] = React.useState(false);
  // State for managing the overall action of declining or not
  const [declined, setDeclined] = React.useState(null); // null indicates no choice has been made yet

  const navigate = useNavigate();

  const handleClick = () => {
    if (declined) {
      // Placeholder for saving the answer in the database
      console.log('Answer saved, reloading for the next client.');
      // Reload the page
      window.location.reload();
    } else {
      navigate('/pageTwoQuestionnaire');
    }
  };

  const handleChoiceChange = (choice) => {
    setDeclined(choice);
    // Reset 'preferNotToAnswer' states based on the choice
    const shouldDisable = choice;
    setPreferNotToAnswerPostal(shouldDisable);
    setPreferNotToAnswerYear(shouldDisable);
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
            placeholder="LANGUAGE"
          />
          <p className="m-8 text-xl">I consent to the data obtained from this questionnaire being used for grant applications</p>
          <div className="flex justify-center items-center space-x-8 mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={declined === false}
                onChange={() => handleChoiceChange(false)}
              />
              <span className="mx-2 text-lg">I accept</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={declined === true}
                onChange={() => handleChoiceChange(true)}
              />
              <span className="mx-2 text-lg">I decline</span>
            </label>
          </div>
          <input
            type="text"
            placeholder="Please Enter Your Postal Code"
            className="mt-4 p-2 border border-black rounded-lg w-full"
            disabled={preferNotToAnswerPostal || declined}
          />
          <label className="flex items-center mt-1">
            <input
              type="checkbox"
              checked={preferNotToAnswerPostal}
              onChange={() => setPreferNotToAnswerPostal(!preferNotToAnswerPostal)}
            />
            <span className="mx-2">Prefer Not To Answer</span>
          </label>
          <input
            type="text"
            placeholder="Please Enter Your Year of Birth (YYYY)"
            className="mt-4 p-2 border border-black rounded-lg w-full"
            disabled={preferNotToAnswerYear || declined}
          />
          <label className="flex items-center mt-1">
            <input
              type="checkbox"
              checked={preferNotToAnswerYear}
              onChange={() => setPreferNotToAnswerYear(!preferNotToAnswerYear)}
            />
            <span className="mx-2">Prefer Not To Answer</span>
          </label>
          <div className="flex flex-col items-center mt-8 space-y-4">
            <Button
              text="NEXT QUESTION"
              className="text-white bg-[#16839B] hover:bg-[#0f6a8b] font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-150 ease-in-out"
              onClick={handleClick}
            />
            <div className="flex space-x-2">
              <span>Page</span>
              <span className="font-bold">1</span>
              <span>2</span>
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

export default PageOneQuestionnaire;
