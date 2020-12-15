/**
 * Function that verifies if logged user is book owner.
 * @param {string} loggedUserId
 * @param {string} bookUserId
 * @returns {boolean}
 */
const owns = (loggedUserId, bookUserId) => {
	if(loggedUserId==bookUserId) return true;
	else return false;
};

import {getUserRole} from '../helpers/users.js';
import roles from '../helpers/roles.js';

const can = (options) => {
	return async (req,res,next) => {
		const role = await getUserRole(req.user.id);
		const action = options.action;
		const resource = options.resource;
		try {
			const permission = roles.can(role)[action](resource);
			if(permission.granted) next();
			else throw new Error('permission denied');
		} catch (err) {
			if(err.message == 'permission denied') res.status(401).send(err.message);
			else throw err;
		}
	};
};

export {owns, can};
