import React, { useState } from "react";

const DropDown = ({ options, placeholder, onSelect, selectedValue, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => !disabled && setIsOpen(!isOpen);

  const isOptionObject = (option) => typeof option === 'object' && option !== null && 'label' in option && 'value' in option;

  const handleOptionClick = (option) => {
    const optionValue = isOptionObject(option) ? option.value : option;
    setIsOpen(false);
    if (typeof onSelect === 'function') {
      onSelect(optionValue);
    } else {
      console.warn('onSelect prop is not provided or not a function');
    }
  };

  const selectedOptionLabel = options.find((option) => {
    const value = isOptionObject(option) ? option.value : option;
    return value === selectedValue;
  })?.label || '';

  return (
    <div className="relative w-full">
      <div
        className={`block w-full p-3 mb-4 border rounded-lg focus:outline-none transition duration-200 text-base flex justify-between items-center 
          ${disabled ? 'bg-gray-100 text-black cursor-not-allowed' : 'border-gray-300 focus:ring-2 focus:ring-[#16839B] cursor-pointer bg-white'}`}
        onClick={!disabled ? toggleDropdown : undefined}
      >
        <span>{selectedOptionLabel || placeholder}</span>
        <span className={`transform transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}>
          &#9660; {/* Adjusted to use HTML character for consistency */}
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
