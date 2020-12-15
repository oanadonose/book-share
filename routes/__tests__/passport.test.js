const request = require('supertest');
import app from '../../app.js';
let server, agent;

describe('Passport', () => {

	let adminToken, userToken;

	const user = {
		email: 'fake@fake.com',
		password: 'fake'
	};
	const adminUser = {
		name: 'unique_33',
		password: 'password',
		email: 'unique_email3@example.com',
		role: 'admin'
	};
	const newUser = {
		name: 'unique_44',
		password: 'password',
		email: 'unique_email4@example.com'
	};

	beforeAll(async (done) => {
		server = app.listen(4000, (err) => {
			if (err) return done(err);
			agent = request.agent(server); // since the application is already listening, it should use the allocated port
			done();
		});
		//const res = await agent
		//	.post('/api/users/register')
		//	.send(newUser);
		//console.log('res.status', res.status);
	});

	afterAll((done) => {
		return  server && server.close(done);
	});

	//beforeEach(async (done) => {
	//	const res = await agent
	//		.post('/api/users/login')
	//		.send(newUser);
	//	console.log('res',res.status);
	//	done();
	//});

	it('should send 401', async () => {
		await agent
			.get('/api/users')
			.expect(401);
	});

	it('should create a new admin user', async () => {
		const res = await agent
			.post('/api/users/register')
			.send(adminUser)
			.expect(200);
		expect(res.body).toHaveProperty('name', adminUser.name);
		expect(res.body).toHaveProperty('email', adminUser.email);
		expect(res.body).toHaveProperty('role', adminUser.role);
	});

	it('should create a new user', async () => {
		const res = await agent
			.post('/api/users/register')
			.send(newUser)
			.expect(200);
		expect(res.body).toHaveProperty('name', newUser.name);
		expect(res.body).toHaveProperty('email', newUser.email);
		expect(res.body).toHaveProperty('role', 'user');
	});

	it('should login admin user', async () => {
		const res = await agent
			.post('/api/users/login')
			.send(adminUser)
			.expect(200);
		expect(res.body).toHaveProperty('success',true);
		adminToken = res.body.token;
	});

	it('should login admin user', async () => {
		const res = await agent
			.post('/api/users/login')
			.send(adminUser)
			.expect(200);
		expect(res.body).toHaveProperty('success',true);
		adminToken = res.body.token;
	});

	it('should login user', async () => {
		const res = await agent
			.post('/api/users/login')
			.send(newUser)
			.expect(200);
		expect(res.body).toHaveProperty('success',true);
		userToken = res.body.token;
	});

	//test admin only route - with admin account
	it('should send 200', async () => {
		await agent
			.get('/api/users')
			.set('Authorization', adminToken)
			.expect(200);
	});

	//test admin only route - with user account
	it('should send 401', async () => {
		await agent
			.get('/api/users')
			.set('Authorization', userToken)
			.expect(401);
	});
});
