import mongoose from 'mongoose';
import User from '../models/user.js';
import Book from '../models/book.js';

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

const getUser = async () => {
	const userId = await User.findOne({email: 'fake@fake.com'}).select('_id');
	return userId;
};

const createFakeBooks = async (userid) => {
	const book = new Book({
		title: 'Fake Title',
		author: 'John Doe',
		ISBN: '11111111',
		genre: 'Fantasy',
		user: userid,
		status: 'available',
		photo: 'test.jpg'
	});
	await book.save();

	const book2 = new Book({
		title: 'Fake Title2',
		author: 'John Doe2',
		ISBN: '222222222',
		genre: 'Fantasy',
		user: userid,
		status: 'available',
		photo: 'test.jpg'
	});

	await book2.save();
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
	const userId =  (await getUser())._id;
	await createFakeBooks(userId);
	await mongoose.connection.close();
	process.exit();
});

