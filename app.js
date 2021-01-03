import express from 'express';
import cors from 'cors';
import bodyparser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
import passportConfig from './helpers/passport.js';
import userRouter from './routes/userRouter.js';
import bookRouter from './routes/bookRouter.js';
import requestRouter from './routes/requestRouter.js';

const app = express();

app.use(cors());


(async () => {
	try {
		await mongoose.connect(process.env.testdbURL || process.env.dbURL, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false });
	} catch (err) {
		console.log('DB connection error', err);
	}
})();

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
passportConfig(passport);

app.get('/', (req, res) => res.send('hi'));
app.use('/api/users', userRouter);
app.use('/api/books', bookRouter);
app.use('/api/requests', requestRouter);

app.use(express.static('docs/openapi'));


export default app;
