const express = require('express');
const app = express();
const path = require('path');
const bp = require('body-parser');

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, auth, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    if (req.method == "OPTIONS") {
        res.send(200); /*让options请求快速返回*/
    } else {
        next();
    }
});

app.use(express.static(path.join(__dirname, './')));
app.use(bp.urlencoded({
    extended: false
}));

const user = require('./user');

module.exports = {
    start(_port = 666){
        user.register(app);
        app.listen(_port);
    }
}