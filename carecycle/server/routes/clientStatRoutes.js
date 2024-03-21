// Import required modules
const { pool } = require('../config/db'); // Database connection pool

// Retrieves all clientStats from the database
const getClientStats = async (request, response) => {
    try {
        const query = `
            SELECT 
                cs.cs_id, 
                cs.year_of_birth, 
                cs.custom_gender, 
                cs.newcomer_comment, 
                ns.status AS newcomer_status, 
                pc.postal_code, 
                a.area_name AS area,
                pg.gender_name AS primary_gender, 
                w.name AS workshop_name,
                ARRAY_AGG(DISTINCT gi.type) FILTER (WHERE gi.type IS NOT NULL) AS gender_identities,
                ARRAY_AGG(DISTINCT si.option) FILTER (WHERE si.option IS NOT NULL) AS self_identifications,
                ARRAY_AGG(DISTINCT ma.map_area_name) FILTER (WHERE ma.map_area_name IS NOT NULL) AS map_areas
            FROM 
                carecycle.clientstats cs
            LEFT JOIN carecycle.newcomerstatus ns ON cs.newcomer_status_id = ns.newcomer_status_id
            LEFT JOIN carecycle.postalcode pc ON cs.postal_code_id = pc.postal_code_id
            LEFT JOIN carecycle.area a ON pc.area_id = a.area_id
            LEFT JOIN carecycle.primarygender pg ON cs.primary_gender_id = pg.primary_gender_id
            LEFT JOIN carecycle.workshop w ON cs.workshop_id = w.workshop_id
            LEFT JOIN carecycle.clientstats_maparea csma ON cs.cs_id = csma.cs_id
            LEFT JOIN carecycle.maparea ma ON csma.map_id = ma.map_id
            LEFT JOIN carecycle.client_genderidentity cgi ON cs.cs_id = cgi.cs_id
            LEFT JOIN carecycle.genderidentity gi ON cgi.gender_identity_id = gi.gender_identity_id
            LEFT JOIN carecycle.clientstats_selfidentification csi ON cs.cs_id = csi.cs_id
            LEFT JOIN carecycle.selfidentification si ON csi.self_identification_id = si.self_identification_id
            GROUP BY 
                cs.cs_id, ns.status, pc.postal_code, a.area_name, pg.gender_name, w.name
            ORDER BY 
                cs.cs_id;
        `;
        const results = await pool.query(query);
        if (results.rows.length > 0) {
            // Mapping through results to ensure unique values in arrays
            const formattedResults = results.rows.map(row => ({
                ...row,
                gender_identities: Array.from(new Set(row.gender_identities)),
                self_identifications: Array.from(new Set(row.self_identifications)),
                map_areas: Array.from(new Set(row.map_areas)),
            }));
            response.status(200).json(formattedResults);
        } else {
            response.status(200).json({ message: 'No client stats found' });
        }
    } catch (error) {
        console.error('Error fetching client stats with details:', error);
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
    const { primaryGenderId, yearOfBirth, postalCodeId, workshopId, newcomerStatusId, newcomerComment, customGender } = request.body;
    // Include newcomer_status_id in the INSERT statement
    const query = `
        INSERT INTO carecycle.ClientStats 
        (primary_gender_id, year_of_birth, postal_code_id, workshop_id, newcomer_status_id, newcomer_comment, custom_gender, user_id) 
        VALUES 
        ($1, $2, $3, $4, $5, $6, $7, NULL)  
        RETURNING *;`;

    // Include newcomerStatusId in the values array
    const values = [primaryGenderId, yearOfBirth, postalCodeId, workshopId, newcomerStatusId, newcomerComment, customGender];

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
    const { primaryGenderId, yearOfBirth, postalCodeId, workshopId, userId } = request.body;

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
