// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		return console.log('Unable to connect to MongoDB server');
	}
	console.log('Connected to MongoDB server');

	// db
	// 	.collection('Todos')
	// 	.findOneAndUpdate(
	// 		{ _id: new ObjectID('5ac2ab7da62d7d98417f5633') },
	// 		{
	// 			$set: {
	// 				completed: true
	// 			}
	// 		},
	// 		{
	// 			returnOriginal: false
	// 		}
	// 	)
	// 	.then(result => {
	// 		console.log(result);
	// 	});

	db
		.collection('Users')
		.findOneAndUpdate(
			{ _id: new ObjectID('5abad49ded07966f96167447') },
			{
				$set: {
					name: 'Anthony'
				},
				$inc: { age: 1 }
			},
			{
				returnOriginal: false
			}
		)
		.then(result => {
			console.log(result);
		});

	// db.close();
});
