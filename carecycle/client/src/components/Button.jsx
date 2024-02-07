import React from "react";

const Button = ({ text, onClick, className, type = "button", style }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            // Tailwind CSS classes for styling with hover effect
            className={`w-full text-white font-bold py-3 rounded-lg text-base focus:outline-none focus:shadow-outline mt-4 transition-colors duration-150 ease-in-out bg-[#16839B] hover:bg-[#0f6a8b] ${className}`}
            style={{ borderColor: '#D78030', ...style }}
        >
            {text}
        </button>
    );
};

export default Button;
