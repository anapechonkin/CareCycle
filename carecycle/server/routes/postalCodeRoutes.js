const { pool } = require('../config/db');

// Helper function to determine area_id based on postal code
const determineAreaId = (postalCode) => {
    // Example logic, adjust according to your actual area categorization
    if (postalCode.startsWith('H3N')) return 2; // Parc-X
    if (['H2P', 'H2R', 'H2E'].some(prefix => postalCode.startsWith(prefix))) return 3; // Villeray
    if (!postalCode.startsWith('H')) return 5; // Outside Montreal
    return 6; // Undefined or Rest of Montreal, adjust as necessary
};

//Check if Postal Code is in DB
async function lookupPostalCode(req, res) {
    const { code } = req.params;
    const formattedCode = code.toUpperCase().replace(/\s+/g, ''); // Format the input for consistency

    try {
        const result = await pool.query('SELECT postal_code_id FROM carecycle.postalcode WHERE postal_code = $1', [formattedCode]);
        
        if (result.rows.length > 0) {
            // If the postal code is found, return its ID
            res.json({ postal_code_id: result.rows[0].postal_code_id });
        } else {
            // If not found, respond indicating that the postal code does not exist
            res.status(404).send('Postal code not found');
        }
    } catch (error) {
        console.error('Error looking up postal code:', error);
        res.status(500).send('Server error during postal code lookup');
    }
}

//If not is DB, add Postal Code
async function addPostalCode(req, res) {
    const { postalCode } = req.body; 
    const formattedPostalCode = postalCode.toUpperCase().replace(/\s+/g, ''); // Format the input for consistency
    const areaId = determineAreaId(formattedPostalCode); // Determine the area ID based on the postal code

    try {
        const result = await pool.query(
            'INSERT INTO carecycle.postalcode (postal_code, area_id) VALUES ($1, $2) RETURNING postal_code_id', 
            [formattedPostalCode, areaId]
        );
        if (result.rows.length > 0) {
            res.json({ postal_code_id: result.rows[0].postal_code_id });
        } else {
            res.status(500).send('Failed to add new postal code');
        }
    } catch (error) {
        console.error('Error adding new postal code:', error);
        res.status(500).send('Server error during postal code addition');
    }
}

// Function to fetch all areas
async function getAreas(req, res) {
    try {
        const result = await pool.query('SELECT area_id, area_name FROM carecycle.area');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching areas:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = { 
    lookupPostalCode,
    addPostalCode,
    getAreas
 };
