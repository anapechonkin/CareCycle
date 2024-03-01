import React, { useState } from "react";

const DropDown = ({ options, placeholder, onSelect, selectedValue }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const isOptionObject = (option) => typeof option === 'object' && option !== null && 'label' in option && 'value' in option;

  const handleOptionClick = (option) => {
    // Determine if the option is an object and handle accordingly
    const optionValue = isOptionObject(option) ? option.value : option;

    setIsOpen(false);
    if (typeof onSelect === 'function') {
      onSelect(optionValue); // Pass the value (or the string itself if it's not an object)
    } else {
      console.warn('onSelect prop is not provided or not a function');
    }
  };

  // Use selectedValue prop to determine the display label
  const selectedOptionLabel = options.find((option) => {
    const value = isOptionObject(option) ? option.value : option;
    return value === selectedValue;
  })?.label || '';

  return (
    <div className="relative w-full">
      <div
        className="w-full cursor-pointer border border-black rounded-lg text-base focus:outline-none flex justify-between items-center p-3 shadow-sm bg-white text-black"
        onClick={toggleDropdown}
      >
        <span>{selectedOptionLabel || placeholder}</span>
        <span className={`transform transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}>
          &#9660;
        </span>
      </div>
      {isOpen && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-md mt-1 max-h-40 overflow-y-auto">
          {options.map((option, index) => (
            <li
              key={index}
              onClick={() => handleOptionClick(option)}
              className="p-2 text-lg text-black hover:bg-gray-100 cursor-pointer"
            >
              {isOptionObject(option) ? option.label : option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


export default DropDown;
