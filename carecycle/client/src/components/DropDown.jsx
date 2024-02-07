import React, { useState } from "react";

const DropDown = ({ options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <div
        className="w-full cursor-pointer border border-black rounded-lg text-base focus:outline-none flex justify-between items-center p-3 shadow-sm bg-white text-black"
        onClick={toggleDropdown}
      >
        <span>{selectedOption || placeholder}</span>
        <span className={`transform transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}>
          &#9660;
        </span>
      </div>
      {isOpen && (
        <ul
          className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-md mt-1"
        >
          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleOptionClick(option)}
              className="p-2 text-lg text-black hover:bg-gray-100 cursor-pointer"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropDown;
