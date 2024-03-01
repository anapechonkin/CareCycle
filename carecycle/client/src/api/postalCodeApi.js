export const addPostalCode = async (postalCode) => {
    // Format the postal code: uppercase and remove spaces
    const formattedPostalCode = postalCode.toUpperCase().replace(/\s+/g, '');

    try {
        const response = await fetch(`/postal-codes/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postalCode: formattedPostalCode }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log(`New postal code added: ${formattedPostalCode}, ID: ${data.postal_code_id}`); // Optionally log this information for debugging
            return { postal_code_id: parseInt(data.postal_code_id, 10) };
        } else {
            throw new Error('Failed to add new postal code');
        }
    } catch (error) {
        console.error('Error adding new postal code:', error);
        return null;
    }
};

export const lookupPostalCode = async (postalCode) => {
    try {
        const formattedPostalCode = postalCode.toUpperCase().replace(/\s+/g, '');
        const response = await fetch(`/postal-codes/lookup/${formattedPostalCode}`);

        if (response.ok) {
            const data = await response.json();
            return { postal_code_id: parseInt(data.postal_code_id, 10) };
        } else if (response.status === 404) {
            // Postal code not found, proceed to add it
            return addPostalCode(formattedPostalCode);
        } else {
            throw new Error('Postal code lookup failed');
        }
    } catch (error) {
        console.error('Error during postal code lookup:', error);
        return null;
    }
};