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
app.get('/users', userDB.getUsers)
app.get('/users/:id', userDB.getUserById)
app.post('/users', userDB.addUser)
app.put('/users/:id', userDB.updateUser)
app.delete('/users/:id', userDB.deleteUser)

// ClientStat routes
app.get('/clientstats', clientStatDB.getClientStats)
app.get('/clientstats/:id', clientStatDB.getClientStatById)
app.post('/clientstats', clientStatDB.addClientStat)
app.put('/clientstats/:id', clientStatDB.updateClientStat)

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })
