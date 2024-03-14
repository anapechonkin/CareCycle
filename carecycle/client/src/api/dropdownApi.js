// Function to fetch primary gender identities
export const fetchPrimaryGenderIdentities = async () => {
    try {
      const response = await fetch('/dropdowns/primaryGender');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch primary gender identities:', error);
      throw error;
    }
  };
  
  // Function to fetch map regions
  export const fetchMapRegions = async () => {
    try {
      const response = await fetch('/dropdowns/mapRegions');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch map regions:', error);
      throw error;
    }
  };
  
  // Function to fetch user types
  export const fetchUserTypes = async () => {
    try {
      const response = await fetch('/dropdowns/userTypes');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch user types:', error);
      throw error;
    }
  };

  // Function to fetch workshops
  export const fetchWorkshops = async () => {
    try {
      const response = await fetch('/dropdowns/workshops');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch workshops:', error);
      throw error;
    }
  };

  // Function to fetch newcomer statuses
  export const fetchNewcomerStatus = async () => {
    try {
      const response = await fetch('/dropdowns/newcomerStatus');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch newcomer statuses:', error);
      throw error;
    }
  };