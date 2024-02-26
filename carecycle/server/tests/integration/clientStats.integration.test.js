// Import necessary modules and functions
const { initializeDatabase } = require('../../config/db');

// Import required modules for user and client stat management
const {
    addUser,
  } = require('../../routes/userRoutes');
  
  const {
    getClientStats,
    getClientStatById,
    getClientByPostalCodeId,
    getClientStatsByYOB,
    addClientStat,
    updateClientStat,
    deleteClientStatById,
  } = require('../../routes/clientStatRoutes');
  
  // Manually initialize the database before running tests
  initializeDatabase()
    .then(() => {
    // Call your test function here after the database is initialized
    main();
    })
    .catch((error) => {
    console.error('Error initializing database:', error);
  });

  // Helper function to simulate response object
  const mockResponse = () => ({
    status: function(code) {
      this.code = code;
      return this; // Chainable
    },
    json: function(data) {
      console.log(`Response status code: ${this.code}, Data:`, JSON.stringify(data, null, 2));
      global.lastJsonResponse = data; // Storing response globally for easy access
      return this; // Chainable
    }
  });
  
  // Helper function to create a mock request object
  const mockRequest = (data) => ({ params: data, body: data });
  
  // Function to add users required for client stat foreign keys
  async function addRequiredUsers(users) {
    for (const user of users) {
      console.log(`Adding user: ${user.username}`);
      await addUser(mockRequest(user), mockResponse());
    }
  }
  
  async function main() {
    try {
    console.log("Starting client stats services integration test...");
  
    // 1. Define and add necessary users
    const users = [
      { username: "user1", password: "password1", firstName: "First1", lastName: "Last1", primaryGenderId: 1, vegetable: "Broccoli", yearOfBirth: 1990, postalCodeId: 1, isActive: true, userTypeID: 1, mapID: 1 },
      { username: "user2", password: "password2", firstName: "First2", lastName: "Last2", primaryGenderId: 2, vegetable: "Spinach", yearOfBirth: 1985, postalCodeId: 2, isActive: true, userTypeID: 2, mapID: 2 },
    ];
  
    await addRequiredUsers(users);
  
    // 2. Check clientstats (should be empty)
    console.log("\nChecking client stats initially...");
    await getClientStats(mockRequest({}), mockResponse());
  
    // 3. Add both clientstats
    const clientStats = [
      { primaryGenderId: 1, yearOfBirth: 1990, mapId: 1, postalCodeId: 1, workshopId: 1, userId: 1 },
      { primaryGenderId: 2, yearOfBirth: 1985, mapId: 2, postalCodeId: 2, workshopId: 2, userId: 2 },
    ];
  
    for (const stat of clientStats) {
      console.log("\nAdding client stat...");
      await addClientStat(mockRequest(stat), mockResponse());
    }
  
    // 4. Verify stats (should have 2 now)
    console.log("\nVerifying client stats after additions...");
    await getClientStats(mockRequest({}), mockResponse());
  
    // 5. Get client by YOB
    console.log("\nFetching client stats by Year of Birth: 1990...");
    await getClientStatsByYOB(mockRequest({ yearOfBirth: 1990 }), mockResponse());
  
    // 6. (Step 6 was missing in the sequence, assuming it's an oversight)
    
    // 7. Get client by postal code
    console.log("\nFetching client stats by Postal Code: 1...");
    await getClientByPostalCodeId(mockRequest({ postalCodeId: 1 }), mockResponse());
  
    const clientToUpdateId = global.lastJsonResponse[0].cs_id; // Assuming we're updating the first fetched client stat
  
    // 8. Update that client using ID
    console.log(`\nUpdating client stat with ID: ${clientToUpdateId}...`);
    await updateClientStat(mockRequest({ cs_id: clientToUpdateId, primaryGenderId: 3, yearOfBirth: 1991 }), mockResponse());
  
    // 9. Verify if update worked by getting client by ID
    console.log(`\nFetching updated client stat by ID: ${clientToUpdateId} to verify update...`);
    await getClientStatById(mockRequest({ id: clientToUpdateId }), mockResponse());
  
    // 10. Delete one client
    console.log(`\nDeleting client stat with ID: ${clientToUpdateId}...`);
    await deleteClientStatById(mockRequest({ cs_id: clientToUpdateId }), mockResponse());
  
    // 11. Check to make sure the right one was deleted and that there is now only 1 client stat
    console.log("\nChecking client stats after deleting one...");
    await getClientStats(mockRequest({}), mockResponse());
  
    // Assuming the lastJsonResponse now contains only one entry, get its ID to delete
    const lastClientStatId = global.lastJsonResponse.length > 0 ? global.lastJsonResponse[0].cs_id : null;
  
    // 12. Delete the last one
    if (lastClientStatId) {
      console.log(`\nDeleting the last client stat with ID: ${lastClientStatId}...`);
      await deleteClientStatById(mockRequest({ cs_id: lastClientStatId }), mockResponse());
    }
  
    // 13. Check to make sure table is empty
    console.log("\nFinal check to ensure the client stats table is empty...");
    await getClientStats(mockRequest({}), mockResponse());
  
    console.log("\nIntegration test completed.");
} catch (error) {
    console.error('Error running tests:', error);
  } finally {
    console.log("Tests completed.");
  }
}