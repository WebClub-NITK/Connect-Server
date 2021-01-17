const Blog = require('../models/blog')

const blogs = [
	{
		title: 'Async-Await',
		body: 'Using async await results in cleaner code',
	},
	{
		title: 'Handling Errors',
		body: 'It\'s important to look for exceptions and handle them at the early stage',
	},
	{
		title: 'Frequent Documentation',
		body: 'Programs must be written for people to read, and only incidentally for machines to execute. - Harold Abelson',
	},
]

const getAllBlogs = async () => {
	const blogs = await Blog.find({})
	return blogs
}

const insertBlog = async (body) => {
	const blog = new Blog({
		title: body.title,
		body: JSON.stringify(body.body),
		tags: body.tags,
		coverImageUrl: body.coverImageUrl
	})
	return blog.save()
}

const updateBlog = async (id, body) => {
	const update = {
		title: body.title,
		body: JSON.stringify(body.body),
		tags: body.tags,
		coverImageUrl: body.coverImageUrl
	}
	const updatedBlog = await Blog.findByIdAndUpdate(id, update, {new: true})
	return updatedBlog
}

module.exports = {
	getAllBlogs,
	insertBlog,
	updateBlog
}
