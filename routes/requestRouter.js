/**
 * Express router module providing user related routes
 * @module routes/requestRouter
 * @requires express
 */
import express from 'express';
import passport from 'passport';

import { addRequest } from '../controllers/request.js';

/**
 * Express router to mount request related routes on.
 * @type {object}
 * @const
 */
const requestRouter = express.Router();

requestRouter.get('/', (req, res) => {
	res.json({
		status: 'workin',
		message: 'hi'
	});
});

requestRouter.post('/add', passport.authenticate('jwt', { session: false }), addRequest);


export default requestRouter;