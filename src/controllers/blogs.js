const blogsRouter = require("express").Router();
var multer = require("multer");
const path = require("path");
const fs = require("fs");
const url = require('url')

const {
    getAllBlogs,
    getSearchBlogs,
    getBlogsByTags,
    insertBlog,
    updateBlog,
} = require("../services/blogServices");
const Blog = require("../models/blog");

const { authenticateToken } = require("../utils/middleware");

const storage = multer.diskStorage({
    destination: "./blog_images",
    filename: function (req, file, cb) {
    // store image as filename_date.extension
        const filename = path
            .parse(file.originalname)
            .name.replace(/[^a-z0-9]/gi, "_");
        cb(null, filename + "_" + Date.now() + path.extname(file.originalname));
    },
});

const imageFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = "Only image files are allowed!";
        return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
};

var upload = multer({ storage: storage, fileFilter: imageFilter });

blogsRouter.get("/page/:pageNumber", async (request, response) => {
    const pageNumber = request.params.pageNumber;
    const numberOfPosts = (pageNumber-1)*10;
    const count = await Blog.countDocuments({});
    try {
        const blogs = await getAllBlogs(numberOfPosts);
        response.json({blogs:blogs,count:count});
    } catch (err) {
        console.log(err);
        response.status(500).send("Something went wrong");
    }
});

blogsRouter.post("/", authenticateToken, async (request, response) => {
    try {
        const body = request.body;
        const user = request.user;

        const savedBlog = await insertBlog(user.Id, body);

        response.status(200).json(savedBlog);
    } catch (error) {
        console.log(error.message);
        response.status(400).json({ error: error.message });
    }
});

blogsRouter.put("/:id", async (request, response) => {
    try {
        const id = request.params.id;
        const body = request.body;

        const updatedBlog = await updateBlog(id, body);

        response.status(200).json(updatedBlog);
    } catch (error) {
        console.log(error.message);
        response.status(400).json({ error: error.message });
    }
});

blogsRouter.delete("/:id", async (request, response) => {
    try {
        const id = request.params.id;
        await Blog.deleteOne({ _id: id });
        response.status(204).json();
    } catch (err) {
        console.log(err.message);
        response.status(400).json({ error: error.message });
    }
});

blogsRouter.get("/search/:pageNumber", async (request, response) => {

    try {
        const title = (request.query.q).trim();
        const pageNumber = request.params.pageNumber;
        const numberOfPosts = (pageNumber-1)*10;
        const blogs = await getSearchBlogs(title, numberOfPosts);
        if (blogs) {
            response.status(201).json(blogs);
        } else {
            response.status(404).send();
        }
    } catch (err) {
        console.log(error);
        response.status(501).send();
    }
});

blogsRouter.get("/:id", async (request, response) => {
    try {
        const id = request.params.id;
        const blog = await Blog.findById(id);
        if (blog) {
            response.status(201).json(blog);
        } else {
            response.status(404).send();
        }
    } catch (error) {
        console.log(error);
        response.status(501).send();
    }
});

blogsRouter.get("/tag/:tag/:pageNumber", async (request, response) => {
    try {
        const tag = request.params.tag;
        const pageNumber = request.params.pageNumber;
        const numberOfPosts = (pageNumber-1)*10;
        const blogs = await getBlogsByTags(tag,numberOfPosts);
        if (blogs) {
            response.status(201).json(blogs);
        } else {
            response.status(404).send();
        }
    } catch (err) {
        console.log(err);
        response.status(501).send();
    }
});

blogsRouter.post(
    "/file_image_upload",
    upload.single("image"),
    async (request, response) => {
        try {
            const server_url = url.format({
                protocol: request.protocol,
                host: request.get('host')
            })
            const res = {
                success: 1,
                file: {
                    url: `${server_url}/blog_images/${request.file.filename}`,
                    from_server: true,
                },
            };
            response.json(res);
        } catch (err) {
            console.log(err);
            response.status(501).send();
        }
    }
);

blogsRouter.post("/url_image_upload", async (request, response) => {
    try {
        const res = {
            success: 1,
            file: {
                url: request.body.url,
            },
        };
        response.json(res);
    } catch (err) {
        console.log(err);
        response.status(501).send();
    }
});

blogsRouter.post("/remove_images", async (request, response) => {
    try {
        for (const imageurl of request.body.images) {
            if (!imageurl) continue;
            const imagename = imageurl.substring(imageurl.lastIndexOf("/") + 1);
            let path = `./blog_images/${imagename}`;
            fs.unlink(path, (err) => err && console.log(err));
        }
        response.status(201).send();
    } catch (err) {
        console.log(err);
        response.status(501).send();
    }
});

// Blog titles for live search
blogsRouter.get("/live/:title", async (request,response) => {
    const title = request.params.title;
    try{
        const blogs = await Blog.find({
            title: { $regex: `.*${title}.*`, $options: "i" }
        }).select('title');

        if (blogs) {
            response.status(201).json(blogs);
        } else {
            response.status(404).send();
        }
    }catch(err){
        console.log(err);
        response.status(501).send();
    }
})

module.exports = blogsRouter;
