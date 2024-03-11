// Import required modules
const { pool } = require('../config/db'); // Database connection pool
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

const getUserById = async (request, response) => {
    const id = parseInt(request.params.id);
    // Check if the ID is a valid number to prevent errors.
    if (isNaN(id)) {
        return response.status(400).json({ error: 'Invalid user ID' });
    }

    // Query to fetch detailed user information along with their gender identities and map areas.
    const userDetailsQuery = `
    SELECT 
        u.user_id, u.username, u.email, u.firstname, u.lastname, u.vegetable,
        u.year_of_birth, u.is_active, u.usertype_id, u.created_at, u.updated_at,
        pg.gender_name, pg.primary_gender_id,
        pc.postal_code,
        json_agg(distinct gi.*) FILTER (WHERE gi.gender_identity_id IS NOT NULL) AS gender_identities,
        json_agg(distinct ma.map_area_name) FILTER (WHERE ma.map_id IS NOT NULL) AS map_areas
    FROM 
        carecycle.users u
    LEFT JOIN 
        carecycle.postalcode pc ON u.postal_code_id = pc.postal_code_id
    LEFT JOIN 
        carecycle.primarygender pg ON u.primary_gender_id = pg.primary_gender_id
    LEFT JOIN 
        carecycle.users_genderidentity ugi ON u.user_id = ugi.user_id
    LEFT JOIN 
        carecycle.genderidentity gi ON ugi.gender_identity_id = gi.gender_identity_id
    LEFT JOIN 
        carecycle.users_maparea uma ON u.user_id = uma.user_id
    LEFT JOIN 
        carecycle.maparea ma ON uma.map_id = ma.map_id
    WHERE 
        u.user_id = $1
    GROUP BY 
        u.user_id, u.username, u.email, u.firstname, u.lastname, u.vegetable,
        u.year_of_birth, u.is_active, u.usertype_id, u.created_at, u.updated_at,
        pg.gender_name, pc.postal_code, pg.primary_gender_id
    `;

    try {
        const results = await pool.query(userDetailsQuery, [id]);
        // Log the raw results for debugging purposes.
        console.log(`Raw query results for user ID ${id}:`, results.rows);

        if (results.rows.length > 0) {
            const userDetails = results.rows[0];

            // Logging before processing the gender identities to understand the raw data structure.
            console.log(`Before processing gender_identities for user ID ${id}:`, userDetails);

            // Ensure filtering out any null values in gender identities for cleaner data.
            userDetails.gender_identities = userDetails.gender_identities && userDetails.gender_identities.filter(gi => gi.gender_identity_id !== null);
            // Logging after processing to verify the correct removal of nulls.
            console.log(`After processing gender_identities for user ID ${id}:`, userDetails.gender_identities);

            // Map areas are assumed not to require additional filtering. Placeholder for potential adjustments.
            console.log(`Map areas for user ID ${id}:`, userDetails.map_areas);

            // Log the complete userDetails object before sending it in the response.
            console.log(`Final userDetails to be sent for user ID ${id}:`, userDetails);

            response.status(200).json(userDetails);
        } else {
            response.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        // Log any errors to diagnose issues during the query execution.
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
    const { username, email, password, firstName, lastName, vegetable, yearOfBirth, primaryGenderId, postalCodeId, isActive, userTypeID } = request.body;

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const result = await pool.query(`
            INSERT INTO carecycle.users 
            (username, email, password, firstname, lastname, vegetable, year_of_birth, primary_gender_id, postal_code_id, is_active, usertype_id) 
            VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *;`,
            [username, email, hashedPassword, firstName, lastName, vegetable, yearOfBirth, primaryGenderId, postalCodeId, isActive, userTypeID]);

        response.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding new user:', error);
        response.status(500).json({ error: 'Internal server error' });
    }
};

// Updates a user's details using their unique ID
const updateUser = async (request, response) => {
    const id = parseInt(request.params.id);
    const { username, email, firstName, lastName, primaryGenderId, vegetable, yearOfBirth, postalCodeId, isActive, userTypeID, genderIdentities, mapAreas } = request.body;

    try {
        await pool.query('BEGIN'); // Begin transaction

        const updates = [];
        const values = [];
        let valuePosition = 1;

        // Dynamically add fields to the updates array if they're present in the request
        if (username !== undefined) { updates.push(`username = $${valuePosition++}`); values.push(username); }
        if (email !== undefined) { updates.push(`email = $${valuePosition++}`); values.push(email); }
        if (firstName !== undefined) { updates.push(`firstname = $${valuePosition++}`); values.push(firstName); }
        if (lastName !== undefined) { updates.push(`lastname = $${valuePosition++}`); values.push(lastName); }
        if (primaryGenderId !== undefined) { updates.push(`primary_gender_id = $${valuePosition++}`); values.push(primaryGenderId); }
        if (vegetable !== undefined) { updates.push(`vegetable = $${valuePosition++}`); values.push(vegetable); }
        if (yearOfBirth !== undefined) { updates.push(`year_of_birth = $${valuePosition++}`); values.push(yearOfBirth); }
        if (postalCodeId !== undefined) { updates.push(`postal_code_id = $${valuePosition++}`); values.push(postalCodeId); }
        if (isActive !== undefined) { updates.push(`is_active = $${valuePosition++}`); values.push(isActive); }
        if (userTypeID !== undefined) { updates.push(`usertype_id = $${valuePosition++}`); values.push(userTypeID); }
        if (mapAreas !== undefined) { updates.push(`map_id = $${valuePosition++}`); values.push(mapAreas); }

        // Check if primaryGenderId or genderIdentities were provided for update
        if (primaryGenderId !== undefined || (genderIdentities && genderIdentities.length > 0)) {
            // Clear existing gender identity associations
            await pool.query('DELETE FROM carecycle.users_genderidentity WHERE user_id = $1', [id]);

            // Insert new gender identities if provided
            if (genderIdentities && genderIdentities.length > 0) {
                for (const genderIdentityId of genderIdentities) {
                    await pool.query('INSERT INTO carecycle.users_genderidentity (user_id, gender_identity_id) VALUES ($1, $2)', [id, genderIdentityId]);
                }
            }
        }

        // Check if mapAreas were provided for update
        if (mapAreas) {
            // Clear existing map area associations
            await pool.query('DELETE FROM carecycle.users_maparea WHERE user_id = $1', [id]);
            
            // Re-add map areas if provided
            if (mapAreas.length > 0) {
                for (const mapAreaId of mapAreas) {
                    await pool.query('INSERT INTO carecycle.users_maparea (user_id, map_id) VALUES ($1, $2)', [id, mapAreaId]);
                }
            }
        }

        values.push(id); // Add the user ID for the WHERE clause

        if (updates.length === 0) {
            await pool.query('ROLLBACK');
            return response.status(400).json({ error: 'No valid fields provided for update' });
        }

        const sqlQuery = `
            UPDATE carecycle.users
            SET ${updates.join(', ')}
            WHERE user_id = $${valuePosition}
            RETURNING *;`;

        const result = await pool.query(sqlQuery, values);

        if (result.rowCount > 0) {
            await pool.query('COMMIT'); // Commit transaction if successful
            response.status(200).json(result.rows[0]);
        } else {
            await pool.query('ROLLBACK'); // Rollback transaction if no rows affected
            response.status(404).json({ error: `User not found with ID: ${id}` });
        }
    } catch (error) {
        await pool.query('ROLLBACK'); // Rollback transaction on error
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
