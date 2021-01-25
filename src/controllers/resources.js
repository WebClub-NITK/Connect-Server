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

resourcesRouter.post('/courses', (request, response) => {
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

resourcesRouter.post('/resources/:course_id', upload.array('file'),async (req,res)=>{
    // let tags = req.body.tags.split(' ')
    // tags.forEach(t => {
    //     t=t.toUpperCase()
    // });

    let newResource = new Resource({
        title: req.body.title,
        description: req.body.description,
        // tags:tags,
        course: ObjectId(req.params.course_id)
    });
    
    req.files.forEach(file=>{
        newResource.files.push(file.id);
    })
    
    newResource.save().then(r=>{
        console.log(r);
        res.json({message:"Resource added successfully"});
    }).catch(err=>{
        console.log(err);
    })

})

resourcesRouter.delete('/resource/:resource_id',async (req,res)=>{
    const resource = await Resource.findByIdAndDelete(req.params.resource_id)
    let files = resource.files
    files.forEach(async f=>{
        await deleteFile(f)

    })
    res.send("Resource successfully deleted");

});

resourcesRouter.use('/docs',docRouter)

module.exports = resourcesRouter