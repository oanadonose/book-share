import  AccessControl  from 'accesscontrol';

const ac = new AccessControl();

const roles = () => {
	ac.grant('user')
		.readAny('book')
		.readAny('user')
		.createOwn('book')
		.updateOwn('book')
		.deleteOwn('book')
		.createAny('request');
	ac.grant('admin')
		.extend('user')
		.updateAny('user');
	return ac;
};

export default roles();
