
const owns = (loggedUserId, bookUserId) => {
	if(loggedUserId==bookUserId) return true;
	else return false;
};

export default owns;
