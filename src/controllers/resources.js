const resourcesRouter = require('express').Router()
require('../models/resource-module/branch')
require('../models/resource-module/course')
const mongoose = require('mongoose')
const {ObjectId} = mongoose.Types.ObjectId;

const Branch = mongoose.model("Branch")
const Course = mongoose.model("Course")

resourcesRouter.get('/resources', (request, response) => {
    response.send('get all resources')
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
    response.send('get resources of course '+request.params.course_id)
})

module.exports = resourcesRouter