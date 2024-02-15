import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import Banner from '../components/Banner';
import Shadow from '../components/Shadow';
import Footer from '../components/Footer';
import Dropdown from '../components/DropDown';
import Button from '../components/Button';
import Checkbox from '../components/Checkbox'; // Ensure this component supports 'disabled' prop
import { useNavigate } from 'react-router-dom';

const PageOneQuestionnaire = () => {
  const [preferNotToAnswerPostal, setPreferNotToAnswerPostal] = useState(false);
  const [preferNotToAnswerYear, setPreferNotToAnswerYear] = useState(false);
  const [declined, setDeclined] = useState(null);

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

  const handleConsentChange = (option) => {
    // Allow toggling off by clicking the same option again
    setDeclined(prev => prev === (option.id === 'decline') ? null : option.id === 'decline');
  };

  // Prepare consent options for rendering
  const consentOptions = [
    { id: 'accept', label: 'I accept', checked: declined === false },
    { id: 'decline', label: 'I decline', checked: declined === true }
  ];

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
            {consentOptions.map(option => (
              <Checkbox
                key={option.id}
                title=""
                options={[{
                  id: option.id,
                  label: option.label,
                  checked: option.checked,
                  disabled: declined !== null && !option.checked // Disable non-selected option when one is selected
                }]}
                onChange={() => handleConsentChange(option)}
              />
            ))}
          </div>
          <input
            type="text"
            placeholder="Please Enter Your Postal Code"
            className="mt-4 p-2 border border-black rounded-lg w-full"
            disabled={preferNotToAnswerPostal || declined === true}
          />
          <Checkbox
            title=""
            options={[{
              id: 'postal',
              label: 'Prefer Not To Answer',
              checked: preferNotToAnswerPostal,
              disabled: declined === true // Disable when declined is true
            }]}
            onChange={() => setPreferNotToAnswerPostal(!preferNotToAnswerPostal)}
          />
          <input
            type="text"
            placeholder="Please Enter Your Year of Birth (YYYY)"
            className="mt-4 p-2 border border-black rounded-lg w-full"
            disabled={preferNotToAnswerYear || declined === true}
          />
          <Checkbox
            title=""
            options={[{
              id: 'year',
              label: 'Prefer Not To Answer',
              checked: preferNotToAnswerYear,
              disabled: declined === true // Disable when declined is true
            }]}
            onChange={() => setPreferNotToAnswerYear(!preferNotToAnswerYear)}
          />
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
