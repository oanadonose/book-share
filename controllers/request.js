/**
 * Express middleware module providing request related db queries.
 * @module controllers/request
 * @requires mongoose
 * @requires jsonwebtoken
 * @requires models/request
 */
import mongoose from 'mongoose';
import Request from '../models/request.js';
import { getBook } from '../helpers/database.js';

/**
 * Function to add new request to mongodb
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const addRequest = (req, res) => {
	console.log('req.body', req.body);
	console.log('req.headers', req.headers);
	const bookId = req.body.bookId;
	const userId = req.body.bookId;
	const message = req.body.message || '';
	//getbookinfo
	const book = getBook(bookId);
	console.log('book', book);
	if(book.user !== userId) {
		const request = new Request({
			bookId,
			userId,
			message,
			status: 'open'
		});
		try {
			request.save();
			res.status(200).send(request);
		} catch(err) {
			console.log('err', err);
			res.status(500).send(err);
		}
	}
	else {
		res.status(403).send({message: 'Cannot request owned books.'});
	}
};
