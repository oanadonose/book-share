import express from 'express';

//import User from '../models/User';

import {register} from '../controllers/user.js'

const router = express.Router();

router.get('/', (req, res) => {
	res.json({
		status: 'workin',
		message: 'hi'
	});
});

//@route 	POST api/register
//@desc 	Register user
//@acccess 	Public
router.post('/register', register);

export default router;