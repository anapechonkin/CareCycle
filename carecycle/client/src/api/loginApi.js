export const login = async (credentials) => {
    try {
        const response = await fetch('/login', { // Adjust the URL based on your setup
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        return data; // Returns the response data with token, userId, etc.
    } catch (error) {
        console.error("Error during login:", error);
        throw error; // Rethrowing the error or returning error information might be useful for error handling in the component
    }
};

