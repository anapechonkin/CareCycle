import React, { useState } from 'react';
import Checkbox from './Checkbox'; // Ensure your Checkbox component is styled or updated for Tailwind CSS
import DropDown from './DropDown'; // Update DropDown for Tailwind CSS if necessary
import Button from "../components/Button"; // Make sure Button component uses Tailwind CSS for styling
import genderIdentities from '../data/genderIdentities';
import workshopActivityTypes from '../data/workshopActivityTypes';
import postalCodeAreas from '../data/postalCodeAreas';
import mapRegions from '../data/mapRegions';
import { useNavigate } from "react-router-dom";

const StatsReportFilterForm = () => {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedSeason, setSelectedSeason] = useState("");
  const navigate = useNavigate();

  const handleCheckboxChange = (event, option) => {
    // Checkbox change logic
  };

  const handleDropdownSelection = (selectedYear) => {
    setSelectedOptions(prev => ({ ...prev, yearOfBirth: selectedYear }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(selectedOptions, selectedSeason);
    // Implement navigation or other actions as needed
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1919 }, (_, i) => (currentYear - i).toString());

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-5 bg-white shadow-lg rounded-lg">
      <div className="space-y-8">
        <Checkbox
          title="Gender Identities"
          options={genderIdentities}
          onChange={handleCheckboxChange}
        />
        <DropDown
          options={yearOptions}
          placeholder="Select Year of Birth"
          onSelect={handleDropdownSelection}
        />
        <Checkbox
          title="Postal Code Areas"
          options={postalCodeAreas}
          onChange={handleCheckboxChange}
        />
        <Checkbox
          title="World Map Regions"
          options={mapRegions}
          onChange={handleCheckboxChange}
        />
        <div className="flex flex-col space-y-2">
          <h3 className="font-semibold text-lg">Season</h3>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="season"
                value="Bike Season"
                checked={selectedSeason === "Bike Season"}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="radio radio-primary"
              />
              <span>Bike Season</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="season"
                value="Off Season"
                checked={selectedSeason === "Off Season"}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="radio radio-primary"
              />
              <span>Off Season</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="season"
                value="Whole Year"
                checked={selectedSeason === "Whole Year" || selectedSeason === ""}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="radio radio-primary"
              />
              <span>Whole Year</span>
            </label>
          </div>
        </div>
        <Checkbox
          title="Workshop Activity Types"
          options={workshopActivityTypes}
          onChange={handleCheckboxChange}
        />
        <Button
          type="submit"
          text="Generate Report"
          className="mt-5" // You can add more classes for styling if needed
        />
      </div>
    </form>
  );
};

export default StatsReportFilterForm;
