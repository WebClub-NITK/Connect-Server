const {DB_HOST, PASSWORD, USER, DATABASE} = require('../utils/config')
const mysql = require('mysql')

const connection = mysql.createConnection({
    host: DB_HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE,
    multipleStatements: true,
    ssl: true,
})

const Executequery = (q,vals,callback) => {
    let ans = null
    connection.connect();
    connection.query(q,[vals], (err,res) => {
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
    tmp('SELECT * FROM authors;',[parms]/null,(res,err) => {
        console.log(res)
        // Your function logic
    })
*/