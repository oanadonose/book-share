const request = require('supertest');
import app from '../../app.js';
let server, agent;

describe('Passport User Routes', () => {

	let userToken;
	let books = [];
	let user = {};
	let userBook = {};
	const updates = {
		name: 'updated'
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
	let newRequest = {
		bookId: '',
		message: 'Test message'
	};
	let requestBody = {
		messages: [],
		archived: false,
		_id: '',
		book: '',
		user: '',
		status: 'open'
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

	it('should create a new user', async () => {
		const res = await agent
			.post('/api/users/register')
			.send(newUser)
			.expect(200);
		user= res.body;
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

	it('should return all books', async () => {
		const res = await agent
			.get('/api/books/')
			.expect(200);
		books = res.body;
	});

	it('should request book', async ()=> {
		newRequest.bookId = books[0]._id;
		await agent
			.post('/api/requests/add')
			.send(newRequest)
			.expect(401);
	});

	it('should request book', async ()=> {
		newRequest.bookId = books[0]._id;
		const res = await agent
			.post('/api/requests/add')
			.set('Authorization', userToken)
			.send(newRequest)
			.expect(200);
		requestBody = res.body.request;
	});

	it('should add reply to request', async ()=> {
		await agent
			.post('/api/requests/reply')
			.set('Authorization', userToken)
			.send({message: 'reply', requestId: requestBody._id})
			.expect(200);
	});

	it('should return 401 when add reply to request', async ()=> {
		await agent
			.post('/api/requests/reply')
			.send({message: 'reply', requestId: requestBody._id})
			.expect(401);
	});

	it('should return 401 when closing request', async ()=> {
		await agent
			.post('/api/requests/close')
			.send({requestId: requestBody._id})
			.expect(401);
	});

	it('should close request', async ()=> {
		await agent
			.post('/api/requests/close')
			.set('Authorization', userToken)
			.send({requestId: requestBody._id})
			.expect(200);
	});


});
