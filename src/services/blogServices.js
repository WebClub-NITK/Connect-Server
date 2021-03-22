const Blog = require('../models/blog')
const { Updaterespect } = require('./connectServices')

const getAllBlogs = async (numberOfPosts) => {
    const blogs = await Blog.find({}).skip(numberOfPosts).limit(10).lean();
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
    }).skip(numberOfPosts).limit(10).lean();
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
    Updaterespect(userId, 10)
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

const getUserBlogs = async (userId) => {
    const userBlogs = await Blog.find({author_id:userId});
    return userBlogs;
}

module.exports = {
    getAllBlogs,
    getSearchBlogs,
    getBlogsByTags,
    insertBlog,
    updateBlog,
    getUserBlogs
}
