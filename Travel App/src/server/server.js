// Setup empty JS object to act as endpoint for all routes
projectData = {};
weatherData = {};

// Require Express to run server and routes
const express = require('express');
const app = express();

// Middleware
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());
app.use(express.static('dist'))

//home route uses index file from dist
app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})

// Setup Server
app.listen(3030, function () {
    console.log('Running on localhost:3030!')
})

// GET route that returns projectData
app.get('/all', (request, response)=> {
  response.send(projectData);
});

// POST route
app.post('/add', (req, res)=> {
  console.log(req.body)
  const d = req.body;
  projectData['lat'] = d.lat;
  projectData['long'] = d.long;
  projectData['countryCode'] = d.countryCode;
  projectData['countdown'] = d.countdown;

  console.log('projectData: ', projectData);
});

app.post('/weather', (req, res)=> {
  console.log(req.body)
  const d = req.body;
  weatherData['summary'] = d.summary;
  console.log('weatherData: ', weatherData);
});
