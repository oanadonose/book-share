import mongoose from 'mongoose';
import User from '../models/user.js';

const createFakeUsers = async () => {
	const user = new User({
		email: 'fake@fake.com',
		name: 'fake',
		password: 'fake'
	});

	await user.save();

	const userD = new User({
		email: 'fakedelete@fake.com',
		name: 'fakedelete',
		password: 'fake'
	});

	await userD.save();
};

(async () => {
	try {
		await mongoose.connect(process.env.testdbURL, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false });
	} catch (err) {
		console.log('DB connection error', err);
	}
})();

mongoose.connection.on('connected', async () => {
	console.log('connection established.');
	await mongoose.connection.db.dropDatabase();
	await createFakeUsers();
	await mongoose.connection.close();
	process.exit();
});

