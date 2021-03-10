const connectRouter = require('express').Router()
const { AddUser,AuthUser, RetreiveInfo, search, Updaterespect, leaderboard, updateProfile, AddAnnoUser, follow } = require('../services/connectServices');
const  { authenticateToken } = require('../utils/middleware');
const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET } = require('../utils/config'); 
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: './profiles',
    filename: function(req, file, cb){
		console.log("\n",file,"\n")
		const name = `${req.params.username}`
        return cb(null, name)
    }
})

const imageFilter = function (req, file, cb) {
    console.log(file.originalname);
	if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
	  req.fileValidationError = "Only image files are allowed!";
	  return cb(new Error("Only image files are allowed!"), false);
	}
	cb(null, true);
};

const upload = multer({
	storage: storage,
	fileFilter: imageFilter
})


connectRouter.post('/signup', async(request, response) => {
	try{
        let body = request.body;
		const user = await AddUser(body);
        if (user instanceof Array) {
            return response.status(200).json(user);
        }
		if (!user) {
			return response.status(403).send();
		}
		const accessToken = jwt.sign({userId: user.Id}, ACCESS_TOKEN_SECRET.toString());
		console.log(accessToken);
		console.log(jwt.verify(accessToken.toString(), ACCESS_TOKEN_SECRET.toString()));
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


connectRouter.post('/upload_profilepic/:username', upload.single('profile'),async(req,res) => {
	console.log(req.body)
    return res.status(200).send();
})

connectRouter.get('/leaderboard', async(_, res) => {
	const users = await leaderboard();
	return res.status(200).json(users);
});
connectRouter.post('/updaterespect', async(req, res) => {
	Updaterespect(req,res);
});
connectRouter.post('/updateProfile', authenticateToken, async(req, res) => {
	updateProfile(req, res);
});
connectRouter.post('/createAnnoUser', authenticateToken, async(request, response) => {
	try{
		const user = await AddAnnoUser(request);
		if (!user) {
			return response.status(403).send();
		}
		const accessToken = jwt.sign({userId: user.Id}, ACCESS_TOKEN_SECRET.toString());
        response.status(200).json({accessToken: accessToken, userId: user.Id});
	} catch(err) {
		console.log(err)
		response.status(500).send('Something went wrong')
	}
});

connectRouter.post('/follow',authenticateToken, async(req, res) => {
    console.log(req.body)
    follow(req, res);
})

module.exports = connectRouter