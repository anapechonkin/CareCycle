// Import required modules
const { response } = require('express');
const pool = require('../config/db'); // Database connection pool
const bcrypt = require('bcrypt'); // For hashing passwords
const saltRounds = 10; // Defines the complexity of the hash function

// Retrieves all clientStats from the database
const getClientStats = (request, response) => {
    pool.query('SELECT * FROM carecycle.clientstats', (error, results) => {
        if (error) throw error;
        response.status(200).json(results.rows);
    });
};

// Fetches a single clientStat by their unique ID
const getClientStatById = (request, response) => {
    const id = parseInt(request.params.id);
    pool.query('SELECT * FROM carecycle.clientstats WHERE cs_id = $1', [id], (error, results) => {
        if (error) throw error;
        response.status(200).json(results.rows);
    });
}

// Adds a new clientStat with provided details to the database
const addClientStat = (request, response) => {
    const { primaryGender, yearOfBirth, mapId, postalCodeId, workshopId, userId } = request.body;
    const query = `
        INSERT INTO ClientStats 
        (primary_gender, year_of_birth, map_id, postal_code_id, workshop_id, user_id) 
        VALUES 
        ($1, $2, $3, $4, $5, $6)
        RETURNING *;`;

    const values = [primaryGender, yearOfBirth, mapId, postalCodeId, workshopId, userId];

    pool.query(query, values, (error, results) => {
        if (error) {
            response.status(500).send('Error adding clientStat');
            return;
        }
        response.status(201).json(results.rows[0]);
    });
};

// Updates an existing clientStat based on its cs_id
const updateClientStat = (request, response) => {
    const cs_id = parseInt(request.params.cs_id);
    const { primaryGender, yearOfBirth, mapId, postalCodeId, workshopId, userId } = request.body;

    const query = `
        UPDATE ClientStats
        SET 
            primary_gender = $1, 
            year_of_birth = $2, 
            map_id = $3, 
            postal_code_id = $4, 
            workshop_id = $5,
             user_id = $6
        WHERE cs_id = $7
        RETURNING *;`;

    const values = [primaryGender, yearOfBirth, mapId, postalCodeId, workshopId, userId, cs_id];

    pool.query(query, values, (error, results) => {
        if (error) {
            response.status(500).send('Error updating clientStat');
            return;
        }
        if (results.rows.length > 0) {
            response.status(200).json(results.rows[0]);
        } else {
            response.status(404).send(`ClientStat not found with ID: ${cs_id}`);
        }
    });
};


module.exports = {
   getClientStats,
   getClientStatById,
   addClientStat,
   updateClientStat,
};
