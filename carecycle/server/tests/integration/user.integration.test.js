// Assuming userRoutes.js exports getUsers and addUser functions
const { getUsers, addUser } = require('../../routes/userRoutes.js');

async function main() {
  console.log("Starting integration test...");

  // Define detailed mock users
  const detailedUsers = [
    {
      username: "user1",
      password: "password1", // Assume hashing happens within the addUser function
      firstName: "First1",
      lastName: "Last1",
      primaryGenderId: 1,
      vegetable: "Broccoli",
      yearOfBirth: 1990,
      postalCodeId: 1,
      isActive: true,
      userTypeID: 1,
      mapID: 1
    },
    {
      username: "user2",
      password: "password2",
      firstName: "First2",
      lastName: "Last2",
      primaryGenderId: 2,
      vegetable: "Spinach",
      yearOfBirth: 1985,
      postalCodeId: 2,
      isActive: true,
      userTypeID: 2,
      mapID: 2
    }
  ];

  // Mock response object with detailed logging
  const mockResponse = () => ({
    status: function(code) {
      console.log(`Response status code: ${code}`);
      return this;
    },
    json: function(data) {
      console.log("Response JSON data:", JSON.stringify(data, null, 2));
      if (Array.isArray(data) && data.length === 0) {
        console.log("No users found.");
      } else {
        console.log("Operation successful.");
      }
      return this;
    }
  });

  // Mock request object generator
  const mockRequest = (userData) => ({
    body: userData
  });

  // Test sequence
  console.log("\nFetching all users initially...");
  await getUsers(mockRequest(), mockResponse());

  for (const user of detailedUsers) {
    console.log(`\nAdding user: ${user.username}`);
    await addUser(mockRequest(user), mockResponse());
  }

  console.log("\nFetching all users after additions...");
  await getUsers(mockRequest(), mockResponse());

  console.log("\nIntegration test completed.");
}

main().catch(console.error);
