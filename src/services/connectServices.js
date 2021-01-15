const { response } = require('express');
const jwt = require('jsonwebtoken');
const ACCESS_TOKEN_SECRET = require('../utils/config');
const { User, Profile } = require('../utils/sequelize');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require("path");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const AddUser = (body) => {
    let { passwordUser, passwordAnnoUser, username, annoUser, name, ProgrammeType, branch, semester, email } = body;
    let u;
    u = (async () => {
        console.log(branch, parseInt(branch));
        const profile = await Profile.create({
            Name: name,
            ProgrammeType: parseInt(ProgrammeType),
            Department: parseInt(branch),
            Semester: parseInt(semester),
            Email: email
        });
        if (!u) return;
        passwordUser = await bcrypt.hash(passwordUser, 10);
        const user = await User.create({
            Username: username,
            Password: passwordUser,
            ProfileId: profile.Id
        });
        passwordAnnoUser = await bcrypt.hash(passwordAnnoUser, 10);
        const annoUserObj = await User.create({
            Username: annoUser,
            Password: passwordAnnoUser,
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
        const user = await User.findOne({
            where: {
                Id: userId
            },
            include: [{
                model: Profile,
                attributes: { exclude: ['createdAt', 'updatedAt'] }
            }],
            attributes: { exclude: ['Password', 'crreatedAt', 'updatedAt'] }
        });
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
        userIds = userIds.map((profile) => profile.Users.map((u) => u.Id)).flat();
        const users = await User.findAll({
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
            attributes: { exclude: ['Password', 'crreatedAt', 'updatedAt'] }
        });
        return users;
    }
}

module.exports = {
    AddUser,
    AuthUser,
    RetreiveInfo,
    search
}