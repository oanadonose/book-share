/**
 * Express middleware module providing book related db queries.
 * @module controllers/book
 * @requires mongoose
 * @requires jsonwebtoken
 * @requires bcrypt
 * @requires models/book
 */
import mongoose from 'mongoose';
import Book from '../models/book.js';
import fs from 'fs';
import path from 'path';

import {owns} from '../helpers/rights.js';

const escapeRegex = (text) => {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

/**
 * Function to fetch all books from mongodb
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const getBooks = async (req, res) => {
	let books = [];
	try {
		if(req.query && req.query.search) {
			const searchQ = req.query.search;
			const regex = new RegExp(escapeRegex(searchQ), 'gi');
			console.log('searchQ', searchQ);
			books = await Book.find()
				.or([{ 'author': regex }, { 'title': regex }, { 'genre': regex }, { 'ISBN': regex }])
				.lean();
		}
		else {
			books = await Book.find().lean();
		}

		return res.status(200).send(books);
	} catch (err) {
		return res.status(400).send(err);
	}
};


/**
 * Function to return book record by id from mongodb
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const getBookById = async (req, res) => {
	try {
		const book = await Book.findOne({'_id': mongoose.Types.ObjectId(req.params.id)})
			.populate('user','_id name').lean();
		if(!book) return res.status(404).send('no book found');
		else {
			const links = {
				user: `http://${req.hostname}:${process.env.PORT}/api/users/${book.user}`,
			};
			book.links = links;
			return res.status(200).send(book);
		}
	} catch (err) {
		console.log('err', err);
		return res.status(400).send(err);
	}
};

/**
 * Function to add new book record to mongodb
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const addBook = async (req, res) => {
	//const readerStream = fs.createReadStream(req.files[0].path);
	//console.log('readerStream', readerStream);
	console.log('req.body', req.body);
	console.log('req.headers', req.headers);
	let fileName='placeholder';
	let fileType='image/png';
	if(req.file) {
		console.log('req.file', req.file);
		fileName = req.file.filename;
		fileType = req.file.mimetype;
		console.log('fileName', fileName);
		console.log('fileType', fileType);
	}
	const __dirname = path.resolve();
	console.log('__dirname', __dirname);

	const newBook = new Book({
		user: req.user.id,
		title: req.body.title,
		author: req.body.author,
		photo: {
			data: fs.readFileSync(path.join(__dirname + '/uploads/' + fileName)),
			contentType: fileType
		},
		ISBN: req.body.isbn || '',
		genre: req.body.genre
	});
	try {
		await newBook.save();
		res.status(200).json(newBook);
	} catch (err) {
		console.log('err', err);
		res.status(400).json(err);
	}
};

/**
 * Function to remove book record by id from mongodb
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const removeBook = async (req, res) => {
	try {
		const book = await Book.findOne({'_id': mongoose.Types.ObjectId(req.params.id)});
		if(!book) return res.status(404).send({success: false, message: 'no book found'});
		if(!owns(req.user.id, book.user)) {
			return res.status(403).send({sucess: false, message: `${req.user.id}//${req.user.name} does not own ${book.title}//${book.id}`});
		}
		await Book.deleteOne({'_id': mongoose.Types.ObjectId(req.params.id)});
		res.status(200).send({success: true});
	} catch (err) {
		console.log('err', err);
		return res.status(400).send({message: err, success: false});
	}
};

/**
 * Function to update book record by id from mongodb
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 */
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
	if(req.file) {
		updates.photo = {
			data: '',
			contentType: ''
		};
		let fileName='placeholder';
		let fileType='image/png';
		if(req.file) {
			fileName = req.file.filename;
			fileType = req.file.mimetype;
		}
		const __dirname = path.resolve();
		updates.photo.data = fs.readFileSync(path.join(__dirname + '/uploads/' + fileName));
		updates.photo.contentType = fileType;
	}
	console.log('updates', updates);

	try {
		const book = await Book.findOne({'_id': mongoose.Types.ObjectId(req.params.id)});
		if(!owns(req.user.id, book.user)) {
			return res.status(403).send({sucess: false, message: `${req.user.id}//${req.user.name} does not own ${book.title}//${book.id}`});
		}
		await Book.findByIdAndUpdate({'_id': mongoose.Types.ObjectId(req.params.id)}, updates);
		return res.status(200).send(updates);
	} catch (err) {
		return res.status(400).send(err);
	}
};
