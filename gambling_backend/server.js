const express = require('express');
const cors = require('cors');

const app = express();

//BRINGING ROUTS
const auth = require('./routes/auth');
const money = require('./routes/money');

app.use(cors());
app.use(express.json());

app.use('/api', auth);
app.use('/api', money);

app.listen(8000, () => {
	console.log('Server is running on 8000');
});
