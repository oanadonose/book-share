/**
 * Express router module providing user related routes
 * @module routes/userRouter
 * @requires express
 */
import express from 'express';
import passport from 'passport';

import { register, login, logout, getUser, getUsers, getUserBooks, updateUser, deleteUser } from '../controllers/user.js';
import { validateUser } from '../helpers/validation/schema.js';

import {can} from '../helpers/rights.js';


/**
 * Express router to mount user related routes on.
 * @type {object}
 * @const
 */
const userRouter = express.Router();

/**
 * Route that returns user data for admin related tasks
 * @name GET/users/
 * @function
 * @memberof module:routes/userRouter
 * @inner
 * @param {string} path
 * @param {function} can -middleware access controller
 * @param {function} -passport authentication
 * @param {callback} getUsers
 */
userRouter.get('/', can({resource: 'user', action: 'updateAny'}), passport.authenticate('jwt', { session: false }), getUsers);


/**
 * Route posting register data
 * @name POST/users/register
 * @function
 * @memberof module:routes/userRouter
 * @inner
 * @param {string} path
 * @param {function} validateUser - middleware validation
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
 * @param {function} can -middleware access controller
 * @param {function} - passport authentication
 * @param {callback} getUser - express middleware function that returns a user object
 * @see /controllers/user#getUser for getUser handler
 */
userRouter.get('/:id',can({resource: 'user', action: 'readAny'}), getUser);

/**
 * Route that returns user books
 * @name GET/users/id/books
 * @function
 * @memberof module:routes/userRouter
 * @inner
 * @param {string} path
 * @param {function} can -middleware access controller
 * @param {function} - passport authentication
 * @param {callback} getUserBooks - express middleware function that returns a user object
 * @see /controllers/user#getUserBooks for getUserBooks handler
 */
userRouter.get('/:id/books',can({resource: 'book', action: 'readAny'}), getUserBooks);

/**
 * Route to update user data
 * @name PUT/users/id
 * @function
 * @memberof module:routes/userRouter
 * @inner
 * @param {string} path
 * @param {function} can -middleware access controller
 * @param {function} - passport authentication
 * @param {callback} updateUser - express middleware function that handles the update
 * @see /controllers/user#updateUser for updateUser handler
 */
userRouter.put('/:id', can({resource: 'user', action: 'updateOwn'}), passport.authenticate('jwt', { session: false }), updateUser);

/**
 * Route to delete user record
 * @name DELETE/users/:id
 * @function
 * @memberof module:routes/userRouter
 * @inner
 * @param {string} path
 * @param {function} can -middleware access controller
 * @param {function} - passport authentication
 * @param {callback} deleteUser - express middleware function that handles the update
 * @see /controllers/user#deleteUser for deleteUser handler
 */
userRouter.delete('/:id', can({resource: 'user', action: 'updateOwn'}), passport.authenticate('jwt', { session: false }), deleteUser);

export default userRouter;
