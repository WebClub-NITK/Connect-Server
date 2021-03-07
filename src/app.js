// package imports
const express = require('express')
const path = require('path')
const app = express()
const cors = require('cors')
const url = require('url')

// function imports
const { requestLogger, unknownEndpoint } = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const connectRouter = require('./controllers/connect')
const resourcesRouter = require('./controllers/resources')
require('./database/mongodb')

// allow cors
app.use(cors())
// exposing public directory
app.use('/static', express.static(path.join(__dirname, '../public')))
// exposing the blog_images directory
app.use('/blog_images', express.static(path.join(__dirname, '../blog_images')))
//exposing the profile pics
app.use('/profiles', express.static(path.join(__dirname, '../profiles')))
// parse json in requests
app.use(express.json())
// logs incoming requests
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger)

app.get('/', (request, response) => {
    response.json({message: "Welcome to connect server 🔥"})
})

// blogs route handler
app.use('/blogs', blogsRouter)

// connect route handler
app.use('/connect', connectRouter)

// resources route handler
app.use('/resource_module', resourcesRouter)

// handles unknown endpoints
app.use(unknownEndpoint)

module.exports = app
