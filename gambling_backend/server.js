const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET,
});
require('dotenv').config();
const app = express();

//BRINGING ROUTS
const auth = require('./routes/auth');
const money = require('./routes/money');
const user = require('./routes/user');
const matches = require('./routes/matches');
const cpanel = require('./routes/cpanel');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());

app.use('/api', auth);
app.use('/api', money);
app.use('/api', user);
app.use('/api', matches);
app.use('/api/cpanel', cpanel);

const port = 8000;

app.listen(port, () => {
	console.log(`Server is running on localhost:${port}`);
});
