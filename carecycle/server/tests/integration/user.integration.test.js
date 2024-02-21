// Import the getUsers function
const { getUsers } = require('../../routes/userRoutes.js');

async function main() {
  console.log("Starting getUsers integration test...");

  try {
    // Mock request and response objects
    const request = {};
    const response = {
      status: function(code) {
        // Log the status code for debugging
        console.log("Response status code:", code);
        // Return the response object for chaining
        return this;
      },
      json: function(data) {
        // Log the JSON data received in the response
        console.log("Response JSON data:", data);

        // Check if users were fetched successfully
        if (data && data.length > 0) {
          console.log("Users fetched successfully.");
        } else {
          console.log("No users found.");
        }
      }
    };

    // Call getUsers function with the mock request and response objects
    console.log("\nFetching all users...");
    await getUsers(request, response);

  } catch (error) {
    console.error('Error in getUsers integration test:', error);
    throw error;
  }

  console.log("\ngetUsers integration test completed.");
}

main().catch(console.error);
