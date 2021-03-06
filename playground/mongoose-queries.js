const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

// let id = '5ac3fc80397a59327f8e298e11';
//
// if (!ObjectID.isValid(id)) {
// 	console.log('ID not valid');
// }

// Todo.find({
// 	_id: id
// }).then(todos => {
// 	console.log('Todos', todos);
// });
//
// Todo.findOne({
// 	_id: id
// }).then(todo => {
// 	console.log('Todo', todo);
// });

// Todo.findById(id)
// 	.then(todo => {
// 		if (!todo) {
// 			return console.log('ID not found');
// 		}
// 		console.log('Todo by ID', todo);
// 	})
// 	.catch(e => console.log(e));

User.findById('5ac2c797d4e1542751d423ab')
	.then(user => {
		if (!user) {
			return console.log('User not found');
		}
		console.log('User by ID', user);
	})
	.catch(e => console.log(e));
