const express = require('express');
const app = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser')
const port = process.env.PORT || 5001;
const userDB = require('./routes/userRoutes.js');
const clientStatDB = require('./routes/clientStatRoutes.js');
const dropDownDB = require('./routes/dropDownRoutes.js');
const findPostalCode = require('./routes/postalCodeRoutes.js');
const genderIdentityRoutes = require('./routes/genderIdentityRoutes.js');
const mapAreaRoutes = require('./routes/mapAreaRoutes.js');
const selfIdRoutes = require('./routes/selfIdRoutes.js');
const loginRoute = require('./controllers/loginController.js');

dotenv.config();

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
  })

// Login Route
app.post('/login', loginRoute.login);  

// Self-Identification Routes
app.get('/self-id', selfIdRoutes.fetchSelfIdentificationOptions);
app.post('/clientstats/:clientStatId/self-id', selfIdRoutes.addClientStatsSelfIdentification);
app.put('/clientstats/:clientStatId/self-id', selfIdRoutes.updateClientStatsSelfIdentification);


// Map Area Routes
app.get('/map-areas', mapAreaRoutes.fetchMapAreas);  
app.post('/users/:userId/map-areas', mapAreaRoutes.addUserMapAreas);
app.post('/clientstats/:clientStatId/map-areas', mapAreaRoutes.addClientStatsMapAreas);
app.put('/users/:userId/map-areas', mapAreaRoutes.updateUserMapAreas);  

//Gender Identity Routes
app.post('/users/:userId/gender-identities', genderIdentityRoutes.addUserGenderIdentities);  
app.post('/clientstats/:clientStatId/gender-identities', genderIdentityRoutes.addClientStatGenderIdentities);
app.get ('/gender-identities', genderIdentityRoutes.fetchGenderIdentities);
app.put('/users/:userId/gender-identities', genderIdentityRoutes.updateUserGenderIdentities);

// Postal code routes
app.get('/postal-codes/lookup/:code', findPostalCode.lookupPostalCode);
app.post('/postal-codes/add', findPostalCode.addPostalCode);
app.get('/postal-codes/areas', findPostalCode.getAreas);

// Dropdown routes
app.get('/dropdowns/primaryGender', dropDownDB.getPrimaryGenderIdentities);
app.get('/dropdowns/mapRegions', dropDownDB.getMapRegions);
app.get('/dropdowns/userTypes', dropDownDB.getUserTypes);
app.get('/dropdowns/workshops', dropDownDB.getWorkshops);
app.get('/dropdowns/newcomerStatus', dropDownDB.getNewcomerStatus);
app.get('/dropdowns/preferredLanguage', dropDownDB.getPreferredLanguage);

// User routes
app.get('/users', userDB.getUsers);
app.get('/users/:id', userDB.getUserById);
app.get('/users/username/:username', userDB.getUserByUsername); 
app.post('/users', userDB.addUser);
app.put('/users/:id', userDB.updateUser);
app.delete('/users/:id', userDB.softDeleteUserById); // softDeleteUserById
app.delete('/users/username/:username', userDB.softDeleteUserByUsername); //softdelete by username
app.delete('/users/hard/:id', userDB.deleteUserById); // Hard delete by ID
app.delete('/users/hard/username/:username', userDB.deleteUserByUsername); // Hard delete by username
//app.delete('/users/hard', userDB.deleteAllUsers); // Hard delete all users

// ClientStat routes
app.get('/clientstats', clientStatDB.getClientStats)
app.get('/clientstats/:id', clientStatDB.getClientStatById)
app.get('/clientstats/postalcodeid/:postalCodeId', clientStatDB.getClientByPostalCodeId);
app.get('/clientstats/yob/:yearOfBirth', clientStatDB.getClientStatsByYOB);
app.post('/clientstats', clientStatDB.addClientStat)
app.put('/clientstats/:id', clientStatDB.updateClientStat)
app.delete('/clientstats/:cs_id', clientStatDB.deleteClientStatById);

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })
