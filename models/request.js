import mongoose from 'mongoose';
const Schema =  mongoose.Schema;

/**
 * defines request schema for mongodb
 */

const requestSchema = new Schema({
	bookId: {
		type: Schema.Types.ObjectId,
		ref: 'Book'
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	message: {
		type: String,
		required: false
	},
	status: {
		type: String,
		required: true
	}
});

const Request = mongoose.model('Request', requestSchema);

export default Request;
