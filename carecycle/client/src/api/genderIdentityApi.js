// Fetch all gender identities
export const fetchGenderIdentities = async () => {
    try {
        const response = await fetch(`/gender-identities`);
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

// Add gender identities for a new user
export const addUserGenderIdentities = async (userId, genderIdentityIds) => {
    try {
        const response = await fetch(`/users/${userId}/gender-identities`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ genderIdentityIds }),
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

// Replace user's gender identities with a new set
export const updateUserGenderIdentities = async (userId, genderIdentityIds) => {
    try {
        const response = await fetch(`/users/${userId}/gender-identities`, {
            method: 'PUT', // Using PUT to indicate a replacement operation
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ genderIdentityIds }),
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