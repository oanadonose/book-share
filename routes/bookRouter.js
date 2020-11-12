/**
 * Express router module providing book related routes
 * @module routes/bookRouter
 * @requires express
 */
import express from 'express';
import passport from 'passport';

import { getBooks, getBookById, addBook, removeBook, updateBook } from '../controllers/book.js';
import { validateBook } from '../helpers/validation/schema.js';

/**
 * Express router to mount book related routes on.
 * @type {object}
 * @const
 * @memberof module:routes/bookRouter
 */
const bookRouter = express.Router();

/**
 * Route that returns all books
 * @name GET/books
 * @access public
 * @function
 * @memberof module:routes/bookRouter
 * @inner
 * @param {string} path
 * @param {callback} getBooks - express middleware function that returns a user object
 * @see /controllers/book#getBooks for getBooks handler
 */
bookRouter.get('/', getBooks);

/**
 * Route that returns a book by id
 * @name GET/books/id
 * @function
 * @memberof module:routes/bookRouter
 * @inner
 * @param {string} path
 * @param {callback} getBookById - express middleware function that returns a user object
 * @see /controllers/book#getBookById for getBooks handler
 */
bookRouter.get('/:id', getBookById);

/**
 * Route that handles adding a new book
 * @name POST/books/id
 * @function
 * @memberof module:routes/bookRouter
 * @inner
 * @param {string} path
 * @param {function} validateBook - middleware validation function
 * @param {function} - passport authentication
 * @param {callback} addBook - express middleware function that returns a response object
 * @see /controllers/book#addBook for getBooks handler
 */
bookRouter.post('/add', validateBook, passport.authenticate('jwt', { session: false }), addBook);

/**
 * Route that handles deleting a book
 * @name DELETE/books/id
 * @function
 * @memberof module:routes/bookRouter
 * @inner
 * @param {string} path
 * @param {function} - passport authentication
 * @param {callback} removeBook - express middleware function that returns a response object
 * @see /controllers/book#removeBook for getBooks handler
 */
bookRouter.delete('/:id', passport.authenticate('jwt', { session: false }), removeBook);

/**
 * Route that handles updating a book
 * @name PUT/books/id
 * @function
 * @memberof module:routes/bookRouter
 * @inner
 * @param {string} path
 * @param {function} validateBook - middleware validation function
 * @param {function} - passport authentication
 * @param {callback} updateBook - express middleware function that returns a response object
 * @see /controllers/book#updateBook for updateBook handler
 */
bookRouter.put('/:id', validateBook, passport.authenticate('jwt', { session: false }), updateBook);

export default bookRouter;
