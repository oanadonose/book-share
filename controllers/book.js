import mongoose from 'mongoose';
import Book from '../models/book.js';

export const getBooks = async (req, res) => {
	try {
		const books = await Book.find({user: req.user.id});
		if(!books) {			
			return res.status(200).send('user has no books');
		}
		else {
			return res.status(200).send(books);
		}
	} catch (err) {
		return res.status(400).send(err);
	}
}

export const getBookById = async (req, res) => {
	try {
		const book = await Book.findOne({"_id": mongoose.Types.ObjectId(req.params.id)});
		if(!book) return res.status(404).send('no book found');
		else return res.status(200).send(book);
	} catch (err) {
		console.log('err', err)
		return res.status(400).send(err);
	}
}

export const addBook = async (req, res) => {
	const newBook = new Book({
		user: req.user.id,
		title: req.body.title,
		author: req.body.author,
		photo: req.body.photo,
		ISBN: req.body.isbn,
		genre: req.body.genre
	});
	try {
		await newBook.save();
		res.status(200).json(newBook);
	} catch (err) {
		console.log('err', err)
		res.status(400).send(err);
	}
}

export const removeBook = async (req, res) => {
	try {
		await Book.deleteOne({"_id": mongoose.Types.ObjectId(req.params.id)})
		res.status(200).send('deleted successfully');
	} catch (err) {
		console.log('err', err);
		return res.status(400).send(err);
	}
}