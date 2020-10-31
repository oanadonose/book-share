import express from 'express';
import bodyparser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
import passportConfig from './helpers/passport.js';
import router from './routes/router.js';

const app = express();


(async () => {
	try {
		await mongoose.connect(process.env.dbURL, { useUnifiedTopology: true, useNewUrlParser: true });
	} catch (err) {
		console.log('DB connection error', err);
	}
	console.log('db connected');
})();

app.use(bodyparser.urlencoded({ extended:false }));
app.use(bodyparser.json());
passportConfig(passport);

app.get('/', (req, res) => res.send('hi'));
app.use('/api', router);

const port = process.env.PORT || 8080;
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
