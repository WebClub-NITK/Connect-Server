const Blog = require('../models/blog')

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
