var path = require('path')
const express = require('express')
const mockAPIResponse = require('./mockAPI.js')
const app = express()

const dotenv = require('dotenv');
dotenv.config();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const cors = require('cors')
app.use(cors())
app.use(express.static('dist'))

var AYLIENTextAPI = require('aylien_textapi');
var textapi = new AYLIENTextAPI({
  application_id: process.env.API_ID,
  application_key: process.env.API_KEY
});

console.log(__dirname)

app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})

// designates what port the app will listen to for incoming requests
app.listen(8081, function () {
    console.log('Example app listening on port 8081!')
})

app.get('/test', function (req, res) {
    res.json(mockAPIResponse)
})

app.post('/save', function (req, res) {
  console.log("Printing body of request:")
  const parseUrl= req.body.url

  textapi.sentiment({
    url: parseUrl
  }, function(error, response) {
    if (error === null) {
      console.log(response)
      res.json({
        message: response.polarity,
        message1: response.polarity_confidence
      })
    }else{
      const failedText = "Could not classify this news article."
      console.log("error")
      res.json({
        message: failedText
      })
    }
  })
})
