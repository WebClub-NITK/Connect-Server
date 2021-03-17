const jwt = require('jsonwebtoken');
const { instantiateUser } = require('../services/connectServices');
const { ACCESS_TOKEN_SECRET } = require('../utils/config');

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

const authenticateToken = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader.split(' ')[1];
    if(!token)
        return res.status(401).send('Please login to continue!');
    else
    {
        jwt.verify(token.toString(), ACCESS_TOKEN_SECRET.toString(), async (err, response) => {
            if(err)
            {
                console.log(err);
                return res.status(403).send('Forbidden request');
            }
            else
            {
                req.user = await instantiateUser(parseInt(response.userId.toString()));
                next();
            }
        });
    }
}

const errorHandler = (err, req, res, next) => {
    console.log(err);
    res.status(500).send('We are facing an issue at the moment! Please try again later');
}
  

module.exports = {
    requestLogger,
    unknownEndpoint,
    authenticateToken,
    errorHandler
}