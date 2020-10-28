import validator from 'validator';
import isEmpty from './isEmpty.js';

export const validateAuthInput = (data) => {
	let errors = {};

	data.email = !isEmpty(data.email) ? data.email: '';
	data.password = !isEmpty(data.password) ? data.password: '';

	if(!validator.isEmail(data.email)) {
		errors.email = 'Email input does not have a valid format.';
	}
	
	if(validator.isEmpty(data.email)) {
		errors.email = 'Email field is required.';
	}

	if(validator.isEmpty(data.password)) {
		errors.password = 'Password field is required.';
	}

	return {errors, isValid: isEmpty(errors)}
}
