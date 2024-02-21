// Import required modules
const pool = require('../config/db'); // Database connection pool
const bcrypt = require('bcrypt'); // For hashing passwords
const saltRounds = 10; // Defines the complexity of the hash function

// Retrieves all users from the database
const getUsers = (request, response) => {
    console.log("Received request to fetch all users");

    // Query the database to fetch all users
    pool.query('SELECT * FROM carecycle.users', (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            // Handle the error and return an appropriate response
            return response.status(500).json({ error: 'Internal server error' });
        }
        
        // Check if users are found
        if (results.rows.length > 0) {
            console.log('Returning users:', results.rows);
            // Send the users data in the response
            return response.status(200).json(results.rows); // Use return here
        } else {
            console.log('No users found');
            // Send a 404 response if no users are found
            return response.status(404).json({ error: 'No users found' }); // Use return here
        }
    });    
};

// Fetches a single user by their unique ID
const getUserById = (request, response) => {
    const id = parseInt(request.params.id);
    console.log('Received user ID:', id); 

    if (isNaN(id)) {
        return response.status(400).json({ error: 'Invalid user ID' });
    }

    pool.query('SELECT * FROM carecycle.users WHERE user_id = $1', [id], (error, results) => {
        if (error) {
            console.error('Error fetching user by ID:', error);
            return response.status(500).json({ error: 'Internal server error' });
        }
        
        if (!results || results.rows.length === 0) {
            console.log('User not found');
            return response.status(404).json({ error: 'User not found' });
        }
        
        return response.status(200).json(results.rows[0]);
    });
};

// Add error handling in getUserByUsername function
const getUserByUsername = (request, response) => {
    const username = request.params.username;
    pool.query('SELECT * FROM carecycle.users WHERE username = $1', [username], (error, results) => {
        if (error) {
            console.error('Error fetching user by username:', error);
            return response.status(500).json({ error: 'Internal server error' });
        }
        if (!results || results.rows.length === 0) {
            console.log('User not found');
            return response.status(404).json({ error: 'User not found' });
        }
        response.status(200).json(results.rows);
    });
};

// Adds a new user with provided details, hashing the password for security
const addUser = (request, response) => {
    const { username, password, firstName, lastName, primaryGender, vegetable, yearOfBirth, postalCodeId, isActive, userTypeID, mapID } = request.body;

    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            response.status(500).send('Error hashing password');
            return;
        }
        const query = `
            INSERT INTO carecycle.users 
            (username, password, first_name, last_name, primary_gender, vegetable, year_of_birth, postal_code_id, is_active, usertype_id, map_id) 
            VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *;`;

        const values = [username, hashedPassword, firstName, lastName, primaryGender, vegetable, yearOfBirth, postalCodeId, isActive, userTypeID, mapID];

        pool.query(query, values, (error, results) => {
            if (error) throw error;
            response.status(201).json(results.rows[0]);
        });
    });
};

// Updates an existing user's information
const updateUser = (request, response) => {
    const id = parseInt(request.params.id);
    const { username, password, firstName, lastName, primaryGender, vegetable, yearOfBirth, postalCodeId, isActive, userTypeID, mapID } = request.body;

    const query = `
        UPDATE carecycle.users
        SET 
            username = $1, 
            password = $2, 
            first_name = $3, 
            last_name = $4, 
            primary_gender = $5, 
            vegetable = $6, 
            year_of_birth = $7, 
            postal_code_id = $8, 
            is_active = $9, 
            usertype_id = $10, 
            map_id = $11
        WHERE user_id = $12
        RETURNING *;`;

    const values = [username, password, firstName, lastName, primaryGender, vegetable, yearOfBirth, postalCodeId, isActive, userTypeID, mapID, id];

    pool.query(query, values, (error, results) => {
        if (error) {
            console.error('Error updating user:', error);
            return response.status(500).json({ error: 'Internal server error' });
        }
        if (results.rowCount > 0) {
            response.status(200).json(results.rows[0]);
        } else {
            response.status(404).json({ error: `User not found with ID: ${id}` });
        }
    });
};

// Soft deletes a user by deactivating their account
const softDeleteUserById = (request, response) => {
    const id = parseInt(request.params.id);

    const query = `
        UPDATE carecycle.users 
        SET is_active = FALSE 
        WHERE user_id = $1
        RETURNING *;`;

    pool.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error soft deleting user:', error);
            return response.status(500).json({ error: 'Internal server error' });
        }
        if (results.rowCount > 0) {
            response.status(200).json({ message: `User archived with ID: ${id}`, user: results.rows[0] });
        } else {
            response.status(404).json({ error: `User not found with ID: ${id}` });
        }
    });
};

// Soft deletes a user by deactivating their account using username
const softDeleteUserByUsername = (request, response) => {
    const username = request.params.username; // Assuming username is passed as a URL parameter

    const query = `
        UPDATE carecycle.users 
        SET is_active = FALSE 
        WHERE username = $1
        RETURNING *;`;

    pool.query(query, [username], (error, results) => {
        if (error) {
            throw error;
        }
        if (results.rowCount > 0) {
            response.status(200).json({ message: `User archived with username: ${username}`, user: results.rows[0] });
        } else {
            response.status(404).send(`User not found with username: ${username}`);
        }
    });
};

module.exports = {
    getUsers,
    getUserById,
    getUserByUsername,
    addUser,
    updateUser,
    softDeleteUserById,
    softDeleteUserByUsername
};
