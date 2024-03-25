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
import * as XLSX from 'xlsx';

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
  const [dateRangeSelected, setDateRangeSelected] = useState(false);
  const [seasonSelected, setSeasonSelected] = useState(false);

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

  // Handle change in DatePicker selection
const onChange = (dates) => {
  const [start, end] = dates;
  setStartDate(start);
  setEndDate(end);
  if (start && end) {
    setDateRangeSelected(true);
    setSeasonSelected(false); // Disable season selection
    setSelectedSeason(""); // Reset season selection
  }
};

// Handle change in season radio button selection
const handleSeasonChange = (event) => {
  const value = event.target.value;
  setSelectedSeason(value);
  if (value) {
    setSeasonSelected(true);
    setDateRangeSelected(false); // Disable date range selection
    setStartDate(null);
    setEndDate(null);
  }
};

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowReport(false);

    let filters = {};
    Object.entries(selectedOptions).forEach(([category, selected]) => {
        // Check if the category exists in categoryData and both selected and the corresponding categoryData[category] are not undefined
        if (categoryData[category] && selected && categoryData[category].length !== undefined) {
            if (selected.length < categoryData[category].length) {
                filters[category] = selected.join(',');
            }
        } else if (selected !== 'ALL') { // Handle 'yearOfBirth' and similar single-value categories
            filters[category] = selected;
        }
    });

    if (startDate) filters.startDate = startDate.toISOString();
    if (endDate) {
      // If the end date is the same as the start date, adjust it to the end of the day
      if (endDate.getTime() === startDate.getTime()) {
        endDate.setHours(23, 59, 59); // Set to the end of the day
      }
      filters.endDate = endDate.toISOString();
    }

    // Handle season selection
    if (selectedSeason && selectedSeason !== 'Custom') {
      const { startDate, endDate } = getSeasonDateRange(selectedSeason);
      filters.startDate = startDate.toISOString();
      filters.endDate = endDate.toISOString();
    } else {
      // Handle custom date range selection
      if (startDate) filters.startDate = startDate.toISOString();
      if (endDate) {
        // Adjust endDate to include the full day if it's the same as startDate
        if (endDate.getTime() === startDate.getTime()) {
          endDate.setHours(23, 59, 59);
        }
        filters.endDate = endDate.toISOString();
      }
    }

    console.log('Sending request with filters:', filters); 

    try {
        console.log('Filters to send:', filters)
        const result = await getClientStats(filters); // Assuming getClientStats makes an API call and returns a promise
        console.log("Fetched Report Data:", result); 
        setReportData(result);
        setShowReport(true);
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

  const resetForm = () => {
    // Reset the selections for your existing filters
    setSelectedOptions({
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
  
    // Reset additional UI components and their states
    setPrimaryGenders(primaryGenders.map(gender => ({ ...gender, checked: false })));
    setGenderIdentities(genderIdentities.map(identity => ({ ...identity, checked: false })));
    setNewcomerStatus(newcomerStatus.map(status => ({ ...status, checked: false })));
    setSelfIdentification(selfIdentification.map(option => ({ ...option, checked: false })));
    setMapRegions(mapRegions.map(region => ({ ...region, checked: false })));
    setWorkshopTypes(workshopTypes.map(workshop => ({ ...workshop, checked: false })));
    setAreas(areas.map(area => ({ ...area, checked: false })));
  
    // Clearing the date and season selection states
    setSelectedSeason("");
    setStartDate(new Date()); 
    setEndDate(null);
    setDateRangeSelected(false);
    setSeasonSelected(false);
  
    // Ensure the report is not shown after reset
    setShowReport(false);
  };  

  const handleExport = () => {
    // Convert arrays to strings and nulls to a friendly value
    const dataForExport = reportData.map((item) => ({
      ...item,
      map_areas: item.map_areas ? item.map_areas.join(', ') : 'N/A', 
      gender_identities: item.gender_identities ? item.gender_identities.join(', ') : 'N/A', 
      self_identifications: item.self_identifications ? item.self_identifications.join(', ') : 'N/A', 
    }));
  
    const ws = XLSX.utils.json_to_sheet(dataForExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ReportData");
    XLSX.writeFile(wb, "report.xlsx");
  };

  const getSeasonDateRange = (season) => {
    const today = new Date();
    let startDate, endDate;
  
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
  
    switch (season) {
      case 'Bike Season':
        if (currentMonth >= 4 && currentMonth <= 8) { // May to September
          // Current year's May 1st to today's date
          startDate = new Date(currentYear, 4, 1);
          endDate = today;
        } else {
          // Last year's May 1st to last year's September 30th
          startDate = new Date(currentYear - 1, 4, 1);
          endDate = new Date(currentYear - 1, 8, 30);
        }
        break;
      case 'Off Season':
        if (currentMonth >= 9 || currentMonth <= 3) { // October to April
          // Last year's October 1st to today's date
          startDate = new Date(currentYear - 1, 9, 1);
          endDate = today;
        } else {
          // Current year's October 1st to next year's April 30th
          startDate = new Date(currentYear, 9, 1);
          endDate = new Date(currentYear + 1, 3, 30);
        }
        break;
      case 'Whole Year':
        // One year back from today's date
        startDate = new Date(currentYear - 1, currentMonth, today.getDate());
        endDate = today;
        break;
      default:
        // If not within the season, return nulls
        return { startDate: null, endDate: null };
    }
  
    return { startDate, endDate };
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
            disabled={seasonSelected} 
            className="form-input rounded-md shadow-sm mt-1 block w-[200px]"
          />
        </div>
      {/* Season selection radio buttons */}
        <div className="flex flex-col space-y-2">
          <h3 className="font-semibold text-lg">Season</h3>
          <div className="flex items-center space-x-4">
            {["Bike Season", "Off Season", "Whole Year"].map(season => (
              <label key={season} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="season"
                  value={season}
                  checked={selectedSeason === season}
                  onChange={handleSeasonChange}
                  disabled={dateRangeSelected} // Disable radio buttons when date range is selected
                  className="radio radio-primary"
                />
                <span>{season}</span>
              </label>
            ))}
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
        <div className="flex justify-end space-x-4 mt-5">
  <Button
    type="button"
    text="Reset"
    onClick={resetForm}
    className="bg-gray-300 text-black" // Example of making the reset button visually distinct
  />
  <Button
    type="submit"
    text="View Report"
    className="bg-[#0f6a8b] text-white"
  />
</div>
      </form>
      {/* Conditionally render the ReportTable */}
      {showReport && (
        <>
          <ReportTable data={reportData} />
          <div className="mt-6 flex justify-center">
            <Button
              text="Export to Excel"
              onClick={handleExport}
              className="bg-[#0f6a8b] text-white font-bold py-2 px-4 rounded hover:bg-[#0d5a7a] transition ease-in duration-200"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default StatsReportForm;
