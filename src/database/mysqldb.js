const {PASSWORD, USER, DATABASE} = require('../utils/config')
const mysql = require('mysql')

const connection = mysql.createConnection({
    host: 'localhost',
    user: USER,
    password: PASSWORD,
    database: DATABASE
})

const Executequery = (q,callback) => {
    let ans = null
    connection.connect();
    connection.query(q, (err,res) => {
        if(err)
            ans = callback(null,err)
        else   
            ans = callback(res,null)
    })
    connection.end();
    return ans
}

module.exports = Executequery


// sample Use Case in a File
/* 
    const tmp = require('./database/mysqldb')
    tmp('SELECT * FROM authors;',(res,err) => {
        console.log(res)
        // Your function logic
    })
*/