export const getUsers = async () => {
  try {
    const response = await fetch('/users', {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json(); // Returns the array of users
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await fetch(`/users/${userId}`, { // Adjusted to match your server route
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.json(); // Assuming the API returns JSON data
    return data; // This will be the user details object
  } catch (error) {
    console.error('Failed to fetch user details:', error);
    throw error; // Re-throwing the error to be handled by the caller
  }
};

export const addUser = async (userData) => {
    try {
      const response = await fetch('/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to add user:', error);
      throw error;
    }
  };

  export const updateUser = async (userId, userData) => {
    try {
      const response = await fetch(`/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        throw new Error('Could not update user');
      }
  
      return await response.json(); // Or handle the response as needed
    } catch (error) {
      console.error('Error updating user:', error);
      // Handle error
    }
  };

  export const softDeleteUser = async (userId) => {
    const requestOptions = {
      method: 'DELETE', 
      headers: { 'Content-Type': 'application/json' }
    };
  
    try {
      const response = await fetch(`/api/users/${userId}`, requestOptions);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json(); // Assuming the server responds with the updated user data
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
      throw error;
    }
  };