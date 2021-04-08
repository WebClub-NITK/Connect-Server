const resourcesRouter = require('express').Router()
const { Router, response } = require('express')
const mongoose = require('mongoose')
const router = require('./docs')
const deleteFile = require('../utils/deleteFile')
const {ObjectId} = mongoose.Types.ObjectId;
const upload = require('../utils/fileStore')
const docRouter = require('./docs')

const Branch = require('../models/resource-module/branch')
const Course = require('../models/resource-module/course')
const Resource = require('../models/resource-module/resource')
const Feedback  = require('../models/resource-module/feedback')
const CourseComment = require('../models/resource-module/courseComment')
const { authenticateToken } = require('../utils/middleware')
const { Updaterespect} = require('../services/connectServices')

resourcesRouter.get('/resources', (request, response) => {

    Resource.find().then(resources=>{
        response.json({resources:resources});
    })
        .catch(err=>{
            console.log(err);
        })
})

resourcesRouter.get('/branches', (request, response) => {
    Branch.find()
        .then((branches) => {
            response.json({branches: branches})
        })
        .catch((err) => {
            console.log(err)
        })
})

resourcesRouter.get('/branch/:id', (request, response) => {
    Branch.findById(request.params.id)
        .then((branch) => {
            response.json({branch: branch})
        })
        .catch((err) => {
            console.log(err)
        })
})

resourcesRouter.post('/branches', (request, response) => {
    const {code, name} = request.body
    
    if(!code || !name) {
        return response.status(422).json({error: "please add all the fields"})
    }

    const branch = new Branch({
        code,
        name
    })

    branch.save()
        .then((branch) => {
            response.json({message: "Branch Saved Successfully"})
        })
        .catch((err) => {
            console.log(err)
        })
})

resourcesRouter.get('/courses', (request, response) => {
    Course.find()
        .then((courses) => {
            response.json({courses: courses})
        })
        .catch((err) => {
            console.log(err)
        })
})

resourcesRouter.get('/course/:id', (request, response) => {
    Course.findById(request.params.id)
        .then((course) => {
            response.json({course: course})
        })
        .catch((err) => {
            console.log(err)
        })
})

resourcesRouter.get('/course/:id/comments', (request, response) => {
    CourseComment.find({course:ObjectId(request.params.id)}).then(comments=>{
        response.json({comments:comments})
    }).catch(err=>{
        console.log(err)
    })
})

resourcesRouter.post('/course/:id/comments', authenticateToken, (request, response) => {
    const comment = new CourseComment({
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

resourcesRouter.put('/course/comments/:id', authenticateToken, (request, response) => {
    CourseComment.findByIdAndUpdate(request.params.id, {
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

resourcesRouter.post('/courses', authenticateToken, (request, response) => {
    const {code, name, branch} = request.body

    if(!code || !name || !branch) {
        return response.status(422).json({error: "please add all the fields"})
    }

    const course = new Course({
        code,
        name,
        branch: ObjectId(branch)
    })

    course.save()
        .then((course) => {
            response.json({message: "Course Saved Successfully"})
        })
        .catch((err) => {
            console.log(err)
        })
})

resourcesRouter.get('/courses/:branch_id', (request, response) => {
    Course.find({branch: ObjectId(request.params.branch_id)})
        .then((courses) => {
            response.json({courses: courses})
        })
        .catch((err) => {
            console.log(err)
        })
})

resourcesRouter.get('/resources/:course_id', (request, response) => {
    Resource.find({course:ObjectId(request.params.course_id)}).then(resources=>{
        response.json({resources:resources})
    }).catch(err=>{
        console.log(err)
    })
})

resourcesRouter.post('/resources/:course_id', authenticateToken, upload.array('file'),async (req,res)=>{
    // let tags = req.body.tags.split(' ')
    // tags.forEach(t => {
    //     t=t.toUpperCase()
    // });

    let newResource = new Resource({
        title: req.body.title,
        description: req.body.description,
        // tags:tags,
        course: ObjectId(req.params.course_id),
        user:{
            Id: req.user.Id,
            Username: req.user.Username
        }
    });
    
    req.files.forEach(file=>{
        newResource.files.push(file.id);
    })

    if(req.body.links)
    {
        links = req.body.links.split(' ');
        newResource.links = links;
    }
    newResource.save().then(r=>{
        console.log(r);
        res.json({message:"Resource added successfully"});
    }).catch(err=>{
        console.log(err);
    })
    // console.log(req.user.Id)
    Updaterespect(req.user.Id, 10)

})

resourcesRouter.delete('/resource/:resource_id',async (req,res)=>{
    const resource = await Resource.findByIdAndDelete(req.params.resource_id)
    let files = resource.files
    files.forEach(async f=>{
        await deleteFile(f)

    })
    res.send("Resource successfully deleted");

});
resourcesRouter.get('/resource/:resource_id/like', async (req,res)=>{
    // let feedback = await Feedback.findOne({user:req.user.id})
    let status = "Liked";
    if(feedback && feedback.positive == true)
    {
        feedback =  await Feedback.findByIdAndDelete(feedback.id);
        status= "Unliked"   
    }
    else if(feedback && feedback.positive == false )
    {
        feedback.positive= true;
        await feedback.save();   
    }
    else {
        feedback  = new Feedback({
            resource:ObjectId(req.params.resource_id),
            positive:true,
            user:{
                Id: req.user.Id,
                Username: req.user.Username
            }
        //  user:ObjectId(req.user.id)
        });
        await feedback.save();                    
    }
    let likes = await Feedback.find({positive: true});
    let dislikes = await Feedback.find({positive: false});
    res.json({status:status,
        likes:likes,
        dislikes: dislikes,
        user:{
            Id: req.user.Id,
            Username: req.user.Username
        }
        //   user:req.user
    });

})
resourcesRouter.get('/resource/:resource_id/dislike', async (req,res)=>{
    // let feedback = await Feedback.findOne({user:req.user.id})
    let status = "Disliked";
    if(feedback && feedback.positive ==false)
    {
        feedback =  await Feedback.findByIdAndDelete(feedback.id);
        status= "Removed disliked"   
    }
    else if(feedback && feedback.positive == true )
    {
        feedback.positive= false;
        await feedback.save();   
    }
    else {
        feedback  = new Feedback({
            resource:ObjectId(req.params.resource_id),
            positive:false,
            user:{
                Id: req.user.Id,
                Username: req.user.Username
            }
        //  user:ObjectId(req.user.id)
        });
        await feedback.save();                    
    }
    let likes = await Feedback.find({positive: true});
    let dislikes = await Feedback.find({positive: false});
    res.json({status:status,
        likes:likes,
        dislikes: dislikes,
        //   user:req.user
    });

})

resourcesRouter.use('/docs',docRouter)

module.exports = resourcesRouter