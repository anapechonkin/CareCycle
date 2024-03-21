export const addClientStat = async (data) => {
    try {
        const response = await fetch('/clientstats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error adding clientStat:', error);
        throw error;
    }
};

export const getClientStats = async (filters = {}) => {
    try {
        // Construct query string from filters object
        const queryString = new URLSearchParams(filters).toString();
        const response = await fetch(`/clientstats?${queryString}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error fetching client stats:', error);
        throw error;
    }
};
