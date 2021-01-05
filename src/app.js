// package imports
const express = require('express')
const path = require('path')
const app = express()
const cors = require('cors')

// function imports
const { requestLogger, unknownEndpoint } = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const connectRouter = require('./controllers/connect')
require('./database/mongodb')

// allow cors
app.use(cors())
// exposing public directory
app.use('/static', express.static(path.join(__dirname, '../public')))
// parse json in requests
app.use(express.json())
// logs incoming requests
app.use(requestLogger)

// blogs route handler
app.use('/blogs', blogsRouter)

// connect route handler
app.use('/connect', connectRouter)

// handles unknown endpoints
app.use(unknownEndpoint)

module.exports = app
