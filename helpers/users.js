import mongoose from 'mongoose';
import User from '../models/user.js';

export const getUser = async(userId) => {
	try {
		const user = await User.findOne({'_id': mongoose.Types.ObjectId(userId)}).lean();
		return user;
	} catch(err) {
		return err;
	}
	//add owned books to returned user
};

export const getUserRole = async(userId) => {
	try {
		const user = await User.findOne({'_id': mongoose.Types.ObjectId(userId)})
			.select('role -_id').lean();
		return user;
	} catch(err) {
		return err;
	}
};
