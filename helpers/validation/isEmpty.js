/**
 * Function that checks if value passed in(of any type) is empty
 * @param {?number|?string|?object} value -any type
 * @returns {boolean}
 */
const isEmpty = (value) =>
	value === undefined || value === null ||
	(typeof(value) === 'string' && value.trim().length === 0) ||
	(typeof(value) === 'object' && Object.keys(value).length === 0);
export default isEmpty;
