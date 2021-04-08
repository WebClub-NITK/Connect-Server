require('dotenv').config()
const mongoose = require('mongoose')

const {MONGODB_URI} = require('./src/utils/config')

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

let db = mongoose.connection;
db.collection('branches').insertMany([
    {code: "CSE", name: "Computer Science and Engineering"},
    {code: "IT", name: "Information Technology"},
    {code: "ECE", name: "Electronics and Communication Engineering"},
    {code: "EEE", name: "Electrical and Electronics Engineering"},
    {code: "Mech", name: "Mechanical Engineering"},
]).then(() => {
    console.log('data inserted')
    db.close()
}).catch(err => console.log(err))
