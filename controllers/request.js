/**
 * Express middleware module providing request related db queries.
 * @module controllers/request
 * @requires mongoose
 * @requires jsonwebtoken
 * @requires models/request
 */
import Request from '../models/request.js';
import Book from '../models/book.js';
import Message from '../models/message.js';

import mongoose from 'mongoose';
//options for findbyidandupdate query
const options = {
	new: true,
	lean: true,
	omitUndefined: true,
};

export const getRequest = async (req, res) => {
	console.log('req.body', req.body);
	console.log('req.headers', req.headers);
	console.log('req.user.id', req.user.id);
	const requestId = req.params.requestId;
	const userId = req.user.id;
	try {
		const request = await Request.findById(requestId)
			.populate({
				path: 'book user messages',
				populate: {
					path: 'user',
					model: 'User'
				},
				options: { lean: true }
			})
			.lean()
			.exec();
		console.log(request);
		res.status(200).send(request);
	} catch (err) {
		console.log('err', err);
		res.status(500).send(err);
	}
};
/**
 * Function to add new request to mongodb
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const addRequest = async (req, res) => {
	console.log('req.body.bookId', req.body.bookId);
	console.log('req.body', req.body);
	const book = req.body.bookId;
	const user = req.user.id;
	let message;
	try {
		if(req.body.message) {
			message = new Message({
				user,
				text: req.body.message
			});
			message.save();
		}
		//getbookinfo
		const request = new Request({
			book,
			user,
			messages:[message],
			status: 'open'
		});
		request.save();
		const result = await Book.findByIdAndUpdate(book, { $push: {'requests': request}, status: 'requested' }, options);
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
	try {
		if(req.body.message) {
			const message = new Message({
				text: req.body.message,
				user: req.user.id
			});
			message.save();
			const result = await Request.findByIdAndUpdate(req.body.requestId, { $push: {'messages': message } }, {...options, populate: {
				path: 'book user messages',
				populate: {
					path: 'user',
					model: 'User'
				},
				options: { lean: true }}}
			);
			res.status(200).send(result);
		} else {
			res.status(403).send({message: 'message cannot be empty.'});
		}
	} catch (err) {
		res.status(500).send({err});
	}
};
/**
 * Function to close request
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const closeRequest = async (req, res) => {
	console.log('req.body', req.body);
	console.log('req.user.id', req.user.id);
	try {
		const request = await Request.findById(req.body.requestId).populate({
			path: 'book',
			options: { lean: true }
		}).lean().exec();
		console.log(request,'request');
		if(request.book.user == req.user.id || req.user.id == request.user) {
			const result = await Request.findByIdAndUpdate(req.body.requestId, {'status': 'closed'}, {...options});
			const bookUpdate = await Book.findByIdAndUpdate(request.book._id, { 'status': 'available' }, {...options});
			res.status(200).send({result, bookUpdate});
		} else {
			res.status(403).send({message: 'no permission to close request',
				'request.bookId.user':request.book.user, 'request.userId':request.user, 'req.user.id':req.user.id });
		}
	} catch(err) {
		console.log('err', err);
		res.status(500).send({message: 'error closing request'});
	}
};
/**
 * Function to view requests MADE by user
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const getUserMadeRequests = async (req, res) => {
	console.log('req.body', req.body);
	console.log('req.params.userid', req.params.userid);
	console.log('req.user.id', req.user.id);
	try {
		const requests = await Request.find({user: req.user.id})
			.populate({
				path: 'book',
				options: { lean: true }
			})
			.lean().exec();
		console.log(requests);
		res.status(200).send(requests);
	} catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
};

/**
 * Function to view requests RECEIVED by user
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const getUserReceivedRequests = async (req, res) => {
	console.log('req.params.userid', req.params.userid);
	const requests = [];
	try {
		const books = await Book.find({user: req.params.userid})
			.populate({
				path: 'requests',
				populate: {
					path: 'user',
					model: 'User'
				},
				options: { lean: true }
			})
			.lean()
			.exec();
		for(let book of books) {
			if(book.requests.length) {
				book.requests.forEach(request => requests.push(request));
			}
		}
		res.status(200).send(requests);
	} catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
};
/**
 * Function to archive request
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const archiveRequest = async (req, res) => {
	const requestId = req.params.requestId;
	try {
		const request = await Request.findById(requestId).populate({
			path: 'book',
			options: { lean: true }
		}).lean().exec();
		if(request.book.user == req.user.id) {
			const updateRes = await Request.findByIdAndUpdate(requestId, {archived:true}, options);
			const bookUpdate = await Book.findByIdAndUpdate(request.book._id, { 'status': 'available' }, {...options});
			res.status(200).send({updateRes, bookUpdate});
		} else res.status(403).send('permission denied');
	} catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
};

export const getBookRequests = async (req, res) => {
	const bookId = req.params.bookid;
	console.log('bookId', bookId);
	try {
		const requests = await Request.find({'book': mongoose.Types.ObjectId(bookId)}).lean();
		console.log('requests', requests);
		res.status(200).send(requests);
	} catch (err) {
		console.log('err', err);
	}
};

