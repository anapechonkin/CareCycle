const Checkbox = ({ title, options, onChange }) => {
  return (
    <div className="mb-4">
      {title && <h3 className="font-semibold text-lg mb-2">{title}</h3>}
      <div className="flex flex-wrap gap-2 justify-start items-center">
        {options.map((option) => (
          <label key={option.id} className="flex items-center cursor-pointer mr-2 mb-2 flex-nowrap" style={{ minWidth: '0', maxWidth: '100%' }}>
            <input
              type="checkbox"
              id={option.id}
              checked={option.checked}
              onChange={() => onChange(option)}
              disabled={option.disabled}
              className="form-checkbox h-4 w-4 text-[#16839B] rounded border-gray-300 focus:ring-[#0f6a8b] mr-2"
            />
            {/* Adjusted to use 'label' or 'name' */}
            <span className="text-md text-gray-700 flex-1 whitespace-nowrap overflow-hidden text-ellipsis" style={{ maxWidth: 'calc(100% - 1.5rem)' }}>{option.label || option.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default Checkbox;
