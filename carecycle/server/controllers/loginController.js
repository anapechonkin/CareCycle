const { pool } = require('../config/db'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 

// Environment variable for JWT secret
const jwtSecret = process.env.JWT_SECRET || '8c26e5e13bc5b663fb311f38ddae41c79af62f75b520d3189806f0631169c9f5';

const login = async (request, response) => {
    const { username, password } = request.body;

    try {
        const userQueryResult = await pool.query('SELECT * FROM carecycle.users WHERE username = $1', [username]);
        if (userQueryResult.rows.length > 0) {
            const user = userQueryResult.rows[0];
            const passwordMatch = await bcrypt.compare(password, user.password);
            
            if (passwordMatch) {
                const token = jwt.sign(
                    { userId: user.user_id, role: user.usertype_id }, // You can add more payload here
                    jwtSecret,
                    { expiresIn: '24h' } // Token expires in 24 hours
                );

                response.json({ token, userId: user.user_id, role: user.usertype_id }); // Send the token and any other info you need
            } else {
                response.status(401).json({ error: 'Invalid credentials' });
            }
        } else {
            // To prevent username enumeration, you may opt to use a generic error message here
            response.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        response.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { login };
