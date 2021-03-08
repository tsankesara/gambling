const express = require('express');
const cors = require('cors');

const app = express();

//BRINGING ROUTS
const auth = require('./routes/auth');
const money = require('./routes/money');
const user = require('./routes/user');
const matches = require('./routes/matches');

app.use(cors());
app.use(express.json());

app.use('/api', auth);
app.use('/api', money);
app.use('/api', user);
app.use('/api', matches);

const port = 8000;

app.listen(port, () => {
	console.log(`Server is running on localhost:${port}`);
});
