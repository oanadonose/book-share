import express from 'express';
import passport from 'passport';

import {register, login, logout, getUser, updateUser, deleteUser } from '../controllers/user.js';
import { validateUser } from '../helpers/validation/schema.js';

const userRouter = express.Router();

userRouter.get('/', (req, res) => {
	res.json({
		status: 'workin',
		message: 'hi'
	});
});

//@route 	POST api/users/register
//@desc 	Register user
//@access 	Public
userRouter.post('/register', validateUser, register);

//@route 	POST api/users/login
//@desc 	Login an existing user
//@access 	Public
userRouter.post('/login', validateUser, login);

//@route POST api/users/logout
//@desc Logout current user
//@access Private
userRouter.post('/logout', passport.authenticate('jwt', { session: false }), logout);

//@route GET api/users/:id
//@desc Display current user
//@access Private
userRouter.get('/:id', passport.authenticate('jwt', { session: false }), getUser);

//@route PUT api/user
//@desc Update current user
//@access Private
userRouter.put('/:id', passport.authenticate('jwt', { session: false }), updateUser);

//@route DELETE api/user
//@desc Delete current user
//@access Private
userRouter.delete('/:id', passport.authenticate('jwt', { session: false }), deleteUser);

export default userRouter;
