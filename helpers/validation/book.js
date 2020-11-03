import jsonschema from 'jsonschema';
import schema from '../../schemas/book.schema.js';
const v = new jsonschema.Validator();


export const validateBook = async (req, res, next) => {
	const validationOpts = {
		throwError: true,
		allowUnknownAttributes: false
	};

	const body = req.body;

	try {
		v.validate(body, schema, validationOpts);
		await next();
	} catch (err) {
		if(err instanceof jsonschema.ValidationError) {
			res.status(400).send(err);
		} else {
			throw err;
		}
	}
};
