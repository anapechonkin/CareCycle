const express = require('express');
const app = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser')
const port = process.env.PORT || 5001;
const db = require('./routes/userRoutes.js');

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

app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', db.addUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)


app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })
