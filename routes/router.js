import express from 'express';
import passport from 'passport';

//import User from '../models/User';

import {register, login, logout, getUser} from '../controllers/user.js';
import { getBooks, addBook, getBookById, removeBook } from '../controllers/book.js';

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

//TODO: change path to /user/:user/
//@route GET api/user
//@desc Display current user
//@access Private
router.get('/user/:name/', passport.authenticate('jwt', { session: false }), getUser);

//@route GET api/user/:user/books
//@desc Display :user's books
//@access Private
router.get('/user/:name/books', passport.authenticate('jwt', { session: false }), getBooks);

//@route GET api/user/:user/books/:id
//@desc Display one book
//@access private
router.get('/user/:name/books/:id', passport.authenticate('jwt', { session: false }), getBookById);

//@route POST api/user/:user/books/add
//@desc Add a new book
//@access Private
router.post('/user/:name/books/add', passport.authenticate('jwt', { session: false }), addBook);

router.delete('/user/:name/books/:id', passport.authenticate('jwt', { session: false }), removeBook);

export default router;
