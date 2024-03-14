// Fetch all self-identification options
export const fetchSelfIdentificationOptions = async () => {
    try {
        const response = await fetch(`/self-id`);
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

// Add self-identification options for a new client stat
export const addClientStatSelfIdentification = async (clientStatId, selfIdentificationIds) => {
    try {
        const response = await fetch(`/clientstats/${clientStatId}/self-id`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ selfIdentificationIds }),
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

// Update self-identification options for an existing client stat
//Right now not used in the app
// export const updateClientStatSelfIdentification = async (clientStatId, selfIdentificationIds) => {
//     try {
//         const response = await fetch(`/clientstats/${clientStatId}/self-id`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ selfIdentificationIds }),
//         });
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error('There has been a problem with your update operation:', error);
//         throw error; // Re-throw to let calling code handle it
//     }
// };

