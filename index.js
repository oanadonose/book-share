import express from 'express';
import cors from 'cors';
import bodyparser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
import passportConfig from './helpers/passport.js';
import userRouter from './routes/userRouter.js';
import bookRouter from './routes/bookRouter.js';


const app = express();

app.use(cors());


(async () => {
	try {
		await mongoose.connect(process.env.dbURL, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false });
	} catch (err) {
		console.log('DB connection error', err);
	}
	console.log('db connected');
})();

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
passportConfig(passport);



app.get('/', (req, res) => res.send('hi'));
app.use('/api/users', userRouter);
app.use('/api/books', bookRouter);

app.use(express.static('docs/openapi'));

const port = process.env.PORT || 8080;
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
