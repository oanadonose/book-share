const request = require('supertest');
import app from '../../app.js';
let server, agent;

describe('Passport Admin Routes', () => {
	let adminToken, adminId;
	let randUser = {};
	let randUser2= {};
	let adminBook = {};
	const updates = {
		name: 'updated'
	};
	const adminUser = {
		name: 'unique_33',
		password: 'password',
		email: 'unique_email3@example.com',
		role: 'admin'
	};
	const newBook = {
		title: 'New Book',
		author: 'New Author',
		ISBN: '12345668',
		genre: 'History',
		photo: 'test'
	};
	const bookUpdate = {
		title: 'Updated'
	};

	beforeAll(async (done) => {
		server = app.listen(4000, (err) => {
			if (err) return done(err);
			agent = request.agent(server); // since the application is already listening, it should use the allocated port
			done();
		});
	});
	afterAll((done) => {
		return  server && server.close(done);
	});

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
		adminId = res.body._id;
		expect(res.body).toHaveProperty('name', adminUser.name);
		expect(res.body).toHaveProperty('email', adminUser.email);
		expect(res.body).toHaveProperty('role', adminUser.role);
	});

	it('should login admin user', async () => {
		const res = await agent
			.post('/api/users/login')
			.send(adminUser)
			.expect(200);
		expect(res.body).toHaveProperty('success',true);
		adminToken = res.body.token;
	});

	

	it('should send 200', async () => {
		const res = await agent
			.get('/api/users')
			.set('Authorization',adminToken)
			.expect(200);
		randUser = res.body[0];
		randUser2 = res.body[1];
	});

	it('should return admin user details', async () => {
		const res = await agent
			.get(`/api/users/${adminId}`)
			.set('Authorization', adminToken)
			.expect(200);
		expect(res.body).toHaveProperty('_id',adminId);
		expect(res.body).toHaveProperty('name', adminUser.name);
		expect(res.body).toHaveProperty('email', adminUser.email);
	});


	it('should return other user details', async () => {
		const res = await agent
			.get(`/api/users/${randUser._id}`)
			.set('Authorization', adminToken)
			.expect(200);
		expect(res.body).toEqual(randUser);
	});

	it('should return updated user details', async () => {
		const res = await agent
			.put(`/api/users/${adminId}`)
			.set('Authorization', adminToken)
			.send(updates)
			.expect(200);
		expect(res.body).toHaveProperty('_id', adminId);
		expect(res.body).toHaveProperty('name', updates.name);
		expect(res.body).toHaveProperty('email', adminUser.email);
	});

	it('should return add new book for admin user', async () => {
		const res = await agent
			.post('/api/books/add')
			.set('Authorization', adminToken)
			.send(newBook)
			.expect(200);
		adminBook = res.body;
		expect(res.body).toHaveProperty('title', newBook.title);
	});

	it('should return book details', async () => {
		const res = await agent
			.get(`/api/books/${adminBook._id}`)
			.expect(200);
		expect(res.body).toHaveProperty('_id',adminBook._id);
		expect(res.body).toHaveProperty('author',adminBook.author);
		expect(res.body).toHaveProperty('title', adminBook.title);
	});

	it('should update new book for admin user', async () => {
		const res = await agent
			.put(`/api/books/${adminBook._id}`)
			.set('Authorization', adminToken)
			.send(bookUpdate)
			.expect(200);
		expect(res.body).toHaveProperty('title', bookUpdate.title);
	});

	it('should delete new book for admin user', async () => {
		const res = await agent
			.delete(`/api/books/${adminBook._id}`)
			.set('Authorization', adminToken)
			.send(bookUpdate)
			.expect(200);
		expect(res.body).toHaveProperty('success', true);
	});

	it('should return 200 to delete user record', async () => {
		await agent
			.delete(`/api/users/${adminId}`)
			.set('Authorization', adminToken)
			.expect(200);
	});
});
