// import required modules
const { 
  getUsers, 
  addUser, 
  getUserByUsername, 
  getUserById, 
  updateUser,
  softDeleteUserById,
  softDeleteUserByUsername,
  deleteUserById,
  deleteUserByUsername
} = require('../../routes/userRoutes.js');


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
    },
    {
      username: "user3",
      password: "password3",
      firstName: "First3",
      lastName: "Last3",
      primaryGenderId: 3,
      vegetable: "Potato",
      yearOfBirth: 1999,
      postalCodeId: 3,
      isActive: true,
      userTypeID: 3,
      mapID: 3
    }
  ];

  let lastJsonResponse = null;

  // Modify mockResponse to capture the last JSON response
  const mockResponse = () => {
    return {
        status: function (code) {
            console.log(`Response status code: ${code}`);
            return this; // Chainable
        },
        json: function (data) {
            console.log("Response JSON data:", JSON.stringify(data, null, 2));
            lastJsonResponse = data; // Capture the response data
            console.log("Operation successful.");
            return this; // Chainable
        }
    };
};

  // Mock request object generator
  const mockRequest = (userData) => ({
    body: userData
  });

  // Mock request object generator for a specific username
  const mockRequestUsername = (username) => ({
    params: { username }
  });

  // Mock request object generator for updating user information
  const mockUpdateRequest = (userId, updateData) => ({
    params: { id: userId },
    body: updateData
  });

  // Test sequence
  console.log("\nFetching all users initially...");
  await getUsers(mockRequest(), mockResponse());

  // Add mock users
  for (const user of detailedUsers) {
    console.log(`\nAdding user: ${user.username}`);
    await addUser(mockRequest(user), mockResponse());
  }

  console.log("\nFetching all users after additions...");
  await getUsers(mockRequest(), mockResponse());

 // Fetch a specific user by username
  const specificUsername = "user1"; 
  console.log(`\nFetching user by specific username: ${specificUsername}`);
  await getUserByUsername(mockRequestUsername(specificUsername), mockResponse());
  
// Assuming lastJsonResponse captures the desired user
if (lastJsonResponse && lastJsonResponse.user_id) {
  const userIdToUpdate = lastJsonResponse.user_id;
  const updateData = { firstName: "UpdatedFirst1" };

  console.log(`\nUpdating user with ID: ${userIdToUpdate}`);
  await updateUser(mockUpdateRequest(userIdToUpdate, updateData), mockResponse());

  // Optionally: Fetch by id and verify the update
  const userIdToFetch = 1;
  console.log(`\nFetching user by specific user_id: 1`);
  await getUserById({ params: { id: userIdToFetch.toString() } }, mockResponse());
} else {
  console.log("No user found to update.");
}

// Test soft delete by user ID
const userIdToDeleteSoft = 1; 
console.log(`\nSoft deleting user with ID: ${userIdToDeleteSoft}`);
await softDeleteUserById({ params: { id: userIdToDeleteSoft.toString() } }, mockResponse());

// Test soft delete by username
const usernameToDeleteSoft = "user2"; 
console.log(`\nSoft deleting user with username: ${usernameToDeleteSoft}`);
await softDeleteUserByUsername(mockRequestUsername(usernameToDeleteSoft), mockResponse());

console.log("\nFetching all users after soft deletes...");
  await getUsers(mockRequest(), mockResponse());

// Test hard delete by user ID
const userIdToDeleteHard = 3; 
console.log(`\nHard deleting user with ID: ${userIdToDeleteHard}`);
await deleteUserById({ params: { id: userIdToDeleteHard.toString() } }, mockResponse());

// Test hard delete by username
const usernameToDeleteHard = "user1"; 
console.log(`\nHard deleting user with username: ${usernameToDeleteHard}`);
await deleteUserByUsername(mockRequestUsername(usernameToDeleteHard), mockResponse());

console.log("\nFetching all users after deleting user1 and user3...");
  await getUsers(mockRequest(), mockResponse());

//Hard delete user2
const userIdToDeleteHardAgain = 2; 
console.log(`\nHard deleting user with ID: ${userIdToDeleteHardAgain}`);
await deleteUserById({ params: { id: userIdToDeleteHardAgain.toString() } }, mockResponse());

console.log("\nFetching all users after deleting user2...should be empty");
  await getUsers(mockRequest(), mockResponse());

  console.log("\nIntegration test completed.");
}

main().catch(console.error);
