import express from 'express';
import passport from 'passport';

import { getBooks, getBookById, addBook, removeBook, updateBook } from '../controllers/book.js';

const bookRouter = express.Router();

//@route GET api/books
//@desc Get all available books
//@access Public
bookRouter.get('/', getBooks);

//@route GET api/books/:id
//@desc Display one book
//@access Public
bookRouter.get('/:id', getBookById);

//@route POST api/books/add
//@desc Add a new book
//@access Private
bookRouter.post('/add', passport.authenticate('jwt', { session: false }), addBook);

//@route DELETE api/books/:id
//@desc Delete a book listing - only allowed if user owns the book
//@access Private
bookRouter.delete('/:id', passport.authenticate('jwt', { session: false }), removeBook);

//@route PUT api/books/:id
//@desc Update a book listing - only allowed if user owns the book
//@access Private
bookRouter.put('/:id', passport.authenticate('jwt', { session: false }), updateBook);

export default bookRouter;
