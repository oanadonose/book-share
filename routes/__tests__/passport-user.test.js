const request = require('supertest');
import app from '../../app.js';
let server, agent;

describe('Passport User Routes', () => {

	let adminToken, userToken, adminId, userId, adminBookId, userBookId;
	let userBook = {};
	const updates = {
		name: 'updated'
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

	it('should create a new user', async () => {
		const res = await agent
			.post('/api/users/register')
			.send(newUser)
			.expect(200);
		userId = res.body._id;
		expect(res.body).toHaveProperty('name', newUser.name);
		expect(res.body).toHaveProperty('email', newUser.email);
		expect(res.body).toHaveProperty('role', 'user');
	});


	it('should login user', async () => {
		const res = await agent
			.post('/api/users/login')
			.send(newUser)
			.expect(200);
		expect(res.body).toHaveProperty('success',true);
		userToken = res.body.token;
	});

	it('should send 401', async () => {
		await agent
			.get('/api/users')
			.set('Authorization',userToken)
			.expect(401);
	});

	//auth only route
	it('should return 401', async () => {
		await agent
			.get(`/api/users/${userId}`)
			.expect(401);
	});

	it('should return user details', async () => {
		const res = await agent
			.get(`/api/users/${userId}`)
			.set('Authorization', userToken)
			.expect(200);
		expect(res.body).toHaveProperty('_id',userId);
		expect(res.body).toHaveProperty('name', newUser.name);
		expect(res.body).toHaveProperty('email', newUser.email);
	});

	it('should return updated user details', async () => {
		const res = await agent
			.put(`/api/users/${userId}`)
			.set('Authorization', userToken)
			.send(updates)
			.expect(200);
		expect(res.body).toHaveProperty('_id', userId);
		expect(res.body).toHaveProperty('name', updates.name);
		expect(res.body).toHaveProperty('email', newUser.email);
	});

	it('should return 401 on update', async () => {
		await agent
			.put(`/api/users/${userId}`)
			.send(updates)
			.expect(401);
	});
	
	it('should return 401 to add new book', async () => {
		await agent
			.post('/api/books/add')
			.send(newBook)
			.expect(401);
	});

	it('should return add new book for new user', async () => {
		const res = await agent
			.post('/api/books/add')
			.set('Authorization', userToken)
			.send(newBook)
			.expect(200);
		userBook = res.body;
		expect(res.body).toHaveProperty('user', userId);
		expect(res.body).toHaveProperty('title', newBook.title);
	});

	it('should return book details', async () => {
		const res = await agent
			.get(`/api/books/${userBook._id}`)
			.expect(200);
		expect(res.body).toHaveProperty('_id',userBook._id);
		expect(res.body).toHaveProperty('author',userBook.author);
		expect(res.body).toHaveProperty('title', userBook.title);
	});

	it('should 401 update book details', async () => {
		await agent
			.put(`/api/books/${userBook._id}`)
			.send(bookUpdate)
			.expect(401);
	});

	it('should update book details', async () => {
		const res = await agent
			.put(`/api/books/${userBook._id}`)
			.set('Authorization', userToken)
			.send(bookUpdate)
			.expect(200);
		expect(res.body).toHaveProperty('title', bookUpdate.title);
	});

	it('should return 401 to delete user record', async () => {
		await agent
			.delete(`/api/users/${userId}`)
			.expect(401);
	});

	it('should delete new book for user', async () => {
		const res = await agent
			.delete(`/api/books/${userBook._id}`)
			.set('Authorization', userToken)
			.send(bookUpdate)
			.expect(200);
		expect(res.body).toHaveProperty('success', true);
	});

	it('should return 200 to delete user record', async () => {
		await agent
			.delete(`/api/users/${userId}`)
			.set('Authorization', userToken)
			.expect(200);
	});




});
