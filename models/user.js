import mongoose from 'mongoose';
const Schema =  mongoose.Schema;

/**
 * defines user schema for mongodb
 */

const userSchema = new Schema({
	name:{
		type: String,
		required: false
	},
	email:{
		type: String,
		required: true
	},
	password:{
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	},
	address: {
		type: String,
		required: false
	}
});

const User = mongoose.model('User', userSchema);

export default User;
