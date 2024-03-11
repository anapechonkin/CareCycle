//Fetch map areas
export const fetchMapAreas = async () => {
    try {
        const response = await fetch(`/map-areas`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        throw error;
    }
};

// Add map areas for a user
export const addUserMapAreas = async (userId, mapAreaIds) => {
    try {
        const response = await fetch(`/users/${userId}/map-areas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mapAreaIds }),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        throw error;
    }
};

// Replace user's map areas with a new set
export const updateUserMapAreas = async (userId, mapAreaIds) => {
    try {
        const response = await fetch(`/users/${userId}/map-areas`, {
            method: 'PUT', // Using PUT to indicate a replacement operation
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mapAreaIds }),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        throw error; // Re-throw to let calling code handle it
    }
};

