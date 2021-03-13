const Blog = require('../models/blog')

const getAllBlogs = async (numberOfPosts) => {
    const blogs = await Blog.find({}).skip(numberOfPosts).limit(10);
    return blogs
}

const getSearchBlogs = async (title, numberOfPosts) => {
    const blogs = await Blog.find({
        $or: [
            { body: { $regex: `.*${title}.*`, $options: "i" } },
            { title: { $regex: `.*${title}.*`, $options: "i" } },
        ],
    }).skip(numberOfPosts).limit(10);
    const count = await Blog.countDocuments({
        $or: [
            { body: { $regex: `.*${title}.*`, $options: "i" } },
            { title: { $regex: `.*${title}.*`, $options: "i" } },
        ],
    });
    return {blogs:blogs,count:count};
}

const getBlogsByTags = async (tag, numberOfPosts) => {
    const count = await Blog.countDocuments({
        tags: { $regex: `.*${tag}.*`, $options: "i" },
    });
    const blogs = await Blog.find({
        tags: { $regex: `.*${tag}.*`, $options: "i" },
    }).skip(numberOfPosts).limit(10);
    return {blogs:blogs, count: count};
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
    getSearchBlogs,
    getBlogsByTags,
    insertBlog,
    updateBlog,
}
