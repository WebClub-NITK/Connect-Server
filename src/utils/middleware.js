const jwt = require('jsonwebtoken')
const ACCESS_TOKEN_SECRET = require('../utils/config')

const requestLogger = (request, _, next) => {
	console.log('Method:', request.method);
	console.log('Path:  ', request.path);
	console.log('Body:  ', request.body);
	console.log('---');
	next();
}
  
const unknownEndpoint = (_, response) => {
	response.status(404).send({ error: 'unknown endpoint' });
}

const authenticateToken = (req, res, next) => {
	const authHeader = req.headers['authorization']
	  const token = authHeader && authHeader.split(' ')[1];
	if(!token)
		return res.status(401).send()
	else
	{
		jwt.verify(token, ACCESS_TOKEN_SECRET.toString(), (err, response) => {
			if(err)
			{
				console.log(err);
				return res.status(403).send();
			}
			else
			{
				req.userId = response.userId;
				next();
			}
		});
	}
}

module.exports = {
	requestLogger,
	unknownEndpoint,
	authenticateToken
}