// Import required modules
const pool = require('../config/db'); // Database connection pool
const bcrypt = require('bcrypt'); // For hashing passwords
const saltRounds = 10; // Defines the complexity of the hash function

// Retrieves all users from the database
const getUsers = async (request, response) => {
    try {
        const results = await pool.query('SELECT * FROM carecycle.users');
        if (results.rows.length > 0) {
            response.status(200).json(results.rows);
        } else {
            // Respond with 200 OK and a message indicating no users found
            // This is not considered an error state, thus using 200
            response.status(200).json({ message: 'No users found' });
        }
    } catch (error) {
        console.error('Error fetching all users:', error);
        response.status(500).json({ error: 'Internal server error' });
    }
};

// Fetches a single user by their unique ID
const getUserById = async (request, response) => {
    const id = parseInt(request.params.id);
    if (isNaN(id)) {
        return response.status(400).json({ error: 'Invalid user ID' });
    }

    try {
        const results = await pool.query('SELECT * FROM carecycle.users WHERE user_id = $1', [id]);
        if (results.rows.length > 0) {
            response.status(200).json(results.rows[0]);
        } else {
            response.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error(`Error fetching user by ID ${id}:`, error);
        response.status(500).json({ error: 'Internal server error' });
    }
};

// Fetches a single user by their username
const getUserByUsername = async (request, response) => {
    const username = request.params.username;
    try {
        const results = await pool.query('SELECT * FROM carecycle.users WHERE username = $1', [username]);
        if (results.rows.length > 0) {
            response.status(200).json(results.rows[0]);
        } else {
            response.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error(`Error fetching user by username '${username}':`, error);
        response.status(500).json({ error: 'Internal server error' });
    }
};

// Adds a new user with provided details, hashing the password for security
const addUser = async (request, response) => {
    const { username, password, firstName, lastName, vegetable, yearOfBirth, primaryGenderId, postalCodeId, isActive, userTypeID, mapID } = request.body;

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const result = await pool.query(`
            INSERT INTO carecycle.users 
            (username, password, firstname, lastname, vegetable, year_of_birth, primary_gender_id, postal_code_id, is_active, usertype_id, map_id) 
            VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *;`,
            [username, hashedPassword, firstName, lastName, vegetable, yearOfBirth, primaryGenderId, postalCodeId, isActive, userTypeID, mapID]);

        response.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding new user:', error);
        response.status(500).json({ error: 'Internal server error' });
    }
};

// Updates an existing user's information, excluding the password
const updateUser = async (request, response) => {
    const id = parseInt(request.params.id);
    const { username, firstName, lastName, primaryGenderId, vegetable, yearOfBirth, postalCodeId, isActive, userTypeID, mapID } = request.body;

    try {
        const result = await pool.query(`
            UPDATE carecycle.users
            SET 
                username = $1, 
                firstname = $2, 
                lastname = $3, 
                primary_gender_id = $4, 
                vegetable = $5, 
                year_of_birth = $6, 
                postal_code_id = $7, 
                is_active = $8, 
                usertype_id = $9, 
                map_id = $10
            WHERE user_id = $11
            RETURNING *;`,
            [username, firstName, lastName, primaryGenderId, vegetable, yearOfBirth, postalCodeId, isActive, userTypeID, mapID, id]);

        if (result.rowCount > 0) {
            response.status(200).json(result.rows[0]);
        } else {
            response.status(404).json({ error: `User not found with ID: ${id}` });
        }
    } catch (error) {
        console.error(`Error updating user with ID ${id}:`, error);
        response.status(500).json({ error: 'Internal server error' });
    }
};

// Soft deletes a user by deactivating their account using ID
const softDeleteUserById = async (request, response) => {
    const id = parseInt(request.params.id);
    try {
        const result = await pool.query(`
            UPDATE carecycle.users 
            SET is_active = FALSE 
            WHERE user_id = $1
            RETURNING *;`, [id]);

        if (result.rowCount > 0) {
            response.status(200).json({ message: `User archived with ID: ${id}`, user: result.rows[0] });
        } else {
            response.status(404).json({ error: `User not found with ID: ${id}` });
        }
    } catch (error) {
        console.error(`Error soft deleting user with ID ${id}:`, error);
        response.status(500).json({ error: 'Internal server error' });
    }
};

// Soft deletes a user by deactivating their account using username
const softDeleteUserByUsername = async (request, response) => {
    const username = request.params.username;
    try {
        const result = await pool.query(`
            UPDATE carecycle.users 
            SET is_active = FALSE 
            WHERE username = $1
            RETURNING *;`, [username]);

        if (result.rowCount > 0) {
            response.status(200).json({ message: `User archived with username: ${username}`, user: result.rows[0] });
        } else {
            response.status(404).json({ error: `User not found with username: ${username}` });
        }
    } catch (error) {
        console.error(`Error soft deleting user with username '${username}':`, error);
        response.status(500).json({ error: 'Internal server error' });
    }
};

// Permanently deletes a user by their unique ID
const deleteUserById = async (request, response) => {
    const id = parseInt(request.params.id);
    if (isNaN(id)) {
        return response.status(400).json({ error: 'Invalid user ID' });
    }

    try {
        const result = await pool.query('DELETE FROM carecycle.users WHERE user_id = $1 RETURNING *;', [id]);
        if (result.rowCount > 0) {
            response.status(200).json({ message: `User deleted with ID: ${id}` });
        } else {
            response.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error(`Error deleting user with ID ${id}:`, error);
        response.status(500).json({ error: 'Internal server error' });
    }
};

// Permanently deletes a user by their username
const deleteUserByUsername = async (request, response) => {
    const username = request.params.username;
    try {
        const result = await pool.query('DELETE FROM carecycle.users WHERE username = $1 RETURNING *;', [username]);
        if (result.rowCount > 0) {
            response.status(200).json({ message: `User deleted with username: ${username}` });
        } else {
            response.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error(`Error deleting user with username '${username}':`, error);
        response.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getUsers,
    getUserById,
    getUserByUsername,
    addUser,
    updateUser,
    softDeleteUserById,
    softDeleteUserByUsername,
    deleteUserById,
    deleteUserByUsername
};
