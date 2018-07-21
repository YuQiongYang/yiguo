var mysql = require('mysql');
let express = require("express");
let app = express();
let path = require('path');
let bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');
const apiResult = require('../utils/apiResult');

//创建连接池
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    port: 3306,
    database: 'student',
    multipleStatements: true
});

if(pool){
    console.log('ok=====>mql')
}

let tsql = "select * from stu001 where name = 'tom'"
app.post("/local", (req, res)=>{

    pool.query(tsql, (err, rows) =>{
        
        // if(rows.length >1){
        //     console.log(rows[0])
        // }else{
            console.log(err,rows)
        // }
        res.send(rows);
    })
   
   
})
// pool.end();

app.listen(2000)






// module.exports = {
//     select: function (tsql, callback) {
//         pool.query(tsql, function (error, rows) {
//             if (rows.length > 1) {
//                 callback({ rowsCount: rows[1][0]['rowsCount'], data: rows[0] });
//             } else {
//                 callback(rows);
//             }
//         })
//     }
// }

