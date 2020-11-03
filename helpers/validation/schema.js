import jsonschema from 'jsonschema';
import bookSchema from '../../schemas/book.schema.js';
import userSchema from '../../schemas/user.schema.js';

const v = new jsonschema.Validator();

export const validateBook = async (req, res, next) => {
	const validationOpts = {
		throwError: true,
		allowUnknownAttributes: false
	};

	const body = req.body;

	try {
		v.validate(body, bookSchema, validationOpts);
		await next();
	} catch (err) {
		if(err instanceof jsonschema.ValidationError) {
			res.status(400).send(err);
		} else {
			throw err;
		}
	}
};

export const validateUser = async (req, res, next) => {
	const validationOpts = {
		throwError: true,
		allowUnknownAttributes: false
	};

	const body = req.body;

	try {
		v.validate(body, userSchema, validationOpts);
		await next();
	} catch (err) {
		if(err instanceof jsonschema.ValidationError) {
			res.status(400).send(err);
		} else {
			throw err;
		}
	}
};
