const Checkbox = ({ title, options, onChange }) => {
    return (
      <div className="mb-4">
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {options.map((option) => (
            <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                value={option.value || option.name} // Adapt based on your data structure
                onChange={(e) => onChange(e, option)}
                className="form-checkbox h-5 w-5 text-[#16839B] rounded border-gray-300 focus:ring-[#0f6a8b]"
              />
              <span className="text-md text-gray-700">{option.label || option.name}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };
  
  export default Checkbox;
  