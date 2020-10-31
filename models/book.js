import mongoose from 'mongoose';
const Schema =  mongoose.Schema;

//Book Schema

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
		type: String,
		default: 'https://elyssarpress.com/wp-content/uploads/2019/12/book-cover-placeholder.png'
	},
	genre: {
		type: String,
		required: false
	}
})

const book = mongoose.model('Book', bookSchema);

export default book;