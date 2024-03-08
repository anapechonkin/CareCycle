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
