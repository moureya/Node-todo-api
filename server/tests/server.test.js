const expect = require('expect');
const request = require('supertest');

const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

const todos = [
	{
		_id: new ObjectID(),
		text: 'First test todo'
	},
	{
		_id: new ObjectID(),
		text: 'Second test todo',
		completed: true,
		completedAt: 333
	}
];

beforeEach(done => {
	Todo.remove({})
		.then(() => {
			return Todo.insertMany(todos);
		})
		.then(() => {
			done();
		});
});

describe('POST /todos', () => {
	it('should create a new todo', done => {
		let text = 'Test todo text';

		request(app)
			.post('/todos')
			.send({ text })
			.expect(200)
			.expect(res => {
				expect(res.body.text).toBe(text);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.find({ text })
					.then(todos => {
						expect(todos.length).toBe(1);
						expect(todos[0].text).toBe(text);
						done();
					})
					.catch(e => done(e));
			});
	});

	it('should not create todo with invalid body data', done => {
		request(app)
			.post('/todos')
			.send({})
			.expect(400)
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.find()
					.then(todos => {
						expect(todos.length).toBe(2);
						done();
					})
					.catch(e => done(e));
			});
	});
});

describe('GET /todos', () => {
	it('should get all todos', done => {
		request(app)
			.get('/todos')
			.expect(200)
			.expect(res => {
				expect(res.body.todos.length).toBe(2);
			})
			.end(done);
	});
});

describe('GET /todos/:id', () => {
	let hexID = new ObjectID().toHexString();
	it('should return todo doc', done => {
		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.expect(200)
			.expect(res => {
				expect(res.body.todo.text).toBe(todos[0].text);
			})
			.end(done);
	});
	it('should return 404 if todo not found', done => {
		request(app)
			.get(`/todos/${hexID}`)
			.expect(404)
			.end(done);
	});
	it('should return 404 for non-object ids', done => {
		request(app)
			.get('/todos/123')
			.expect(404)
			.end(done);
	});
});

describe('DELETE /todos/:id', () => {
	let hexID = todos[1]._id.toHexString();
	it('should remove a todo', done => {
		request(app)
			.delete(`/todos/${hexID}`)
			.expect(200)
			.expect(res => {
				expect(res.body.todo._id).toBe(hexID);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				Todo.findById(hexID)
					.then(todo => {
						expect(todo).toBeFalsy();
						done();
					})
					.catch(e => done(e));
			});
	});
	it('should return 404 if todo not found', done => {
		let hexID = new ObjectID().toHexString();
		request(app)
			.delete(`/todos/${hexID}`)
			.expect(404)
			.end(done);
	});
	it('should return 404 if ObjectID is invalid', done => {
		request(app)
			.delete('/todos/123')
			.expect(404)
			.end(done);
	});
});

describe('PATCH /todos/:id', () => {
	it('should update the todo', done => {
		let hexID = todos[0]._id.toHexString();
		let text1 = 'This text is for the first object should be updated';

		request(app)
			.patch(`/todos/${hexID}`)
			.send({
				text: text1,
				completed: true
			})
			.expect(200)
			.expect(res => {
				expect(res.body.todo.text).toBe(text1);
				expect(res.body.todo.completed).toBeTruthy();
				expect(typeof res.body.todo.completedAt).toBe('number');
			})
			.end(done);
	});
	it('should clear completedAt when todo is not completed', done => {
		let hexID = todos[0]._id.toHexString();
		let text2 = 'This text is for the second object should be updated';

		request(app)
			.patch(`/todos/${hexID}`)
			.send({
				text: text2,
				completed: false
			})
			.expect(200)
			.expect(res => {
				expect(res.body.todo.text).toBe(text2);
				expect(res.body.todo.completed).toBeFalsy();
				expect(res.body.todo.completedAt).toBeFalsy();
			})
			.end(done);
	});
});
