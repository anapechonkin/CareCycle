const { pool } = require('../config/db');

// Fetch all self-identification options
async function fetchSelfIdentificationOptions(req, res) {
    try {
        const result = await pool.query('SELECT self_identification_id, option FROM carecycle.selfidentification');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching self-identification options:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Function to add self-identification options to client stats
async function addClientStatsSelfIdentification(req, res) {
    const { clientStatId } = req.params; // Assuming clientStatId is passed as a URL parameter
    const { selfIdentificationIds } = req.body; // Expect an array of self_identification_id

    let addedOptionsInfo = [];

    try {
        await pool.query('BEGIN');

        for (let selfIdentificationId of selfIdentificationIds) {
            // Check if the association already exists to prevent duplicates
            const exists = await pool.query('SELECT 1 FROM carecycle.clientstats_selfidentification WHERE cs_id = $1 AND self_identification_id = $2', [clientStatId, selfIdentificationId]);

            if (exists.rowCount === 0) {
                await pool.query('INSERT INTO carecycle.clientstats_selfidentification (cs_id, self_identification_id) VALUES ($1, $2)', [clientStatId, selfIdentificationId]);
                
                // Optionally fetch the self-identification option name for the added option
                const result = await pool.query('SELECT option FROM carecycle.selfidentification WHERE self_identification_id = $1', [selfIdentificationId]);
                if (result.rows.length > 0) {
                    addedOptionsInfo.push({id: selfIdentificationId, option: result.rows[0].option});
                }
            }
        }

        await pool.query('COMMIT');
        res.json({ message: 'Self-identification options added successfully to client stats.', addedOptions: addedOptionsInfo });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error adding self-identification options to client stats:', error);
        res.status(500).json({ message: 'Failed to add self-identification options to client stats', error: error.message });
    }
}

// Function to update self-identification options for client stats
async function updateClientStatsSelfIdentification(req, res) {
    const { clientStatId } = req.params; // Assuming clientStatId is passed as a URL parameter
    const { selfIdentificationIds } = req.body; // Expect an array of self_identification_id

    try {
        await pool.query('BEGIN');

        // Step 1: Delete existing self-identification options for the client stats
        const deleteQueryText = 'DELETE FROM carecycle.clientstats_selfidentification WHERE cs_id = $1';
        await pool.query(deleteQueryText, [clientStatId]);

        // Step 2: Insert new self-identification options for the client stats
        const insertQueryText = 'INSERT INTO carecycle.clientstats_selfidentification (cs_id, self_identification_id) VALUES ($1, $2)';

        let addedOptionsInfo = [];
        for (let selfIdentificationId of selfIdentificationIds) {
            await pool.query(insertQueryText, [clientStatId, selfIdentificationId]);
            
            // Optionally fetch the self-identification option name for the added option
            const optionQueryText = 'SELECT option FROM ccarecycle.clientstats_selfidentification WHERE self_identification_id = $1';
            const result = await pool.query(optionQueryText, [selfIdentificationId]);
            if (result.rows.length > 0) {
                addedOptionsInfo.push({id: selfIdentificationId, option: result.rows[0].option});
            }
        }

        await pool.query('COMMIT');
        res.json({ message: 'Self-identification options updated successfully for client stats.', updatedOptions: addedOptionsInfo });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error updating self-identification options for client stats:', error);
        res.status(500).json({ message: 'Failed to update self-identification options for client stats', error: error.message });
    }
}


module.exports = {
    fetchSelfIdentificationOptions,
    addClientStatsSelfIdentification,
    updateClientStatsSelfIdentification
};