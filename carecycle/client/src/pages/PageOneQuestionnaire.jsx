import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import Banner from '../components/Banner';
import Shadow from '../components/Shadow';
import Footer from '../components/Footer';
import Dropdown from '../components/DropDown';
import Button from '../components/Button';
import Checkbox from '../components/Checkbox'; // Assuming Checkbox supports 'disabled'
import { useNavigate } from 'react-router-dom';

const PageOneQuestionnaire = () => {
  const [preferNotToAnswerPostal, setPreferNotToAnswerPostal] = useState(false);
  const [preferNotToAnswerYear, setPreferNotToAnswerYear] = useState(false);
  const [declined, setDeclined] = useState(null); // null for undecided, true for declined, false for accepted

  const navigate = useNavigate();

  const handleClick = () => {
    if (declined !== null) {
      console.log('Answer saved, reloading for the next client.');
      window.location.reload();
    } else {
      navigate('/pageTwoQuestionnaire');
    }
  };

  const handleSelect = (selectedOption) => {
    console.log("Selected option:", selectedOption);
  };

  const handleConsentChange = (value) => {
    setDeclined(value === 'decline');
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
            onSelect={handleSelect}
          />
          <p className="m-8 text-xl">I consent to the data obtained from this questionnaire being used for grant applications</p>
          <div className="flex justify-center items-center space-x-8 mb-4">
            {/* Consent radio buttons */}
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="consent"
                value="accept"
                checked={declined === false}
                onChange={() => handleConsentChange('accept')}
              />
              <span className="ml-2">I accept</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="consent"
                value="decline"
                checked={declined === true}
                onChange={() => handleConsentChange('decline')}
              />
              <span className="ml-2">I decline</span>
            </label>
          </div>
          <input
            type="text"
            placeholder="Please Enter Your Postal Code"
            className="mt-4 p-2 border border-black rounded-lg w-full"
            disabled={preferNotToAnswerPostal || declined}
          />
          <Checkbox
            title=""
            options={[{
              id: 'postal',
              label: 'Prefer Not To Answer',
              checked: preferNotToAnswerPostal,
              disabled: declined // Disable when declined is true
            }]}
            onChange={() => setPreferNotToAnswerPostal(!preferNotToAnswerPostal)}
          />
          <input
            type="text"
            placeholder="Please Enter Your Year of Birth (YYYY)"
            className="mt-4 p-2 border border-black rounded-lg w-full"
            disabled={preferNotToAnswerYear || declined}
          />
          <Checkbox
            title=""
            options={[{
              id: 'year',
              label: 'Prefer Not To Answer',
              checked: preferNotToAnswerYear,
              disabled: declined // Disable when declined is true
            }]}
            onChange={() => setPreferNotToAnswerYear(!preferNotToAnswerYear)}
          />
          <div className="flex flex-col items-center mt-8 space-y-4">
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
