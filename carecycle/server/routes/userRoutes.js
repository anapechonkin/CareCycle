// Import required modules
const pool = require('../config/db'); // Database connection pool
const bcrypt = require('bcrypt'); // For hashing passwords
const saltRounds = 10; // Defines the complexity of the hash function

// Retrieves all users from the database
const getUsers = (request, response) => {
    pool.query('SELECT * FROM carecycle.users', (error, results) => {
        if (error) throw error;
        response.status(200).json(results.rows);
    });
};

// Fetches a single user by their unique ID
const getUserById = (request, response) => {
    const id = parseInt(request.params.id);
    pool.query('SELECT * FROM carecycle.users WHERE user_id = $1', [id], (error, results) => {
        if (error) throw error;
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
        if (error) throw error;
        if (results.rowCount > 0) {
            response.status(200).json(results.rows[0]);
        } else {
            response.status(404).send(`User not found with ID: ${id}`);
        }
    });
};

// Soft deletes a user by deactivating their account
const deleteUser = (request, response) => {
    const id = parseInt(request.params.id);

    const query = `
        UPDATE carecycle.users 
        SET is_active = FALSE 
        WHERE user_id = $1
        RETURNING *;`;

    pool.query(query, [id], (error, results) => {
        if (error) throw error;
        if (results.rowCount > 0) {
            response.status(200).json({ message: `User archived with ID: ${id}`, user: results.rows[0] });
        } else {
            response.status(404).send(`User not found with ID: ${id}`);
        }
    });
};

module.exports = {
    getUsers,
    getUserById,
    addUser,
    updateUser,
    deleteUser
};
