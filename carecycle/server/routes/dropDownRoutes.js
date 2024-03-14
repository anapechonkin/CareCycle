const { pool } = require('../config/db');

// Fetch primary gender identities
const getPrimaryGenderIdentities = async (req, res) => {
    try {
        const genderIdentities = await pool.query('SELECT * FROM carecycle.primarygender'); 
        res.json(genderIdentities.rows);
    } catch (error) {
        console.error('Error fetching gender identities:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Fetch map regions
const getMapRegions = async (req, res) => {
    try {
        const mapRegions = await pool.query('SELECT * FROM carecycle.maparea'); 
        res.json(mapRegions.rows);
    } catch (error) {
        console.error('Error fetching map regions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Fetch user types
const getUserTypes = async (req, res) => {
    try {
        const userTypes = await pool.query('SELECT * FROM carecycle.usertype'); 
        res.json(userTypes.rows);
    } catch (error) {
        console.error('Error fetching user types:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Fetch workshops
const getWorkshops = async (req, res) => {
    try {
        const workshops = await pool.query('SELECT * FROM carecycle.workshop'); 
        res.json(workshops.rows);
    } catch (error) {
        console.error('Error fetching workshops:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Fetch newcomer status
const getNewcomerStatus = async (req, res) => {
    try {
        const newcomerStatus = await pool.query('SELECT * FROM carecycle.newcomerstatus');
        res.json(newcomerStatus.rows);
    } catch (error) {
        console.error('Error fetching newcomer statuses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getPrimaryGenderIdentities,
    getMapRegions,
    getUserTypes,
    getWorkshops,
    getNewcomerStatus
};
