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
	try {
		if(req.body.message) {
			message = new Message({
				userId,
				text: req.body.message
			});
			message.save();
		}
		//getbookinfo
		const request = new Request({
			bookId,
			userId,
			messages:[message],
			status: 'open'
		});
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
	try {
		if(req.body.message) {
			const message = new Message({
				text: req.body.message,
				userId: req.user.id
			});
			message.save();
			const result = await Request.findByIdAndUpdate(req.body.requestId, { $push: {'messages': message } }, options);
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
		const request = await Request.findById(req.body.requestId).populate({ //TODO: change path to book in moswl
			path: 'bookId',
			options: { lean: true }
		}).lean().exec();
		console.log(request,'request');
		if(request.bookId.user == req.user.id || req.user.id == request.userId) {
			const result = await Request.findByIdAndUpdate(req.body.requestId, {'status': 'closed'}, {...options});
			res.status(200).send(result);
		} else {
			res.status(403).send({message: 'no permission to close request',
				'request.bookId.user':request.bookId.user, 'request.userId':request.userId, 'req.user.id':req.user.id });
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
	console.log('req.params.userid', req.params.userid)
	console.log('req.user.id', req.user.id);
	try {
		const requests = await Request.find({userId: req.user.id})
			.populate({
				path: 'messages',
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
					path: 'messages',
					model: 'Message'
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
