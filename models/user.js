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
	},
	role: {
		type: String,
		required: false,
		default: 'user'
	}
});

const user = mongoose.model('User', userSchema);

export default user;
