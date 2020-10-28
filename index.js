import express from 'express';
import bodyparser from 'body-parser';
import mongoose from 'mongoose';
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

app.get('/', (req, res, next) => res.send('hi'));
app.use('/api', router);

const port = process.env.PORT || 8080;
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
