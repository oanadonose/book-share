/**
 * Express router module providing user related routes
 * @module routes/requestRouter
 * @requires express
 */
import express from 'express';
import passport from 'passport';

import { getRequest, getBookRequests, addRequest, addMessage, closeRequest, archiveRequest, getUserMadeRequests, getUserReceivedRequests } from '../controllers/request.js';

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

requestRouter.get('/:requestId', passport.authenticate('jwt', { session: false }), getRequest);

requestRouter.post('/add', passport.authenticate('jwt', { session: false }), addRequest);

requestRouter.post('/reply', passport.authenticate('jwt', { session: false }), addMessage);

requestRouter.post('/close', passport.authenticate('jwt', { session: false }), closeRequest);

requestRouter.post('/:requestId/archive', passport.authenticate('jwt', { session: false }), archiveRequest);

requestRouter.get('/:userid/made', passport.authenticate('jwt', { session: false }), getUserMadeRequests);

requestRouter.get('/:userid/received', passport.authenticate('jwt', { session: false }), getUserReceivedRequests);

requestRouter.get('/:bookid/book', passport.authenticate('jwt', { session: false }), getBookRequests);



export default requestRouter;