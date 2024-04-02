// Import required modules
const { pool } = require('../config/db'); // Database connection pool

const getClientStats = async (request, response) => {
    const filters = request.query;
    let queryParams = [];
    let whereConditions = [];
    let queryIndex = 1;

    // Function to add conditions and parameters for array types
    const addArrayCondition = (condition, values) => {
        if (values && values.length > 0) {
            whereConditions.push(`${condition} = ANY($${queryIndex}::int[])`);
            queryParams.push(values.split(',').map(Number)); // Convert string values to numbers
            queryIndex++;
        }
    };

    // Add conditions based on the filters provided
    addArrayCondition('ns.newcomer_status_id', filters.newcomerStatus);
    addArrayCondition('pg.primary_gender_id', filters.primaryGenders);
    addArrayCondition('gi.gender_identity_id', filters.genderIdentities);
    addArrayCondition('ma.map_id', filters.mapRegions);
    addArrayCondition('a.area_id', filters.areas);
    addArrayCondition('w.workshop_id', filters.workshopTypes);
    addArrayCondition('si.self_identification_id', filters.selfIdentification);

    // Add condition for yearOfBirth
    if (filters.yearOfBirth && filters.yearOfBirth !== 'ALL' && filters.yearOfBirth !== '') {
        whereConditions.push(`cs.year_of_birth = $${queryIndex}`);
        queryParams.push(parseInt(filters.yearOfBirth));
        queryIndex++;
    }

    // Handle date range filter only if explicitly provided
    if (filters.startDate && filters.startDate !== '') {
        whereConditions.push(`cs.created_at >= $${queryIndex}`);
        queryParams.push(new Date(filters.startDate).toISOString());
        queryIndex++;
    }
    if (filters.endDate && filters.endDate !== '') {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59); // Set to the end of the day
        whereConditions.push(`cs.created_at <= $${queryIndex}`);
        queryParams.push(endDate.toISOString());
        queryIndex++;
    }

    // Build the SQL query
    let query = `
    SELECT
        cs.cs_id, 
        p.postal_code,
        a.area_name,
        cs.year_of_birth, 
        pg.gender_name AS primary_gender,
        ARRAY_AGG(DISTINCT gi.type) FILTER (WHERE gi.type IS NOT NULL) AS gender_identities,
        cs.custom_gender, 
        ns.status AS newcomer_status, 
        cs.newcomer_comment, 
        ARRAY_AGG(DISTINCT si.option) FILTER (WHERE si.option IS NOT NULL) AS self_identifications,
        ARRAY_AGG(DISTINCT ma.map_area_name) FILTER (WHERE ma.map_area_name IS NOT NULL) AS map_areas,
        w.name AS workshop_name,
        pl.language_id,
        pl.language_name
    FROM 
        carecycle.ClientStats cs
        LEFT JOIN carecycle.NewcomerStatus ns ON cs.newcomer_status_id = ns.newcomer_status_id
        LEFT JOIN carecycle.PrimaryGender pg ON cs.primary_gender_id = pg.primary_gender_id
        LEFT JOIN carecycle.clientStats_mapArea csm ON cs.cs_id = csm.cs_id
        LEFT JOIN carecycle.MapArea ma ON csm.map_id = ma.map_id
        LEFT JOIN carecycle.client_genderIdentity cgi ON cs.cs_id = cgi.cs_id
        LEFT JOIN carecycle.GenderIdentity gi ON cgi.gender_identity_id = gi.gender_identity_id
        LEFT JOIN carecycle.Workshop w ON cs.workshop_id = w.workshop_id
        LEFT JOIN carecycle.PostalCode p ON cs.postal_code_id = p.postal_code_id
        LEFT JOIN carecycle.Area a ON p.area_id = a.area_id
        LEFT JOIN carecycle.ClientStats_SelfIdentification csi ON cs.cs_id = csi.cs_id
        LEFT JOIN carecycle.SelfIdentification si ON csi.self_identification_id = si.self_identification_id
        LEFT JOIN carecycle.PreferredLanguage pl ON cs.language_id = pl.language_id
    `;

    // Append WHERE clause if filters are provided
    if (whereConditions.length > 0) {
        query += `WHERE ${whereConditions.join(" AND ")} `;
    }

    // Finish the query with GROUP BY and ORDER BY clauses
    query += `
        GROUP BY cs.cs_id, ns.status, pg.gender_name, w.name, p.postal_code, a.area_name, pl.language_id, pl.language_name
        ORDER BY cs.cs_id;
    `;

    try {
        // Log the query and query parameters for debugging
        console.log('Query:', query);
        console.log('Query Params:', queryParams);

        // Assuming 'pool' is your database connection pool
        const result = await pool.query(query, queryParams);
        console.log('Query results:', result.rows);
        // Ensure that the response includes the language_name
        const processedResults = result.rows.map(row => ({
            ...row,
            language_name: row.language_name || 'N/A' // Provide a default value if language_name is not set
        }));
        response.status(200).json(processedResults);
    } catch (error) {
        console.error('Error executing query:', error);
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
    const { primaryGenderId, yearOfBirth, postalCodeId, workshopId, newcomerStatusId, newcomerComment, customGender, languageId } = request.body;
    // Include newcomer_status_id in the INSERT statement
    const query = `
        INSERT INTO carecycle.ClientStats 
        (primary_gender_id, year_of_birth, postal_code_id, workshop_id, newcomer_status_id, newcomer_comment, custom_gender, language_id, user_id) 
        VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, NULL)  
        RETURNING *;`;

    // Include newcomerStatusId in the values array
    const values = [primaryGenderId, yearOfBirth, postalCodeId, workshopId, newcomerStatusId, newcomerComment, customGender, languageId];

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
    const { primaryGenderId, yearOfBirth, postalCodeId, workshopId, languageId, userId } = request.body;

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
    if (languageId !== undefined) {
        updates.push(`language_id = $${valuePosition++}`);
        values.push(languageId);
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
