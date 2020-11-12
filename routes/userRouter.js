/**
 * Express router module providing user related routes
 * @module routes/userRouter
 * @requires express
 */
import express from 'express';
import passport from 'passport';

import {register, login, logout, getUser, updateUser, deleteUser } from '../controllers/user.js';
import { validateUser } from '../helpers/validation/schema.js';

/**
 * Express router to mount user related routes on.
 * @type {object}
 * @const
 */
const userRouter = express.Router();

userRouter.get('/', (req, res) => {
	res.json({
		status: 'workin',
		message: 'hi'
	});
});

/**
 * Route posting register data
 * @name POST/users/register
 * @function
 * @memberof module:routes/userRouter
 * @inner
 * @param {string} path
 * @param {function} validateUser - middleware validation function
 * @param {callback} register - express middleware function that handles registration
 * @see /controllers/user#register for register handler
 */
userRouter.post('/register', validateUser, register);

/**
 * Route posting login data
 * @name POST/users/login
 * @function
 * @memberof module:routes/userRouter
 * @inner
 * @param {string} path
 * @param {function} validateUser - middleware validation function
 * @param {callback} login - express middleware function that handles registration
 * @see /controllers/user#login for login handler
 */
userRouter.post('/login', validateUser, login);

/**
 * Route posting logout data
 * @name POST/users/logout
 * @function
 * @memberof module:routes/userRouter
 * @inner
 * @param {string} path
 * @param {function} - passport authentication
 * @param {callback} logout - express middleware function that handles logout
 * @see /controllers/user#logout for logout handler
 */
userRouter.post('/logout', passport.authenticate('jwt', { session: false }), logout);

/**
 * Route that returns user data
 * @name GET/users/id
 * @function
 * @memberof module:routes/userRouter
 * @inner
 * @param {string} path
 * @param {function} - passport authentication
 * @param {callback} getUser - express middleware function that returns a user object
 * @see /controllers/user#getUser for getUser handler
 */
userRouter.get('/:id', passport.authenticate('jwt', { session: false }), getUser);

/**
 * Route to update user data
 * @name PUT/users/id
 * @function
 * @memberof module:routes/userRouter
 * @inner
 * @param {string} path
 * @param {function} - passport authentication
 * @param {callback} updateUser - express middleware function that handles the update
 * @see /controllers/user#updateUser for updateUser handler
 */
userRouter.put('/:id', passport.authenticate('jwt', { session: false }), updateUser);

/**
 * Route to delete user record
 * @name DELETE/users/:id
 * @function
 * @memberof module:routes/userRouter
 * @inner
 * @param {string} path
 * @param {function} - passport authentication
 * @param {callback} deleteUser - express middleware function that handles the update
 * @see /controllers/user#deleteUser for deleteUser handler
 */
userRouter.delete('/:id', passport.authenticate('jwt', { session: false }), deleteUser);

export default userRouter;