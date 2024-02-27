const { pool } = require('../config/db');

// Fetch postal code id
async function lookupPostalCode(req, res) {
    const { code } = req.params; // Extract code from route parameters
    try {
        const result = await pool.query('SELECT postal_code_id FROM carecycle.postalcode WHERE postal_code = $1', [code]);
        if (result.rows.length > 0) {
            res.json({ postal_code_id: result.rows[0].postal_code_id });
        } else {
            res.status(404).send('Postal code not found');
        }
    } catch (error) {
        console.error('Error looking up postal code:', error);
        res.status(500).send('Server error');
    }
}

module.exports = lookupPostalCode;
