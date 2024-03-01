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

module.exports = {
    fetchGenderIdentities,
    addUserGenderIdentities,
};
