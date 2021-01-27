const connectRouter = require('express').Router()
const { AddUser,AuthUser, RetreiveInfo, search, Updaterespect, leaderboard } = require('../services/connectServices')
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
		console.log(user[0].Id,user[1].Id)
		const accessToken = jwt.sign({userId: user[0].Id}, ACCESS_TOKEN_SECRET.toString());
		const secondaryToken = jwt.sign({userId: user[1].Id}, ACCESS_TOKEN_SECRET.toString());
        response.status(200).json({accessToken: accessToken, userId: user[0].Id, secondaryToken: secondaryToken, annouserId: user[1].Id});
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

connectRouter.get('/dummy', authenticateToken,  async(req, res) => {
	console.log(req.userId)
	return res.status(200).send();
});
/* Requesting by passing headers(React)
	let token = localStorage.getItem('accessToken').toString();
	await axios.get(baseUrl + "/dummy", {headers: {Authorization: `Bearer ${token}`}})
*/

connectRouter.get('/info', async(_, res) => {
	return res.status(200).send(await RetreiveInfo());
});

connectRouter.get('/search', async(req, res) => {
	const response = await search(req.query);
	return res.status(200).json(response);
});

connectRouter.get('/leaderboard', async(req, res) => {
	const users = await leaderboard();
	return res.status(200).json(users);
});
connectRouter.post('/updaterespect', async(req,res) => {
	Updaterespect(req,res)
});

module.exports = connectRouter