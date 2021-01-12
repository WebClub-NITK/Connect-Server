const blogsRouter = require('express').Router()

const { getAllBlogs, insertBlog } = require('../services/blogServices')
const Blog = require('../models/blog')

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

blogsRouter.get('/search', async(request,response) => {
try{
	const title = request.query.title
	const blogs = await Blog.find({title:{$regex: `.*${title}.*`, $options: "i"}})

 if(blogs){
	 response.status(201).json(blogs)
 }else{
	 response.status(404).send()
 }
}catch(err){
	console.log(error)
	response.status(501).send()
}
})

blogsRouter.get('/:id', async(request, response) => {
	try{
		const id = request.params.id
		const blog = await Blog.findById(id)

		if(blog){
			response.status(201).json(blog)
		}else{
			response.status(404).send()
		}
	}catch(error) {
		console.log(error)
		response.status(501).send()
	}
})

blogsRouter.get('/tag/:tag', async(request, response) => {
	try{
		const tag = request.params.tag;
    const blogs = await Blog.find({tags:{$regex: `.*${tag}.*`, $options:"i"}})

   if(blogs){
		 response.status(201).json(blogs)
	 }else{
		 response.status(404).send()
	 }

 	}catch(err){
		console.log(err);
		response.status(501).send()
	}
})

module.exports = blogsRouter
