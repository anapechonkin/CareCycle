import React, { useState } from 'react';
import Checkbox from './Checkbox';
import DropDown from './DropDown';
import Button from "./Button";
import genderIdentities from '../data/genderIdentities';
import workshopActivityTypes from '../data/workshopActivityTypes';
import postalCodeAreas from '../data/postalCodeAreas';
import mapRegions from '../data/mapRegions';
import { useNavigate } from "react-router-dom";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const StatsReportForm = ({ headerTitle }) => {
  
  const [selectedOptions, setSelectedOptions] = useState({
    genderIdentities: [],
    postalCodeAreas: [],
    mapRegions: [],
    workshopActivityTypes: [],
    season: "", // Initialize season in selectedOptions if needed or keep as separate state
  });
  
  const [selectedSeason, setSelectedSeason] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const navigate = useNavigate();
  
  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleCheckboxChange = (event, option, category) => {
    const { checked } = event.target;
    setSelectedOptions(prev => ({
      ...prev,
      [category]: checked
        ? [...prev[category], option]
        : prev[category].filter(opt => opt !== option),
    }));
  };

  const categoryData = {
    genderIdentities,
    postalCodeAreas,
    mapRegions,
    workshopActivityTypes,
  };

  const handleDropdownSelection = (selectedYear) => {
    // Check if "ALL" is selected and handle accordingly
    if (selectedYear === 'ALL') {
      setSelectedOptions(prev => ({ ...prev, yearOfBirth: 'ALL' }));
    } else {
      setSelectedOptions(prev => ({ ...prev, yearOfBirth: selectedYear }));
    }
  };  

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(selectedOptions, selectedSeason);
    // Implement navigation or other actions as needed
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = [
    { value: 'ALL', label: 'All Years' },
    ...Array.from({ length: currentYear - 1919 }, (_, i) => {
      const year = (currentYear - i).toString();
      return { value: year, label: year };
    })
  ];

  // Function to select all options for a given category
  const handleSelectAll = (category) => {
    setSelectedOptions(prev => ({
      ...prev,
      [category]: categoryData[category].map(option => option.id), // Assuming IDs are used to track selections
    }));
  };

  // Function to deselect all options for a given category
  const handleUnselectAll = (category) => {
    setSelectedOptions(prev => ({
      ...prev,
      [category]: [],
    }));
  };
  
  return (
    <div className="max-w-4xl mx-auto shadow-lg rounded-lg overflow-hidden">
      <div className="bg-[#0f6a8b] p-4">
        <h2 className="text-xl text-center font-semibold text-white">{headerTitle}</h2>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="p-5 bg-white space-y-8">
      <div className="mb-4">
          <div className="font-semibold text-lg mb-2">Select Dates:</div>
          <div className="text-sm mb-2">Tip: Select the same start and end date for a single day or choose date range.</div>
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={onChange}
            className="form-input rounded-md shadow-sm mt-1 block w-[200px]"
          />
        </div>
      <div className="flex flex-col space-y-2">
          <h3 className="font-semibold text-lg">Season</h3>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
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
            <label className="flex items-center space-x-2 cursor-pointer">
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
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="season"
                value="Whole Year"
                checked={selectedSeason === "Whole Year"}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="radio radio-primary"
              />
              <span>Whole Year</span>
            </label>
          </div>
        </div>
        <DropDown
          options={yearOptions}
          placeholder="Select Year of Birth"
          onSelect={handleDropdownSelection}
        />
        <Checkbox
          title="Gender Identities"
          options={genderIdentities.map(identity => ({ ...identity, checked: selectedOptions.genderIdentities.includes(identity.id) }))}
          onChange={(e, option) => handleCheckboxChange(e, option.id, 'genderIdentities')}
          onSelectAll={() => handleSelectAll('genderIdentities')}
          onUnselectAll={() => handleUnselectAll('genderIdentities')}
        />
        <Checkbox
          title="Postal Code Areas"
          options={postalCodeAreas.map(area => ({
            ...area,
            checked: selectedOptions.postalCodeAreas.includes(area.id),
          }))}
          onChange={(e, option) => handleCheckboxChange(e, option.id, 'postalCodeAreas')}
          onSelectAll={() => handleSelectAll('postalCodeAreas')}
          onUnselectAll={() => handleUnselectAll('postalCodeAreas')}
        />

        <Checkbox
          title="Place of Origin"
          options={mapRegions.map(region => ({
            ...region,
            checked: selectedOptions.mapRegions.includes(region.id),
          }))}
          onChange={(e, option) => handleCheckboxChange(e, option.id, 'mapRegions')}
          onSelectAll={() => handleSelectAll('mapRegions')}
          onUnselectAll={() => handleUnselectAll('mapRegions')}
        />

        <Checkbox
          title="Workshop Activity Types"
          options={workshopActivityTypes.map(activityType => ({
            ...activityType,
            checked: selectedOptions.workshopActivityTypes.includes(activityType.id),
          }))}
          onChange={(e, option) => handleCheckboxChange(e, option.id, 'workshopActivityTypes')}
          onSelectAll={() => handleSelectAll('workshopActivityTypes')}
          onUnselectAll={() => handleUnselectAll('workshopActivityTypes')}
        />
        <Button
          type="submit"
          text="Generate Report"
          className="mt-5"
        />
      </form>
    </div>
  );
};

export default StatsReportForm;
