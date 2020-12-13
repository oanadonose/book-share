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
		let id;
		if(!req.user) {
			id = '5fd62b98c06d1109689d191c';
		}
		else {
			id = req.user.id;
		}
		console.log('id in can', id);
		const role = await getUserRole(id);
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
