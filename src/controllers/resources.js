const { response } = require('../app')

const resourcesRouter = require('express').Router()

resourcesRouter.get('/resources', (request, response) => {
    response.send('get all resources')
})

resourcesRouter.get('/branches', (request, response) => {
    response.send('get all branches')
})

resourcesRouter.get('/courses', (request, response) => {
    response.send('get all courses')
})

resourcesRouter.get('/courses/:branch_id', (request, response) => {
    response.send('get courses of branch '+request.params.branch_id)
})

resourcesRouter.get('/resources/:course_id', (request, response) => {
    response.send('get resources of course '+request.params.course_id)
})

module.exports = resourcesRouter