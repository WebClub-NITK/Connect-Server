const connectRouter = require('express').Router()
const { AddUser,AuthUser, RetreiveInfo, search, Updaterespect, leaderboard, updateProfile, AddAnnoUser, follow, Handleforgotpass, Updatepass } = require('../services/connectServices');
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

/*
Route to signup as a public user
@params - {username, password, email}
@response - {user object, signed access token}
*/

connectRouter.post('/signup', async(request, response, next) => {
	try{
        let body = request.body;
		const user = await AddUser(body, next);
        if (user instanceof Array) {
            return response.status(200).json(user);
        }
		if (!user) {
			return response.status(403).send('Forbidden Request');
		}
		const accessToken = jwt.sign({userId: user.Id}, ACCESS_TOKEN_SECRET.toString());
		console.log(accessToken);
		console.log(jwt.verify(accessToken.toString(), ACCESS_TOKEN_SECRET.toString()));
        response.status(200).json({accessToken: accessToken, userId: user.Id});
	} catch(err) {
		next(err);
	}
})

/*
Route to login to an account
@params - {username, password}
@response - {userId, signed access token}
*/

connectRouter.post('/login', async(request, response, next) => {
	try{
		AuthUser(request.body, response, next);
	} catch(err) {
		next(err);
	}
});

/* Requesting by passing headers(React)
	let token = localStorage.getItem('accessToken').toString();
	await axios.get(baseUrl + "/dummy", {headers: {Authorization: `Bearer ${token}`}})
*/

/*
Route to fetch JSON data to populate static dropdown dataSource
@params - None
@response - Object with static dropdown dataSource
*/

connectRouter.get('/info', async(_, res) => {
	return res.status(200).send(await RetreiveInfo());
});

/*
Route to search for users
@params - {ID} or {username, email, name}
@response - Array of user objects
*/

connectRouter.get('/search', async(req, res, next) => {
    try {
        const response = await search(req.query);
        return res.status(200).json(response);
    } catch (e) {
        next(e);
    }
});


connectRouter.post('/upload_profilepic/:username', upload.single('profile'),async(req,res) => {
	console.log(req.body)
    return res.status(200).send();
})

/*
Route to obtain top 10 users ordered by their respect
@params - None
@response - [Array of user objects containg {Id, Username, Respect}]
*/

connectRouter.get('/leaderboard', async(_, res, next) => {
    try {
        const users = await leaderboard();
        return res.status(200).json(users);
    } catch (e) {
        next(e);
    }
});

/*
Route to update respect
@param - {userId, amount by which respect is to be incremented}
@response - 200 OK(None)
*/

connectRouter.post('/updaterespect', async(req, res) => {
	await Updaterespect(req.body.userId, req.body.amount);
    res.status(200);
});

/*
Route to update profile of a public user
@params - {email, name, ptype, branch, semester}
@response - None
*/

connectRouter.post('/updateProfile', authenticateToken, async (req, res, next) => {
	updateProfile(req, res, next);
});

/*
Route to sign up as an anonymous user
@params - {username, password}
@response - {anonymousUserId, signed access token}
*/

connectRouter.post('/createAnnoUser', authenticateToken, async(request, response, next) => {
	try{
		const user = await AddAnnoUser(request);
        if (typeof user === 'string') {
            return response.status(401).send(user);
        }
        if (user instanceof Array) {
            return response.status(200).json(user);
        }
		if (!user) {
			return response.status(403).send('Forbidden Request');
		}
		const accessToken = jwt.sign({userId: user.Id}, ACCESS_TOKEN_SECRET.toString());
        response.status(200).json({accessToken: accessToken, userId: user.Id});
	} catch(err) {
		next(e);
	}
});

connectRouter.post('/forgotpass',async(request, response) => {
    Handleforgotpass(request,response);
})

connectRouter.post('/updatepass', async(request, response) => {
    Updatepass(request, response);
})

connectRouter.post('/follow',authenticateToken, async(req, res) => {
    console.log(req.body)
    follow(req, res);
})

module.exports = connectRouter