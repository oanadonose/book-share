/**
 * A module to run JSON Schema based validation on request/response data.
 * @module helpers/validation/schema
 * @see /docs/openapi/schemas for JSON schema definition files
 */

import jsonschema from 'jsonschema';
import {bookSchema, userSchema} from '../../docs/openapi/schemas/schemas.schema.js';

const v = new jsonschema.Validator();

/**
 * Express Middleware function to do validation for books
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 * @throws {ValidationError} a jsonschema library validation error
 */
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

/**
 * Express Middleware function to do validation for users
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 * @throws {ValidationError} a jsonschema library validation error
 */
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

