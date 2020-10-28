import mongoose from 'mongoose';
const Schema =  mongoose.Schema;

//Design User Schema

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
})

const user = mongoose.model('User', userSchema);

export default user;