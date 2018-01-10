const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const db = require('../database');
const config = require('../client/src/config.js');

const path = require('path');
const axios = require('axios');
const yelp = require('yelp-fusion');

const data = require('../data.json');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

app.listen(3000);


app.get('/search/:searchInput', (req, res) => {
  console.log(`doing GET -> /search/${req.params.searchInput}`);

  const searchRequest = {
    term: req.params.searchInput,
    location: 'san francisco, ca',
  };
  const client = yelp.client(config.apiKey);

  client.search(searchRequest)
    .then((response) => {
      const topTen = response.jsonBody.businesses.slice(0, 10);
      // topTen.forEach((business) => {
      //   if (business.display_phone === '') {
      //     business.display_phone = 'No Phone Number';
      //   }
      // });
      topTen.forEach((business) => {
        console.log('got ', business.name);
      });
      res.status(200).json(topTen);
    })
    .catch((err) => {
      console.log('caught error', err);
    });
});

app.get('/3restaurants', (req, res) => {
  res.send(data.businesses);
});
