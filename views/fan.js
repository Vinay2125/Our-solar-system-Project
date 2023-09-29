const express = require('express');
const ejs = require('ejs');
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files (e.g., images, stylesheets)
app.use(express.static('public'));

app.get('/', (req, res) => {
  // Pass the planetData object to the EJS template
  res.render('mars.ejs', { planetData });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
