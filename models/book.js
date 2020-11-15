import mongoose from 'mongoose';
const Schema =  mongoose.Schema;

/**
 * defines book schema for mongodb
 */

const bookSchema = new Schema({
	user:{
		type: Schema.Types.ObjectId,
		ref: 'users'
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
	}
});

const book = mongoose.model('Book', bookSchema);

export default book;
