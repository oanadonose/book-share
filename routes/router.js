import express from 'express';
import passport from 'passport';

//import User from '../models/User';

import {register, login, logout, displayUser} from '../controllers/user.js'

const router = express.Router();

router.get('/', (req, res) => {
	res.json({
		status: 'workin',
		message: 'hi'
	});
});

//@route 	POST api/register
//@desc 	Register user
//@access 	Public
router.post('/register', register);

//@route 	POST api/login
//@desc 	Login an existing user
//@access 	Public
router.post('/login' , login);

//@route POST api/logout
//@desc Logout current user
//@access Private
router.post('/logout', passport.authenticate('jwt', { session: false }), logout);


//@route GET api/user
//@desc Display current user
//@access Private
router.get('/user', passport.authenticate('jwt', { session: false }), displayUser);

export default router;