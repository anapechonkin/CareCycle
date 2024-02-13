import React from "react";

const DashboardContainer = ({ name, icon, onClick }) => {
    return (
        <div
            className="flex flex-col items-center justify-center w-60 h-60 bg-white rounded-lg shadow-lg transition duration-200 ease-in-out cursor-pointer p-8 hover:-translate-y-2 hover:bg-gray-200
            hover:shadow-2xl"
            onClick={onClick}
        >
            <img src={icon} alt={name} className="w-24 h-24 mb-4" />
            <span className="mt-2 text-xl font-semibold text-center">{name}</span>
        </div>
    );
};

export default DashboardContainer;
