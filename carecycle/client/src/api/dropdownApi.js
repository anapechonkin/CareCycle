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