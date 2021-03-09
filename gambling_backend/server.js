const express = require('express');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');

require('dotenv').config();
const app = express();

//BRINGING ROUTS
const auth = require('./routes/auth');
const money = require('./routes/money');
const user = require('./routes/user');
const matches = require('./routes/matches');

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET,
});

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());

app.use('/api', auth);
app.use('/api', money);
app.use('/api', user);
app.use('/api', matches);

const port = 8000;

app.listen(port, () => {
	console.log(`Server is running on localhost:${port}`);
});
