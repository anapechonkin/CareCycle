const pool = require('../config/db');


const getUsers = (request, response) => {
    pool.query('SELECT * FROM carecycle.users', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

const getUserById = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('SELECT * FROM carecycle.users WHERE user_id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

const addUser = (request, response) => {
    // Adjust the values below based on table `Users` table structure
    const { username, password, firstName, lastName, primaryGender, vegetable, yearOfBirth, postalCodeId, isActive, userTypeID, mapID } = request.body;

    const query = `
        INSERT INTO carecycle.users 
        (username, password, first_name, last_name, primary_gender, vegetable, year_of_birth, postal_code_id, is_active, usertype_id, map_id) 
        VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *;`; // This line ensures that the inserted record is returned in the response

    const values = [username, password, firstName, lastName, primaryGender, vegetable, yearOfBirth, postalCodeId, isActive, userTypeID, mapID];

    pool.query(query, values, (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).json(results.rows[0]);
    });
};

module.exports = {
  getUsers,
  getUserById,
  addUser
}