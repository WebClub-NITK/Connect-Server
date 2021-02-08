const Blog = require('../models/blog')

const getAllBlogs = async () => {
	const blogs = await Blog.find({})
	return blogs
}

const insertBlog = async (userId, body) => {
	const blog = new Blog({
		author_id: userId,
		title: body.title,
		body: JSON.stringify(body.body),
		tags: body.tags,
		coverImageUrl: body.coverImageUrl
	})
	return blog.save()
}

const updateBlog = async (userId, id, body) => {
	const update = {
		title: body.title,
		body: JSON.stringify(body.body),
		tags: body.tags,
		coverImageUrl: body.coverImageUrl
	}
	const updatedBlog = await Blog.findOneAndUpdate({_id: id, author_id: userId}, update, {new: true})
	return updatedBlog
}

module.exports = {
	getAllBlogs,
	insertBlog,
	updateBlog
}
