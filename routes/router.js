import express from 'express';
import passport from 'passport';

import {register, login, logout, getUser} from '../controllers/user.js';
import { validateUser } from '../helpers/validation/schema.js';

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
router.post('/register', validateUser, register);

//@route 	POST api/login
//@desc 	Login an existing user
//@access 	Public
router.post('/login', validateUser, login);

//@route POST api/logout
//@desc Logout current user
//@access Private
router.post('/logout', passport.authenticate('jwt', { session: false }), logout);

//TODO: change path to /user/:user/
//@route GET api/user
//@desc Display current user
//@access Private
router.get('/user/:id', passport.authenticate('jwt', { session: false }), getUser);

export default router;
