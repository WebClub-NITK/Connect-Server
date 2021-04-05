const commentsRouter = require('express').Router()
const BlogComments = require('../models/blogComments')
const { authenticateToken } = require('../utils/middleware')
const mongoose = require('mongoose')
const {ObjectId} = mongoose.Types.ObjectId;


commentsRouter.get('/blogs/:id', (request, response) => {
    BlogComments.find({course:ObjectId(request.params.id)}).then(comments=>{
        response.json({comments:comments})
    }).catch(err=>{
        console.log(err)
    })
})

commentsRouter.post('/blogs/:id', authenticateToken, (request, response) => {
    const comment = new BlogComments({
        text: request.body.comment,
        replies: [],
        likes: 0,
        dislikes: 0,
        course: ObjectId(request.params.id),
        user:{
            Id: request.user.Id,
            Username: request.user.Username
        }, 
    })

    comment.save()
        .then(() => {
            response.json({message: "Comment added"})
        })
        .catch((err) => {
            console.log(err)
        })
})

commentsRouter.put('/blogs/:id', authenticateToken, (request, response) => {
    BlogComments.findByIdAndUpdate(request.params.id, {
        $push: {replies: {
            text: request.body.reply,
            likes: 0,
            dislikes: 0,
            user:{
                Id: request.user.Id,
                Username: request.user.Username
            }
        }}
    }, {
        new: true
    })
        .then(() => {
            return response.json({message: "reply added"})
        })
        .catch((err) => {
            return console.log(err)
        })
})

module.exports = commentsRouter