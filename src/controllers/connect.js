const connectRouter = require('express').Router()
const { AddUser,AuthUser, RetreiveInfo, search } = require('../services/connectServices')
const  { authenticateToken } = require('../utils/middleware')
const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET } = require('../utils/config'); 

connectRouter.post('/signup', async(request, response) => {
	try{
        let body = request.body;
		const user = await AddUser(body);
		if (!user) {
			return response.status(403).send();
		}
		const accessToken = jwt.sign({userId: user.Id}, ACCESS_TOKEN_SECRET.toString());
        response.status(200).json({accessToken: accessToken, userId: user.Id});
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

connectRouter.get('/dummy', authenticateToken,  async(_, res) => {
	return res.status(200).send();
});

connectRouter.get('/info', async(_, res) => {
	return res.status(200).send(await RetreiveInfo());
});

connectRouter.get('/search', async(req, res) => {
	const response = await search(req.query);
	return res.status(200).json(response);
});

module.exports = connectRouter