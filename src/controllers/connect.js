const connectRouter = require('express').Router()
const { AddUser,AuthUser } = require('../services/connectServices')
const  { authenticateToken } = require('../utils/middleware')

connectRouter.post('/signup', async(request, response) => {
	try{
        let body = request.body
        AddUser(body)
        response.status(200).send()
	} catch(err) {
		console.log(err)
		response.status(500).send('Something went wrong')
	}
})

connectRouter.post('/login', async(request,response) => {
	try{
		let body = request.body
		AuthUser(body,response)
	} catch(err) {
		console.log(err)
		response.status(500).send('Something went wrong')
	}
})

connectRouter.get('/dummy', authenticateToken,  async(req,res) => {
	console.log(req.userid)
	return res.status(200).send()
})

module.exports = connectRouter