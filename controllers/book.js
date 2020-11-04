import mongoose from 'mongoose';
import Book from '../models/book.js';
import owns from '../helpers/rights.js';

//get all available books
export const getBooks = async (req, res) => {
	let books = [];
	try {
		books = await Book.find();
		return res.status(200).send(books);
	} catch (err) {
		return res.status(400).send(err);
	}
};

export const getBookById = async (req, res) => {
	try {
		const book = await Book.findOne({'_id': mongoose.Types.ObjectId(req.params.id)});
		if(!book) return res.status(404).send('no book found');
		else return res.status(200).send(book);
	} catch (err) {
		console.log('err', err);
		return res.status(400).send(err);
	}
};

export const addBook = async (req, res) => {
	const newBook = new Book({
		user: req.user.id,
		title: req.body.title,
		author: req.body.author,
		photo: req.body.photo,
		ISBN: req.body.isbn || '111111',
		genre: req.body.genre
	});
	try {
		await newBook.save();
		res.status(200).json(newBook);
	} catch (err) {
		console.log('err', err);
		res.status(400).send(err);
	}
};

export const removeBook = async (req, res) => {
	try {
		const book = await Book.findOne({'_id': mongoose.Types.ObjectId(req.params.id)});
		if(!book) return res.status(404).send('no book found');
		if(!owns(req.user.id, book.user)) {
			return res.status(403).send(`${req.user.id}//${req.user.name} does not own ${book.title}//${book.id}`)
		}
		await Book.deleteOne({'_id': mongoose.Types.ObjectId(req.params.id)});
		res.status(200).send('deleted successfully');
	} catch (err) {
		console.log('err', err);
		return res.status(400).send(err);
	}
};

export const updateBook = async (req, res) => {

	//create updates object for mongoose query
	const updates = {};
	if(req.body.title) {
		updates.title = req.body.title;
	}
	if(req.body.author) {
		updates.author = req.body.author;
	}
	if(req.body.isbn) {
		updates.ISBN = req.body.isbn;
	}
	if(req.body.genre) {
		updates.genre = req.body.genre;
	}
	if(req.body.photo) {
		updates.photo = req.body.photo;
	}

	try {
		const book = await Book.findOne({'_id': mongoose.Types.ObjectId(req.params.id)});
		if(!owns(req.user.id, book.user)) {
			return res.status(403).send(`${req.user.id}//${req.user.name} does not own ${book.title}//${book.id}`)
		}
		await Book.findByIdAndUpdate({'_id': mongoose.Types.ObjectId(req.params.id)}, updates);
		return res.status(200).send('updated successfully', updates);
	} catch (err) {
		return res.status(400).send(err);
	}
};