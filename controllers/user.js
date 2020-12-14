/**
 * Express middleware module providing user related db queries.
 * @module controllers/user
 * @requires mongoose
 * @requires jsonwebtoken
 * @requires bcrypt
 * @requires models/user
 */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import User from '../models/user.js';
import Book from '../models/book.js';
import owns from '../helpers/rights.js';

/**
 * Function to register new details in mongodb
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const register = async (req, res) => {
	try{
		const user = await User.findOne({email: req.body.email});
		if(!user) {
			//encrypt
			const hashedPassword = await bcrypt.hash(req.body.password, 10);
			const newUser = new User({
				name: req.body.name,
				email: req.body.email,
				password: hashedPassword,
				address: req.body.address
			});
			await newUser.save();
			return res.status(200).send(newUser);
		}
		else {
			return res.status(403).send('email must be unique');
		}
	} catch(err) {
		return res.status(400).send(err);
	}
};

/**
 * Function to handle login
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const login = async (req, res) => {
	//const { errors, isValid } = validateAuthInput(req.body);
	//if(!isValid) {
	//	return res.status(401).send(errors);
	//}
	const errors = {};

	const email = req.body.email;
	const password = req.body.password;

	try {
		const user = await User.findOne({email});
		if(!user) {
			errors.email = 'User not found';
			return res.status(404).send(errors);
		}
		const match = await bcrypt.compare(password, user.password);
		if(match) {
			const payload = {id: user.id, name: user.name};
			jsonwebtoken.sign(payload, process.env.secretOrKey, (err, token) => {
				res.json({
					success: true,
					token: 'Bearer ' + token,
					userid: user.id
				});
			});
		}
		else {
			errors.password = 'Incorrect password';
			return res.status(401).send(errors);
		}
	} catch (err) {
		console.log('err', err);
		return res.status(400).send(err);
	}
};

/**
 * Function to handle logout
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const logout = async (req, res) => {
	if(req.user) {
		req.logout();
		return res.status(200).send('ok');
	}
	else {
		return res.status(401).send('no users logged in');
	}
};

/**
 * Function to return user record from mongodb
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const getUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if(!user) return res.status(404).send('User not found');
		return res.status(200).send(user);
	} catch (err) {
		console.log('err in getUser', err);
		return res.status(500).send(err);
	}
};
/**
 * Function to fetch all of a user's books from mongodb
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const getUserBooks = async (req, res) => {
	let books = [];
	console.log('req.params', req.params.id);
	try {
		books = await Book.find({ user: req.params.id }).lean();
		return res.status(200).send(books);
	} catch (err) {
		return res.status(400).send(err);
	}
};

/**
 * Function to update user record in mongodb
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const updateUser = async (req, res) => {
	const updates = {};

	if(req.body.name) {
		updates.name = req.body.name;
	}
	if(req.body.email) {
		updates.email = req.body.email;
	}
	if(req.body.password) {
		updates.password = req.body.password;
	}
	if(req.body.address) {
		updates.address = req.body.address;
	}
	try {
		const oldUser = await User.findById(req.params.id);
		if(!oldUser) return res.status(404).send('User not found');
		if(!owns(req.user.id, req.params.id)) return res.status(403).send(`${req.user.name} does not have permission to update ${req.params.id}`);
		const newUser = await User.findByIdAndUpdate({'_id': mongoose.Types.ObjectId(req.params.id)}, updates, { new: true });
		return res.status(200).send(newUser);
	} catch (err) {
		console.log('err in updateUser', err);
		return res.status(400).send(err);
	}
};

/**
 * Function to delete user record from mongodb
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const deleteUser = async (req, res) => {
	try {
		const user = await User.findOne({'_id': mongoose.Types.ObjectId(req.params.id)});
		if(!user) return res.status(404).send('User not found');
		if(!owns(req.user.id, req.params.id)) return res.status(403).send(`${req.user.name} does not have permission to update ${req.params.id}`);
		await User.findByIdAndDelete({'_id': mongoose.Types.ObjectId(req.params.id)});
		return res.status(200).send('deleted successfully');
	} catch (err) {
		console.log('err in deleteUser', err);
		return res.status(500).send(err);
	}
};
