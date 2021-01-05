const { response } = require('express')
const mysqlexe = require('../database/mysqldb')
const jwt = require('jsonwebtoken')
const ACCESS_TOKEN_SECRET = require('../utils/config')

const AddUser = (body) => {
    let password = body.password
    let username = body.username
    let annouser = body.annouser
    let q1 = `INSERT INTO Users(Username,Password,ProfileID) VALUES?;`
    let vals = [
        [username,password,4],
        [annouser,password,4]
    ]
    mysqlexe(q1,vals,(res,err) => {
        if(err) throw err
        console.log(res)
    })
}

const AuthUser = (body,response) => {
    let username = body.username
    let password = body.password
    let q = `SELECT Password,UserID FROM Users WHERE Username = '${username}'`
    mysqlexe(q,null,(res,err) => {
        if(err) throw err
        console.log(res)
        if(res[0].Password !== password)
            return response.status(403).send()	
        else
        {
            let user = { userid:res[0].UserID }
            const accesstoken = jwt.sign(user,ACCESS_TOKEN_SECRET.toString())
            response.json({ accesstoken: accesstoken })
        }
    })
}

module.exports = {
    AddUser,
    AuthUser
}