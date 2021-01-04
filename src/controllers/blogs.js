const blogsRouter = require('express').Router()

const { getAllBlogs, insertBlog } = require('../services/blogServices')

blogsRouter.get('/', async(request, response) => {
	try{
		const blogs = await getAllBlogs()
		response.json(blogs)
	} catch(err) {
		console.log(err)
		response.status(500).send('Something went wrong')
	}
})

blogsRouter.post('/', async(request, response) => {
	try{
		const body = request.body

		const savedBlog = await insertBlog(body)

		response.status(200).json(savedBlog)
	} catch(error) {
		console.log(error.message)
		response.status(400).json({ error: error.message })
	}
})

module.exports = blogsRouter