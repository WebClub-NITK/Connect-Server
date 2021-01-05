const jwt = require('jsonwebtoken')
const ACCESS_TOKEN_SECRET = require('../utils/config')

const requestLogger = (request, response, next) => {
	console.log('Method:', request.method)
	console.log('Path:  ', request.path)
	console.log('Body:  ', request.body)
	console.log('---')
	next()
}
  
const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

const authenticateToken = (req,res,next) => {
	const authHeader = req.headers['authorization']
  	const token = authHeader && authHeader.split(' ')[1]
	console.log(token)
	if(token == null)
		return res.status(401).send()
	else
	{
		jwt.verify(token,ACCESS_TOKEN_SECRET.toString(),(err,response) => {
			if(err)
			{
				console.log(err)
				return res.status(403).send()
			}
			else
			{
				req.userid = response.userid
				next()	
			}
		})
	}
}

module.exports = {
	requestLogger,
	unknownEndpoint,
	authenticateToken
}