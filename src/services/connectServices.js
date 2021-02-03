const { response } = require('express');
const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET } = require('../utils/config');
const { User, Profile } = require('../utils/sequelize');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require("path");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const AddUser = (body) => {
    let { passwordUser, username, email } = body;
    let u;
    u = (async () => {
        const profile = await Profile.create({
            Email: email
        });
        if (!u) return;
        passwordUser = await bcrypt.hash(passwordUser, 10);
        const user = await User.create({
            Username: username,
            Password: passwordUser,
            ProfileId: profile.Id
        });
        return user;
    })();
    return u;
}

const AddAnnoUser = (request) => {
    let { username, passwordUser } = request.body;
    let u;
    u = (async () => {
        const publicUser = await User.findOne({
            where: {
                Id: parseInt(request.userId.toString())
            },
            attributes: ['ProfileId']
        });
        const profile = await Profile.findOne({
            where: {
                Id: publicUser.ProfileId
            }
        });
        if (profile.AnnouserSet) return;
        passwordUser = await bcrypt.hash(passwordUser, 10);
        const user = await User.create({
            Username: username,
            Password: passwordUser
        });
        return user;
    })();
    return u;    
}

const AuthUser = (body, response) => {
    let { username, password } = body;
    (async () => {
        const user = await User.findOne({
            where: {
                Username: username
            },
        });
        if (!user) {
            return response.status(403).send();
        }
        const auth = await bcrypt.compare(password.toString(), user.Password.toString());
        if (auth) {
            const accessToken = jwt.sign({userId: user.Id}, ACCESS_TOKEN_SECRET.toString());
            return response.json({ accessToken: accessToken, userId: user.Id });
        } else {
            return response.status(401).send();
        }
    })();
}

const RetreiveInfo = async() => {
    var jsonVal;
    jsonVal = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../public/info.json'), 'utf-8'));
    return jsonVal;
}

const search = async(body) => {
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
        user["profileurl"] = `http://localhost:3001/profiles/${user.Username}`
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
            user["profileurl"] = `http://localhost:3001/profiles/${user.Username}`;
            return user;
        })
        console.log(users)
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
const Updaterespect = async(req,res) => {
    await User.update({ Respect: Sequelize.literal(`Respect + ${req.body.amount}`)},{ where: {Id: req.body.userId}})
    res.status(200).send()
}

const updateProfile = async(req, res) => {
    let { email, name, ptype, branch, semester } = req.body;
    const user = await User.findOne({
        where: {
            Id: parseInt(req.userId.toString())
        },
        attributes: ['ProfileId']
    });
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
}

module.exports = {
    AddUser,
    AuthUser,
    RetreiveInfo,
    search,
    leaderboard,
    Updaterespect,
    updateProfile,
    AddAnnoUser
}