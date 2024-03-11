const { pool } = require('../config/db');

//Fetch all map areas
async function fetchMapAreas(req, res) {
    try {
        const result = await pool.query('SELECT map_id, map_area_name FROM carecycle.maparea');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching map areas:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Function to add map areas for a user
async function addUserMapAreas(req, res) {
    const { userId } = req.params;
    const { mapAreaIds } = req.body; // Expect an array of map_id

    let addedAreasInfo = [];

    try {
        await pool.query('BEGIN');

        for (let mapAreaId of mapAreaIds) {
            // Check if the association already exists to prevent duplicates
            const exists = await pool.query('SELECT 1 FROM carecycle.users_maparea WHERE user_id = $1 AND map_id = $2', [userId, mapAreaId]);

            if (exists.rowCount === 0) {
                await pool.query('INSERT INTO carecycle.users_maparea (user_id, map_id) VALUES ($1, $2)', [userId, mapAreaId]);
                
                // Fetch the map area name for the added area
                const result = await pool.query('SELECT map_area_name FROM carecycle.maparea WHERE map_id = $1', [mapAreaId]);
                if (result.rows.length > 0) {
                    addedAreasInfo.push({id: mapAreaId, name: result.rows[0].map_area_name});
                }
            }
        }

        await pool.query('COMMIT');
        res.json({ message: 'Map areas added successfully for user.', addedAreas: addedAreasInfo });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error adding user map areas:', error);
        res.status(500).json({ message: 'Failed to add map areas for user', error: error.message });
    }
}

async function updateUserMapAreas(req, res) {
    const { userId } = req.params;
    const { mapAreaIds } = req.body; // Expect an array of map_id

    try {
        await pool.query('BEGIN');

        // Step 1: Clear existing map areas for the user
        await pool.query('DELETE FROM carecycle.users_maparea WHERE user_id = $1', [userId]);

        // Step 2: Add new map areas for the user
        let addedAreasInfo = [];
        for (let mapAreaId of mapAreaIds) {
            await pool.query('INSERT INTO carecycle.users_maparea (user_id, map_id) VALUES ($1, $2)', [userId, mapAreaId]);
            
            // Optionally, fetch and include the added area information in the response
            const result = await pool.query('SELECT map_area_name FROM carecycle.maparea WHERE map_id = $1', [mapAreaId]);
            if (result.rows.length > 0) {
                addedAreasInfo.push({id: mapAreaId, name: result.rows[0].map_area_name});
            }
        }

        await pool.query('COMMIT');
        res.json({ message: 'User map areas updated successfully.', addedAreas: addedAreasInfo });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error updating user map areas:', error);
        res.status(500).json({ message: 'Failed to update map areas for user', error: error.message });
    }
}

module.exports = {
    fetchMapAreas,
    addUserMapAreas,
    updateUserMapAreas
};