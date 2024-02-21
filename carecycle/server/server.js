const express = require('express');
const app = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser')
const port = process.env.PORT || 5001;
const userDB = require('./routes/userRoutes.js');
const clientStatDB = require('./routes/clientStatRoutes.js');

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

// User routes
app.get('/users', userDB.getUsers);
app.get('/users/:id', userDB.getUserById);
app.get('/users/username/:username', userDB.getUserByUsername); // Modified route pattern
app.post('/users', userDB.addUser);
app.put('/users/:id', userDB.updateUser);
app.delete('/users/:id', userDB.softDeleteUserById); // Renamed to softDeleteUserById
app.delete('/users/username/:username', userDB.softDeleteUserByUsername); // Modified route pattern


// ClientStat routes
app.get('/clientstats', clientStatDB.getClientStats)
app.get('/clientstats/:id', clientStatDB.getClientStatById)
app.post('/clientstats', clientStatDB.addClientStat)
app.put('/clientstats/:id', clientStatDB.updateClientStat)


app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })
