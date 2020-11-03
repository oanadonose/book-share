import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import User from '../models/user.js';
import {validateAuthInput} from '../helpers/validation/auth.js';
import owns from '../helpers/rights.js';

export const register = async (req, res) => {
	const { errors, isValid } = validateAuthInput(req.body);
	if(!isValid) {
		return res.status(400).send(errors);
	}
	try{
		const user = await User.findOne({email: req.body.email});
		if(!user) {
			//encrypt
			const hashedPassword = await bcrypt.hash(req.body.password, 10);
			const newUser = new User({
				name: req.body.name,
				email: req.body.email,
				password: hashedPassword
			});
			await newUser.save();
			return res.status(200).send(newUser);
		}
		else {
			errors.register = 'Email already exists.';
			return res.status(400).send(errors);
		}
	} catch(err) {
		return res.status(400).send(errors);
	}
};

export const login = async (req, res) => {
	const { errors, isValid } = validateAuthInput(req.body);
	if(!isValid) {
		return res.status(400).send(errors);
	}

	const email = req.body.email;
	const password = req.body.password;

	try {
		const user = await User.findOne({email});
		if(!user) {
			errors.email = 'User not found';
			return res.status(400).send(errors);
		}
		const match = await bcrypt.compare(password, user.password);
		if(match) {
			const payload = {id: user.id, name: user.name};
			jsonwebtoken.sign(payload, process.env.secretOrKey, {expiresIn: 36000}, (err, token) => {
				res.json({
					success: true,
					message: 'Login success',
					token: 'Bearer ' + token
				});
			});
		}
		else {
			errors.password = 'Incorrect password';
			return res.status(401).json(errors);
		}
	} catch (err) {
		console.log('err', err);
		return res.status(400).send(err);
	}
};

export const logout = async (req, res) => {
	if(req.user) {
		try {
			await req.logout();
			req.user = null;
		} catch(err) {
			console.log('err in logout', err);
		}
		return res.status(200).send('logout success');
	}
	else {
		return res.status(401).send('no users logged in');
	}
};

export const getUser = async (req, res) => {
	try {
		const user = await User.findOne({_id: req.params.id});
		return res.status(200).send(user);
	} catch (err) {
		console.log('err in getUser', err);
		return res.status(500).send(err);
	}
};

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
		if(!owns(req.user.id, req.params.id)) return res.status(403).send(`${req.user.name} does not have permission to update ${req.params.id}`);
		await User.findByIdAndUpdate({_id: req.params.id}, updates);
		return res.status(200).send('updated successfully');
	} catch (err) {
		console.log('err in updateUser', err);
		return res.status(500).send(err);
	}
};

export const deleteUser = async (req, res) => {
	try {
		if(!owns(req.user.id, req.params.id)) return res.status(403).send(`${req.user.name} does not have permission to update ${req.params.id}`);
		await User.findByIdAndDelete({_id: req.params.id});
		return res.status(200).send('deleted successfully');
	} catch (err) {
		console.log('err in deleteUser', err);
		return res.status(500).send(err);
	}
};
