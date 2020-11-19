import mongoose from 'mongoose';
const Schema =  mongoose.Schema;

/**
 * defines request schema for mongodb
 */

const requestSchema = new Schema({
	book: {
		type: Schema.Types.ObjectId,
		ref: 'Book'
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	messages: [{
		type: Schema.Types.ObjectId,
		ref: 'Message'
	}
	],
	status: {
		type: String,
		required: true
	},
	archived: {
		type: Boolean,
		default: false
	}
});

const Request = mongoose.model('Request', requestSchema);

export default Request;
