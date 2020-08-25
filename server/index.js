const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5050;
const router = require('./router');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, '../client/dist')));
app.use('/', router);

app.listen(port, () => console.log(`Listening at http://localhost:${port}`));