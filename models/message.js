import mongoose from 'mongoose';
const Schema =  mongoose.Schema;

/**
 * defines message schema for mongodb
 */

const messageSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	text: {
		type: String,
		required: true
	},
	dateAdded:  {
		type: Date,
		default: Date.now
	}
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
