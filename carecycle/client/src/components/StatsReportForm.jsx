import React, { useState, useEffect } from 'react';
import Checkbox from './Checkbox';
import DropDown from './DropDown';
import Button from "./Button";
import ReportTable from './ReportTable';
import { useNavigate } from "react-router-dom";
import { getClientStats } from '../api/clientStatApi';
import { fetchGenderIdentities } from '../api/genderIdentityApi';
import { fetchMapRegions, fetchPrimaryGenderIdentities, fetchWorkshops, fetchNewcomerStatus } from '../api/dropdownApi';
import { fetchAreas } from '../api/postalCodeApi';
import { fetchSelfIdentificationOptions } from '../api/selfIdApi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const StatsReportForm = ({ headerTitle }) => {
  
  const [selectedOptions, setSelectedOptions] = useState({
    primaryGenders: [],
    genderIdentities: [],
    newcomerStatus: [],
    selfIdentification: [],
    areas: [],
    mapRegions: [],
    workshopTypes: [],
    season: "", 
    yearOfBirth: "",
  });

  const [primaryGenders, setPrimaryGenders] = useState([]);
  const [genderIdentities, setGenderIdentities] = useState([]);
  const [newcomerStatus, setNewcomerStatus] = useState([]);
  const [selfIdentification, setSelfIdentification] = useState([]);
  const [mapRegions, setMapRegions] = useState([]);
  const [workshopTypes, setWorkshopTypes] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [showReport, setShowReport] = useState(false);

  const navigate = useNavigate();
  
  useEffect(() => {
    const loadNewcomerStatus = async () => {
      try {
        const fetchedNewcomerStatus = await fetchNewcomerStatus();
        setNewcomerStatus(fetchedNewcomerStatus.map(status => ({
          ...status,
          id: status.newcomer_status_id, // Adjust according to your data structure
          checked: false,
        })));
      } catch (error) {
        console.error("Failed to fetch newcomer status:", error);
      }
    };

    loadNewcomerStatus();
  }, []);

  useEffect(() => {
    const loadSelfIdentificationOptions = async () => {
      try {
        const fetchedSelfIdentification = await fetchSelfIdentificationOptions();
        setSelfIdentification(fetchedSelfIdentification.map(option => ({
          ...option,
          id: option.self_identification_id,
          checked: false // Initialize all as unchecked
        })));
      } catch (error) {
        console.error("Failed to fetch self-identification options:", error);
      }
    };
  
    loadSelfIdentificationOptions();
  }, []);

  
  useEffect(() => {
    const loadPrimaryGenders = async () => {
      try {
        const fetchedPrimaryGenders = await fetchPrimaryGenderIdentities();
        setPrimaryGenders(fetchedPrimaryGenders.map(gender => ({
          ...gender,
          id: gender.primary_gender_id, // Adjust according to your data structure
          checked: false,
        })));
      } catch (error) {
        console.error("Failed to fetch primary genders:", error);
      }
    };

    loadPrimaryGenders();
  }, []);

  useEffect(() => {
    const loadGenderIdentities = async () => {
      try {
        const fetchedGenderIdentities = await fetchGenderIdentities();
        setGenderIdentities(fetchedGenderIdentities.map(gender => ({
          ...gender,
          id: gender.gender_identity_id,
          checked: false // Initialize all as unchecked
        })));
      } catch (error) {
        console.error("Failed to fetch gender identities:", error);
      }
    };

    loadGenderIdentities();
  }, []);

  useEffect(() => {
    const loadMapRegions = async () => {
      try {
        const fetchedMapRegions = await fetchMapRegions();
        setMapRegions(fetchedMapRegions.map(region => ({
          ...region,
          id: region.map_id, 
          checked: false // Initialize all as unchecked
        })));
      } catch (error) {
        console.error("Failed to fetch map regions:", error);
      }
    };

    loadMapRegions();
  }, []);

  useEffect(() => {
    const loadWorkshopTypes = async () => {
      try {
        const fetchedWorkshopTypes = await fetchWorkshops();
        setWorkshopTypes(fetchedWorkshopTypes.map(workshop => ({
          ...workshop,
          id: workshop.workshop_id,
          checked: false // Initialize all as unchecked for UI state management
        })));
      } catch (error) {
        console.error("Failed to fetch workshop activity types:", error);
      }
    };

    loadWorkshopTypes();
  }, []);

  useEffect(() => {
    const loadAreas = async () => {
        try {
            const fetchedAreas = await fetchAreas();
            setAreas(fetchedAreas.map(area => ({
                ...area,
                id: area.area_id, 
                checked: false 
            })));
        } catch (error) {
            console.error("Failed to fetch areas:", error);
        }
    };

    loadAreas();
  }, []);

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
    primaryGenders,
    genderIdentities,
    newcomerStatus,
    selfIdentification,
    areas,
    mapRegions,
    workshopTypes,
  };

  const handleDropdownSelection = (selectedYear) => {
    // Check if "ALL" is selected and handle accordingly
    if (selectedYear === 'ALL') {
      setSelectedOptions(prev => ({ ...prev, yearOfBirth: 'ALL' }));
    } else {
      setSelectedOptions(prev => ({ ...prev, yearOfBirth: selectedYear }));
    }

    // Log the selected year for debugging
    console.log('Selected Year:', selectedYear);

  };  

  const currentYear = new Date().getFullYear();
  const yearOptions = [
    { value: 'ALL', label: 'All Years' },
    ...Array.from({ length: currentYear - 1919 }, (_, i) => {
      const year = (currentYear - i).toString();
      return { value: year, label: year };
    })
  ];

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    setShowReport(false);

    // Prepare the filters object
    let filters = {
        newcomerStatus: selectedOptions.newcomerStatus.join(','),
        selfIdentification: selectedOptions.selfIdentification.join(','),
        primaryGenders: selectedOptions.primaryGenders.join(','),
        genderIdentities: selectedOptions.genderIdentities.join(','),
        areas: selectedOptions.areas.join(','),
        mapRegions: selectedOptions.mapRegions.join(','),
        workshopTypes: selectedOptions.workshopTypes.join(','),
    };

    // Conditionally add dates to the filters object
    if (startDate) filters.startDate = startDate.toISOString();
    if (endDate) filters.endDate = endDate.toISOString();
    
    try {
        const result = await getClientStats(filters);
        console.log(result);
        setReportData(result); // Set the fetched data for display
        setShowReport(true); // Show the report table
    } catch (error) {
        console.error('Failed to fetch client stats:', error);
    }
};

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
          selectedValue={selectedOptions.yearOfBirth}
        />
        <Checkbox
          title="Newcomer Status"
          options={newcomerStatus.map(status => ({
            id: status.newcomer_status_id,
            name: status.status, // Adjust according to your data structure
            checked: selectedOptions.newcomerStatus.includes(status.id),
          }))}
          onChange={(e, option) => handleCheckboxChange(e, option.id, 'newcomerStatus')}
          onSelectAll={() => handleSelectAll('newcomerStatus')}
          onUnselectAll={() => handleUnselectAll('newcomerStatus')}
        />
        <Checkbox
          title="Self-Identification"
          options={selfIdentification.map(option => ({
            id: option.self_identification_id,
            name: option.option, // Adjust based on your actual data structure
            checked: selectedOptions.selfIdentification.includes(option.id),
          }))}
          onChange={(e, option) => handleCheckboxChange(e, option.id, 'selfIdentification')}
          onSelectAll={() => handleSelectAll('selfIdentification')}
          onUnselectAll={() => handleUnselectAll('selfIdentification')}
        />
         <Checkbox
          title="Primary Genders"
          options={primaryGenders.map(gender => ({
            id: gender.primary_gender_id,
            name: gender.gender_name, // Adjust according to your data structure
            checked: selectedOptions.primaryGenders.includes(gender.id),
          }))}
          onChange={(e, option) => handleCheckboxChange(e, option.id, 'primaryGenders')}
          onSelectAll={() => handleSelectAll('primaryGenders')}
          onUnselectAll={() => handleUnselectAll('primaryGenders')}
        />
        <Checkbox
          title="Gender Identities"
          options={genderIdentities.map(identity => ({
            id: identity.gender_identity_id,
            name: identity.type, 
            checked: selectedOptions.genderIdentities.includes(identity.id)
          }))}
          onChange={(e, option) => handleCheckboxChange(e, option.id, 'genderIdentities')}
          onSelectAll={() => handleSelectAll('genderIdentities')}
          onUnselectAll={() => handleUnselectAll('genderIdentities')}
        />
        <Checkbox
            title="Postal Code Areas"
            options={areas.map(area => ({
                id: area.area_id,
                name: area.area_name,
                checked: selectedOptions.areas.includes(area.id), 
            }))}
            onChange={(e, option) => handleCheckboxChange(e, option.id, 'areas')}
            onSelectAll={() => handleSelectAll('areas')}
            onUnselectAll={() => handleUnselectAll('areas')}
        />
        <Checkbox
            title="Place of Origin"
            options={mapRegions.map(region => ({
              id: region.map_id,
              name: region.map_area_name,
              checked: selectedOptions.mapRegions.includes(region.id),
            }))}
            onChange={(e, option) => handleCheckboxChange(e, option.id, 'mapRegions')}
            onSelectAll={() => handleSelectAll('mapRegions')}
            onUnselectAll={() => handleUnselectAll('mapRegions')}
          />
          <Checkbox
            title="Workshop Activity Types"
            options={workshopTypes.map(activityType => ({
              ...activityType,
              id: activityType.workshop_id,
              name: activityType.name,
              checked: selectedOptions.workshopTypes.includes(activityType.id),
            }))}
            onChange={(e, option) => handleCheckboxChange(e, option.id, 'workshopTypes')} 
            onSelectAll={() => handleSelectAll('workshopTypes')} 
            onUnselectAll={() => handleUnselectAll('workshopTypes')} 
        />
        <Button
          type="submit"
          text="View Report"
          className="mt-5"
        />
      </form>
      {/* Conditionally render the ReportTable */}
      {showReport && <ReportTable data={reportData} />}
    </div>
  );
};

export default StatsReportForm;
