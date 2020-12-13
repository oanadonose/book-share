const request = require('supertest');
import app from '../../app.js';
let server, agent;

describe('User Endpoints', () => {

	beforeEach((done) => {
		server = app.listen(4000, (err) => {
			if (err) return done(err);
			agent = request.agent(server); // since the application is already listening, it should use the allocated port
			done();
		});
	});

	afterEach((done) => {
		return  server && server.close(done);
	});

	const newUser = {
		name: 'unique_112233',
		password: 'password',
		email: 'unique_email@example.com'
	};
	let id, token;
	const updateUser = {
		name: 'update_unique',
		email: 'update_email@update.com',
		password: 'passwordUpdate'
	};

	it('should send 201', async () => {
		await agent
			.get('/api/users')
			.expect(201);
	});

	it('should create a new user', async () => {
		const res = await agent
			.post('/api/users/register')
			.send(newUser)
			.expect(200);
		id = res.body._id;
		expect(res.body).toHaveProperty('name', newUser.name);
		expect(res.body).toHaveProperty('email', newUser.email);
	});

	it('should not create a duplicate user', async () => {
		await agent
			.post('/api/users/register')
			.send(newUser)
			.expect(403);
	});

	it('should login new user', async () => {
		const res = await agent
			.post('/api/users/login')
			.send(newUser)
			.expect(200);
		expect(res.body).toHaveProperty('success',true);
		token = res.body.token;
	});

	it('should fail login with incorrect email', async () => {
		await agent
			.post('/api/users/login')
			.send({email: 'email@email.com', password: 'wrongpassword'})
			.expect(404);
	});

	it('should fail login with incorrect password', async () => {
		await agent
			.post('/api/users/login')
			.send({email: newUser.email, password: 'wrongpassword'})
			.expect(401);
	});

	it('should return user details', async () => {
		const res = await agent
			.get(`/api/users/${id}`)
			.expect(200);
		expect(res.body).toHaveProperty('name', newUser.name);
		expect(res.body).toHaveProperty('email', newUser.email);
	});

	it('should not find user details', async () => {
		await agent
			.get('/api/users/5fbfee5d721c3c45603fbbc0').expect(404);
	});

	it('should throw error because of invalid id param', async () => {
		await agent
			.get('/api/users/123456').expect(500);
	});

	it('should update user details', async () => {
		const res = await agent
			.put(`/api/users/${id}`)
			.set('Authorization', token)
			.send(updateUser);
		expect(res.status).toEqual(200);
		expect(res.body).toHaveProperty('name', updateUser.name);
		expect(res.body).toHaveProperty('email', updateUser.email);
	});

	it('should delete user record', async () => {
		const res = await agent
			.delete(`/api/users/${id}`)
			.set('Authorization', token);
		expect(res.status).toEqual(200);
	});
});
