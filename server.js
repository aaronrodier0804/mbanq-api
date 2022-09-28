var fs = require('fs'),
  https = require('https'),
  express = require('express'),
  app = express();

const axios = require('axios');
const bodyParse = require('body-parser');
app.use(bodyParse.json());

https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
}, app).listen(8000);
console.log("Server Started at: https://127.0.0.1:8000");


app.post('/*', async function(req, res) {
  let url = getApiEndpoint(req.params['0'], req.body);

  try {
    let response = await axios.post(url, req.body, { headers: req.headers});
    res.end(JSON.stringify(response.data));

  } catch (e) {
    console.log('error', e);
  }
});

app.get('/*', async function(req, res) {
  try {
    let url = 'https://api.tokenizer-s.mbanq.cloud/' + req.originalUrl;
    let response = await axios.get(url, { headers: req.headers });

    res.end(JSON.stringify(response.data));
  } catch (e) {
    console.log('error', e);
  }
});

app.put('/*', async function(req, res) {

  try {
    let url = 'https://api.tokenizer-s.mbanq.cloud/' + req.originalUrl;

    let response = await axios.put(url, req.body, { headers: req.headers} );

    res.end(JSON.stringify(response.data));
  } catch (e) {
    console.log('error', e);
  }
});

app.delete('/*', async function(req, res) {
  try {
    let url = 'https://api.tokenizer-s.mbanq.cloud/' + req.originalUrl;
    let response = await axios.delete(url, { headers: req.headers });

    res.json(`Deleted Successfully`)
  } catch (e) {
    console.log('error', e);
  }
});

const getApiEndpoint = (baseUri, params) => {
  let url = 'https://api.tokenizer-s.mbanq.cloud/' + baseUri + '?';
  for (const [key, value] of Object.entries(params)) {
    url += key + '=' + value + '&';
  }

  return url.slice(0, -1);
}