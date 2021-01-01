const mongoose = require('mongoose')

const {MONGODB_URI} = require('../utils/config')

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
	.then(() => {
		console.log('connected to MongoDB')
	})
	.catch((error) => {
		console.log('error connecting to MongoDB:', error.message)
	})

// to run queries on database.
// let db = mongoose.connection;
// db.collection('blogs').insertOne({ title: 'title 1'})
