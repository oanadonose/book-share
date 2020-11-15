import mongoose from 'mongoose';
const Schema =  mongoose.Schema;

/**
 * defines book schema for mongodb
 */

const bookSchema = new Schema({
	user:{
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	title:{
		type: String,
		required: true
	},
	author:{
		type: String,
		required: true
	},
	ISBN:{
		type: String,
		required: false
	},
	photo: {
		data: Buffer,
		contentType: String
	},
	genre: {
		type: String,
		required: false
	},
	requests: [{
		type: Schema.Types.ObjectId,
		ref: 'Request'
	}
	]
});

const Book = mongoose.model('Book', bookSchema);

export default Book;
