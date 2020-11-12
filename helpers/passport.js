/**
 * A module to authenticate endpoints using a JSON web token.
 * @module helpers/passport
 */

import passportjwt from 'passport-jwt';
import User from '../models/user.js';

const jwtStrat = passportjwt.Strategy;
const jwtExtract = passportjwt.ExtractJwt;

const opts = {};

opts.jwtFromRequest = jwtExtract.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.secretOrKey;

/**
 * Function that creates a config to initialize passport with bearer token strategy.
 * @param {object} passport -from passport library
 */
const passportConfig = (passport) => {
	return passport.use(new jwtStrat(opts, (jwtPayload, done) => {
		try{
			User.findById(jwtPayload.id, (err, user) => {
				if(err) {
					return done(err, false);
				}
				if(user) {
					return done(null, user);
				} else {
					return done(null, false);
				}
			});
		} catch (err) {
			console.log('err in passport', err);
		}
	}
	));
};
export default passportConfig;

