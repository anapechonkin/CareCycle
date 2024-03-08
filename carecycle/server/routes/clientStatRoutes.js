// Import required modules
const { pool } = require('../config/db'); // Database connection pool

// Retrieves all clientStats from the database
const getClientStats = async (request, response) => {
    try {
        const results = await pool.query('SELECT * FROM carecycle.clientstats');
        if (results.rows.length > 0) {
            response.status(200).json(results.rows);
        } else {
            response.status(200).json({ message: 'No client stats found' });
        }
    } catch (error) {
        console.error('Error fetching all client stats:', error);
        response.status(500).json({ error: 'Internal server error' });
    }
};

// Fetches a single clientStat by their unique ID
const getClientStatById = async (request, response) => {
    const id = parseInt(request.params.id);
    if (isNaN(id)) {
        return response.status(400).json({ error: 'Invalid clientStat ID' });
    }

    try {
        const results = await pool.query('SELECT * FROM carecycle.clientstats WHERE cs_id = $1', [id]);
        if (results.rows.length > 0) {
            response.status(200).json(results.rows[0]);
        } else {
            response.status(404).json({ error: 'ClientStat not found' });
        }
    } catch (error) {
        console.error(`Error fetching clientStat by ID ${id}:`, error);
        response.status(500).json({ error: 'Internal server error' });
    }
};

//Fetches clientStats by Year of Birth
const getClientStatsByYOB = async (request, response) => {
    const yearOfBirth = parseInt(request.params.yearOfBirth);
    try {
        const results = await pool.query('SELECT * FROM carecycle.clientstats WHERE year_of_birth = $1', [yearOfBirth]);
        if (results.rows.length > 0) {
            response.status(200).json(results.rows);
        } else {
            response.status(404).json({ message: 'No client stats found for the provided Year of Birth' });
        }
    } catch (error) {
        console.error(`Error fetching clientStats by Year of Birth '${yearOfBirth}':`, error);
        response.status(500).json({ error: 'Internal server error' });
    }
};

// Fetches clientStats by postalCodeId
const getClientByPostalCodeId = async (request, response) => {
    // Convert the incoming ID to an integer
    const postalCodeId = parseInt(request.params.postalCodeId);

    // Check if conversion was successful; if not, it means the input was not a valid integer
    if (isNaN(postalCodeId)) {
        return response.status(400).json({ error: 'Invalid postal code ID' });
    }

    try {
        const results = await pool.query('SELECT * FROM carecycle.clientstats WHERE postal_code_id = $1', [postalCodeId]);
        if (results.rows.length > 0) {
            response.status(200).json(results.rows);
        } else {
            response.status(404).json({ error: 'No client stats found for the provided postal code ID' });
        }
    } catch (error) {
        console.error(`Error fetching clientStats by postal code ID '${postalCodeId}':`, error);
        response.status(500).json({ error: 'Internal server error' });
    }
};


// Adds a new clientStat with provided details to the database
const addClientStat = async (request, response) => {
    const { primaryGenderId, yearOfBirth, mapId, postalCodeId, workshopId } = request.body;
    const query = `
        INSERT INTO carecycle.ClientStats 
        (primary_gender_id, year_of_birth, map_id, postal_code_id, workshop_id, user_id) 
        VALUES 
        ($1, $2, $3, $4, $5, NULL)
        RETURNING *;`;

    const values = [primaryGenderId, yearOfBirth, mapId, postalCodeId, workshopId];

    try {
        const results = await pool.query(query, values);
        response.status(201).json(results.rows[0]);
    } catch (error) {
        console.error('Error adding clientStat:', error);
        response.status(500).json({ error: 'Internal server error' });
    }
};

// Updates an existing clientStat based on its cs_id
const updateClientStat = async (request, response) => {
    const cs_id = parseInt(request.params.cs_id);
    const { primaryGenderId, yearOfBirth, mapId, postalCodeId, workshopId, userId } = request.body;

    // Initialize an array to hold parts of the SQL SET clause
    const updates = [];
    // Initialize an array to hold the values for the parameterized query
    const values = [];
    // Keep track of the parameter position for the SQL query
    let valuePosition = 1;

    // Dynamically add fields to the updates array if they're present in the request
    if (primaryGenderId !== undefined) {
        updates.push(`primary_gender_id = $${valuePosition++}`);
        values.push(primaryGenderId);
    }
    if (yearOfBirth !== undefined) {
        updates.push(`year_of_birth = $${valuePosition++}`);
        values.push(yearOfBirth);
    }
    if (mapId !== undefined) {
        updates.push(`map_id = $${valuePosition++}`);
        values.push(mapId);
    }
    if (postalCodeId !== undefined) {
        updates.push(`postal_code_id = $${valuePosition++}`);
        values.push(postalCodeId);
    }
    if (workshopId !== undefined) {
        updates.push(`workshop_id = $${valuePosition++}`);
        values.push(workshopId);
    }
    if (userId !== undefined) {
        updates.push(`user_id = $${valuePosition++}`);
        values.push(userId);
    }

    // Add the cs_id to the values array for the WHERE clause
    values.push(cs_id);

    // If no fields were provided for update, return an error
    if (updates.length === 0) {
        return response.status(400).json({ error: 'No valid fields provided for update' });
    }

    // Construct the SQL query
    const sqlQuery = `
        UPDATE carecycle.ClientStats
        SET ${updates.join(', ')}
        WHERE cs_id = $${valuePosition}
        RETURNING *;`;

    try {
        const results = await pool.query(sqlQuery, values);
        if (results.rows.length > 0) {
            response.status(200).json(results.rows[0]);
        } else {
            response.status(404).send(`ClientStat not found with ID: ${cs_id}`);
        }
    } catch (error) {
        console.error('Error updating clientStat:', error);
        response.status(500).send('Error updating clientStat');
    }
};


// Deletes a clientStat by its cs_id
const deleteClientStatById = async (request, response) => {
    const cs_id = parseInt(request.params.cs_id);
    try {
        const results = await pool.query('DELETE FROM carecycle.ClientStats WHERE cs_id = $1 RETURNING *;', [cs_id]);
        if (results.rowCount > 0) {
            response.status(200).json({ message: `ClientStat deleted with ID: ${cs_id}` });
        } else {
            response.status(404).send(`ClientStat not found with ID: ${cs_id}`);
        }
    } catch (error) {
        console.error('Error deleting clientStat:', error);
        response.status(500).send('Error deleting clientStat');
    }
};

module.exports = {
   getClientStats,
   getClientStatById,
   getClientByPostalCodeId,
   getClientStatsByYOB,
   addClientStat,
   updateClientStat,
   deleteClientStatById
};
