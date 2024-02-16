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
  const [dateSelectionType, setDateSelectionType] = useState('single');
  
  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const navigate = useNavigate();

  const categoryData = {
    genderIdentities,
    postalCodeAreas,
    mapRegions,
    workshopActivityTypes,
  };

  const handleCheckboxChange = (event, option, category) => {
    const { checked } = event.target;
    if (option === 'ALL') {
      setSelectedOptions(prev => ({
        ...prev,
        [category]: checked ? ['ALL', ...categoryData[category]] : [], // Corrected access to categoryData
      }));
    } else {
      setSelectedOptions(prev => ({
        ...prev,
        [category]: checked
          ? [...prev[category], option]
          : prev[category].filter(opt => opt !== option),
      }));
    }
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

  const addAllOption = (options) => [{ id: 'ALL', name: 'ALL' }, ...options];

  return (
    <div className="max-w-4xl mx-auto shadow-lg rounded-lg overflow-hidden">
      <div className="bg-[#0f6a8b] p-4">
        <h2 className="text-xl text-center font-semibold text-white">{headerTitle}</h2>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="p-5 bg-white space-y-8">
       {/* Toggle between Single Date and Date Range */}
       <div className="mb-4">
          <div className="font-semibold text-lg mb-2">Select Date Type:</div>
          <div className="flex justify-start space-x-4 mb-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="dateSelectionType"
                value="single"
                checked={dateSelectionType === 'single'}
                onChange={() => setDateSelectionType('single')}
                className="mr-2"
              />
              Single Date
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="dateSelectionType"
                value="range"
                checked={dateSelectionType === 'range'}
                onChange={() => setDateSelectionType('range')}
                className="mr-2"
              />
              Date Range
            </label>
          </div>
        </div>

      {/* Conditionally render DatePicker */}
      <div className="mb-4">
        <div className="font-semibold text-lg mb-2">Select Dates:</div>
        <div className="text-sm mb-2">Click on the date field to select a date or date range.</div>
      {
        dateSelectionType === 'single' ? (
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
          />
        ) : (
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(dates) => {
              const [start, end] = dates;
              setStartDate(start);
              setEndDate(end);
            }}
          />
        )
      }
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
          options={addAllOption(genderIdentities)}
          onChange={(e) => handleCheckboxChange(e, 'ALL', 'genderIdentities')}
        />
        <Checkbox
          title="Postal Code Areas"
          options={addAllOption(postalCodeAreas)}
          onChange={(e) => handleCheckboxChange(e, 'ALL', 'postalCodeAreas')}
        />
        <Checkbox
          title="World Map Regions"
          options={addAllOption(mapRegions)}
          onChange={(e) => handleCheckboxChange(e, 'ALL', 'mapRegions')}
        />
        <Checkbox
          title="Workshop Activity Types"
          options={addAllOption(workshopActivityTypes)}
          onChange={(e) => handleCheckboxChange(e, 'ALL', 'workshopActivityTypes')}
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
