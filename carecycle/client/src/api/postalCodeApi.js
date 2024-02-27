export const lookupPostalCode = async (postalCode) => {
    try {
        const response = await fetch(`/postal-codes/lookup/${postalCode}`);
        if (!response.ok) {
            throw new Error('Postal code lookup failed');
        }
        const data = await response.json();
        return parseInt(data.postal_code_id, 10); // Explicitly parse as integer
    } catch (error) {
        console.error('Error during postal code lookup:', error);
        return null;
    }
};
