/**
 * Express middleware module providing request related db queries.
 * @module controllers/request
 * @requires mongoose
 * @requires jsonwebtoken
 * @requires models/request
 */
import mongoose from 'mongoose';
import Request from '../models/request.js';
import Book from '../models/book.js';
import Message from '../models/message.js';

//options for findbyidandupdate query
const options = {
	new: true,
	lean: true,
	omitUndefined: true
};
/**
 * Function to add new request to mongodb
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const addRequest = async (req, res) => {
	console.log('req.body', req.body);
	console.log('req.headers', req.headers);
	console.log('req.user.id', req.user.id);
	const bookId = req.body.bookId;
	const userId = req.user.id;
	let message;
	if(req.body.message) {
		message = new Message({
			userId,
			text: req.body.message
		});
		try {
			message.save();
		} catch (err) {
			res.status(500).send(err);
		}
	}
	//getbookinfo
	const request = new Request({
		bookId,
		userId,
		messages:[message],
		status: 'open'
	});
	try {
		request.save();
		const result = await Book.findByIdAndUpdate(bookId, { $push: {'requests': request} }, options);
		res.status(200).send({request, result});
	} catch(err) {
		console.log('err', err);
		res.status(500).send(err);
	}
};
/**
 * Function to add messages/reply
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const addMessage = async (req, res) => {
	console.log('req.body', req.body);
	console.log('req.headers', req.headers);
	console.log('req.user.id', req.user.id);
	if(req.body.message) {
		const message = new Message({
			text: req.body.message,
			userId: req.user.id
		});
		try {
			message.save();
			const result = await Request.findByIdAndUpdate(req.body.requestId, { $push: {'messages': message } }, options);
			res.status(200).send(result);
		} catch (err) {
			console.log('err', err);
			res.status(500).send({message: 'error saving message'});
		}
	} else {
		res.status(403).send({message: 'message cannot be empty.'});
	}
};