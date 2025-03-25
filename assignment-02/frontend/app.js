const express = require('express');
const { Client } = require('pg');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const client = new Client({
  user: process.env.DATABASE_USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.DATABASE_PASSWORD,
  port: 5432,
});

client.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/view-data', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'view-data.html'));
});

app.get('/get-data', (req, res) => {
  client.query('SELECT name, age FROM users', (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching data');
    } else {
      res.json(result.rows); 
    }
  });
});


app.post('/add-data', (req, res) => {
  const { name, age } = req.body;
  const query = 'INSERT INTO users (name, age) VALUES ($1, $2)';
  
  client.query(query, [name, age], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error inserting data');
    } else {
      res.redirect('/view-data'); // Redirect to view data after insertion
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
