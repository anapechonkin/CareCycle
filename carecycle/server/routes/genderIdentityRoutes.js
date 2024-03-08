const { pool } = require('../config/db');

// Function to fetch all gender identities
async function fetchGenderIdentities(req, res) {
    try {
        const result = await pool.query('SELECT gender_identity_id, type FROM carecycle.genderidentity');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching gender identities:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Function to add gender identities for a user
async function addUserGenderIdentities(req, res) {
    const { userId } = req.params;
    const { genderIdentityIds } = req.body; // Expect an array of gender_identity_id

    let addedIdentitiesInfo = [];
    try {
        await pool.query('BEGIN');

        for (let genderIdentityId of genderIdentityIds) {
            const exists = await pool.query('SELECT 1 FROM carecycle.users_genderidentity WHERE user_id = $1 AND gender_identity_id = $2', [userId, genderIdentityId]);

            if (exists.rowCount === 0) {
                await pool.query('INSERT INTO carecycle.users_genderidentity (user_id, gender_identity_id) VALUES ($1, $2)', [userId, genderIdentityId]);
                
                // Fetch the gender identity type for the added identity
                const result = await pool.query('SELECT type FROM carecycle.genderidentity WHERE gender_identity_id = $1', [genderIdentityId]);
                if (result.rows.length > 0) {
                    addedIdentitiesInfo.push({id: genderIdentityId, type: result.rows[0].type});
                }
            }
        }

        await pool.query('COMMIT');
        res.json({ message: 'Gender identities added successfully for user.', addedIdentities: addedIdentitiesInfo });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error adding user gender identities:', error);
        res.status(500).json({ message: 'Failed to add gender identities for user', error: error.message });
    }
}

// Function to add gender identities for a client stat
async function addClientStatGenderIdentities(req, res) {
    const { clientStatId } = req.params; // Assuming clientStatId is passed as a URL parameter
    const { genderIdentityIds } = req.body; // Expect an array of gender_identity_id

    let addedIdentitiesInfo = [];
    try {
        await pool.query('BEGIN');

        for (let genderIdentityId of genderIdentityIds) {
            const exists = await pool.query('SELECT 1 FROM carecycle.client_genderidentity WHERE cs_id = $1 AND gender_identity_id = $2', [clientStatId, genderIdentityId]);

            if (exists.rowCount === 0) {
                await pool.query('INSERT INTO carecycle.client_genderidentity (cs_id, gender_identity_id) VALUES ($1, $2)', [clientStatId, genderIdentityId]);
                
                // Fetch the gender identity type for the added identity
                const result = await pool.query('SELECT type FROM carecycle.genderidentity WHERE gender_identity_id = $1', [genderIdentityId]);
                if (result.rows.length > 0) {
                    addedIdentitiesInfo.push({id: genderIdentityId, type: result.rows[0].type});
                }
            }
        }

        await pool.query('COMMIT');
        res.json({ message: 'Gender identities added successfully for client stat.', addedIdentities: addedIdentitiesInfo });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error adding client stat gender identities:', error);
        res.status(500).json({ message: 'Failed to add gender identities for client stat', error: error.message });
    }
}

async function updateUserGenderIdentities(req, res) {
    const { userId } = req.params;
    const { genderIdentityIds } = req.body; // Expect an array of gender_identity_id

    try {
        await pool.query('BEGIN');

        // Step 1: Clear existing gender identities for the user
        await pool.query('DELETE FROM carecycle.users_genderidentity WHERE user_id = $1', [userId]);

        // Step 2: Add new gender identities for the user
        let addedIdentitiesInfo = [];
        for (let genderIdentityId of genderIdentityIds) {
            await pool.query('INSERT INTO carecycle.users_genderidentity (user_id, gender_identity_id) VALUES ($1, $2)', [userId, genderIdentityId]);
            
            // Optionally, fetch and include the added identity information in the response
            const result = await pool.query('SELECT type FROM carecycle.genderidentity WHERE gender_identity_id = $1', [genderIdentityId]);
            if (result.rows.length > 0) {
                addedIdentitiesInfo.push({id: genderIdentityId, type: result.rows[0].type});
            }
        }

        await pool.query('COMMIT');
        res.json({ message: 'User gender identities updated successfully.', addedIdentities: addedIdentitiesInfo });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error updating user gender identities:', error);
        res.status(500).json({ message: 'Failed to update gender identities for user', error: error.message });
    }
}

module.exports = {
    fetchGenderIdentities,
    addUserGenderIdentities,
    addClientStatGenderIdentities,
    updateUserGenderIdentities
};
