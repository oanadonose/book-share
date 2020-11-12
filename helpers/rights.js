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

export default owns;
