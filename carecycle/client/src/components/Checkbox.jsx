import React from 'react';

const Checkbox = ({ title, options, onChange, onSelectAll, onUnselectAll }) => {
  // Adjusted handler to pass both event and option
  const handleChange = (event, option) => {
    onChange(event, option);
  };

  return (
    <div className="mb-4">
      {title && <h3 className="font-semibold text-lg mb-2">{title}</h3>}
      <div className="flex justify-between items-center mb-2">
        <div>
          {onSelectAll && (
            <button
              type="button"
              onClick={() => onSelectAll()}
              // Adjusted color to match primary color scheme
              className="px-4 py-2 text-sm text-white bg-[#16839B] rounded hover:bg-[#0f6a8b] mr-2 transition-colors duration-150 ease-in-out"
            >
              Select All
            </button>
          )}
          {onUnselectAll && (
            <button
              type="button"
              onClick={() => onUnselectAll()}
              // Adjusted color for contrast while staying in the color palette
              className="px-4 py-2 text-sm text-white bg-[#D78030] rounded hover:bg-[#bf6f29] transition-colors duration-150 ease-in-out"
            >
              Unselect All
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 justify-start items-center">
        {options.map((option) => (
          <label key={option.id} className="flex items-center cursor-pointer mr-2 mb-2 flex-nowrap" style={{ minWidth: '0', maxWidth: '100%' }}>
            <input
              type="checkbox"
              id={option.id} // Ensure each checkbox has a unique ID
              checked={option.checked}
              onChange={(event) => handleChange(event, option)}
              disabled={option.disabled}
              className="form-checkbox h-4 w-4 text-[#16839B] rounded border-gray-300 focus:ring-[#0f6a8b] mr-2"
            />
            <span className="text-md text-gray-700 flex-1 whitespace-nowrap overflow-hidden text-ellipsis" style={{ maxWidth: 'calc(100% - 1.5rem)' }}>{option.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default Checkbox;
