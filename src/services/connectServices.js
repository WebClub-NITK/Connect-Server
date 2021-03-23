const { response } = require('express');
const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET, SERVER_URL } = require('../utils/config');
const { User, Profile, Follow } = require('../utils/sequelize');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require("path");
const Sequelize = require('sequelize');
const { ValidationError } = require('sequelize');
const Op = Sequelize.Op;

const AddUser = (body, next) => {
    let { passwordUser, username, email } = body;
    let u;
    u = (async () => {
        try {
            const profile = await Profile.create({
                Email: email
            });
            if (!profile) return;
            passwordUser = await bcrypt.hash(passwordUser, 10);
            const user = await User.create({
                Username: username,
                Password: passwordUser,
                ProfileId: profile.Id
            });
            return user;
        } catch (e) {
            console.log(e);
            if (e instanceof ValidationError) {
                return e.errors.map((e) => e.message.split('.')[1]);
            } else {
                next(e);
            }
        }
    })();
    return u;
}

const AddAnnoUser = (request, next) => {
    let { username, passwordUser } = request.body;
    let u;
    u = (async () => {
        try {
            const publicUser = await User.findOne({
                where: {
                    Id: parseInt(request.user.Id.toString())
                },
                attributes: ['ProfileId']
            });
            const profile = await Profile.findOne({
                where: {
                    Id: publicUser.ProfileId
                }
            });
            if (profile.AnnouserSet) return "You have already created an anonymous profile!";
            passwordUser = await bcrypt.hash(passwordUser, 10);
            const user = await User.create({
                Username: username,
                Password: passwordUser
            });
            return user;
        } catch (e) {
            console.log(e);
            if (e instanceof ValidationError) {
                return e.errors.map((e) => e.message.split('.')[1]);
            } else {
                next(e);
            }
        }
    })();
    return u;
}

const AuthUser = (body, response, next) => {
    let { username, password } = body;
    (async () => {
        try {
            const user = await User.findOne({
                where: {
                    Username: username
                },
            });
            if (!user) {
                return response.status(401).send('Invalid login credentials');
            }
            const auth = await bcrypt.compare(password.toString(), user.Password.toString());
            if (auth) {
                const accessToken = jwt.sign({ userId: user.Id }, ACCESS_TOKEN_SECRET.toString());
                return response.status(200).json({ accessToken: accessToken, userId: user.Id });
            } else {
                return response.status(401).send('Invalid login credentials');
            }
        } catch(e) {
            next(e);
        }
    })();
}

const RetreiveInfo = async () => {
    var jsonVal;
    jsonVal = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../public/info.json'), 'utf-8'));
    return jsonVal;
}

const search = async (body) => {
    if (body.id) {
        const userId = parseInt(body.id);
        let user = await User.findOne({
            where: {
                Id: userId
            },
            include: [{
                model: Profile,
                attributes: { exclude: ['createdAt', 'updatedAt'] }
            }],
            attributes: { exclude: ['Password', 'crreatedAt', 'updatedAt'] }
        });
        user = user.toJSON()
        user["profileurl"] = `${SERVER_URL}/profiles/${user.Username}`
        return user;
    } else if (body.username) {
        const username = `%${body.username}%`;
        let userIds = await Profile.findAll({
            where: {
                [Op.or]: [
                    {
                        Name: {
                            [Op.like]: username
                        }
                    },
                    {
                        Email: {
                            [Op.like]: username
                        }
                    }
                ]
            },
            attributes: ['Id'],
            include: [{
                model: User,
                attributes: ['Id']
            }]
        });
        userIds = userIds.map((profile) => profile.Users.map((u) => u.Id));
        let users = await User.findAll({
            where: {
                [Op.or]: [
                    {
                        Username: {
                            [Op.like]: username
                        }
                    },
                    {
                        Id: {
                            [Op.in]: userIds
                        }
                    }
                ]
            },
            include: [{
                model: Profile,
                attributes: { exclude: ['createdAt', 'updatedAt'] }
            }],
            attributes: { exclude: ['Password', 'createdAt', 'updatedAt'] },
            raw: true,
            nest: true
        });
        users = users.map(user => {
            user["profileurl"] = `${SERVER_URL}/profiles/${user.Username}`;
            return user;
        })
        return users;
    }
}

const leaderboard = async () => {
    const users = await User.findAll({
        order: [
            ["respect", "DESC"]
        ],
        limit: 10,
        attributes: ['Id', 'Username', 'Respect']
    });
    return users;
}
const Updaterespect = async (userId, amount) => {
    await User.update({ Respect: Sequelize.literal(`Respect + ${amount}`) }, { where: { Id: userId } });
}

const updateProfile = async (req, res, next) => {
    try {
        let { email, name, ptype, branch, semester } = req.body;
        const user = await User.findOne({
            where: {
                Id: parseInt(req.user.Id.toString())
            },
            attributes: ['ProfileId']
        });
        if (!user) return res.status(403).send('Forbidden Request');
        await Profile.update(
            {
                Name: name,
                ProgrammeType: parseInt(ptype.toString()),
                Department: parseInt(branch.toString()),
                Semester: parseInt(semester.toString())
            },
            {
                where: {
                    Id: user.ProfileId.toString(),
                    Email: email
                }
            }
        );
        res.status(200).send();
    } catch (e) {
        next(e);
    }
}

const instantiateUser = async (userId) => {
    try {
        const user = await User.findOne({
            where: {
                Id: userId
            },
            include: [{
                model: Profile
            }],
        });
        return user;
    } catch (e) {
        console.log(e);
        return "Encountered an error!";
    }
}

const follow = async (req, res) => {
    console.log(req.body);
    let followingid = req.body.id;
    let followersid = req.userId;
    console.log(req.userId)
    console.log(followingid,followersid)
    try{
        await Follow.create({
            FollowerIdId: followersid,
            FollowingIdId: followingid
        })
        res.status(200).send();
    }
    catch(e)
    {
        console.log(e)
        res.status(400).send();
    }   
}

// this function takes in an array of userids and returns their details.
const getUsers = async (arr) => {

    const response = await User.findAll({
        attributes: ['Id', 'Username'],
        raw: true,
        where: {
            Id: {
                [Op.or]: arr
            }
        },
        include: [
            { model : Profile, attributes: ['Name']}
        ],
    })

    return response

}

module.exports = {
    AddUser,
    AuthUser,
    RetreiveInfo,
    search,
    leaderboard,
    Updaterespect,
    updateProfile,
    AddAnnoUser,
    instantiateUser,
    follow,
    getUsers,
}