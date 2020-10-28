import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import {validateAuthInput} from '../validation/auth.js';

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
			errors.register = "Email already exists.";
			return res.status(400).send(errors);
		}
	} catch(err) {
		return res.status(400).send(errors);
	}
	
}