import mongoose from 'mongoose';
import User from '../models/user.js';
import Book from '../models/book.js';

export const getUser = async(userId) => {
	try {
		const user = await User.findOne({'_id': mongoose.Types.ObjectId(userId)}).lean();
		return user;
	} catch(err) {
		return err;
	}
	//add owned books to returned user
};

export const getBook = async(bookId) => {
	try {
		const book = await Book.findOne({'_id': mongoose.Types.ObjectId(bookId)}).lean();
		return book;
	} catch (err) {
		console.log('err', err);
		return err;
	}
};
