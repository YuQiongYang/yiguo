let express = require("express");
let app = express();
let path = require('path');
let db = require('../utils/dbhelper');
let bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');
const apiResult = require('../utils/apiResult');
const ObjectID = require('mongodb').ObjectID;

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
// // 静态资源文件加载
// app.use(express.static(path.join(__dirname, '/')));

//这是加密的 key（密钥）
let secret = 'yiguo';
let token;


//过滤器
let filter = (req, res, next) => {
    let token = req.headers['auth'];
    if (!token) {
        res.send(apiResult(false, {}, 'token err'))
    } else {
        jwt.verify(token, secret, (error, result) => {
            if (error) {
                //console.log("token====>" + error);
                res.send(apiResult(false, {}, error))
            } else {
                next()
            }
        })
    }
}


app.use(bodyParser.urlencoded({ extended: false }));

//admin---后台权限用户 ojbk
app.post("/allData", (req, res) => {

    db.select('admin', ).then((result) => {
        res.send(result);
    })
})

//admin----login ojbk
app.post('/admin', (req, res) => {
    let _data = {
        username: req.body.username,
        password: req.body.password
    }
    //console.log("admin login===>" + _data)

    db.select('admin', _data).then((result) => {

        if (result.status) {

            // 写 token
            token = jwt.sign(_data, secret, {
                'expiresIn': 60 * 60 * 24 // 设置过期时间, 24 小时
            })
            res.send(apiResult(result.status, {}, token))

        } else {
            res.send(result);
        }

    })
})
//admin ---全部app用户 ojbk
app.post("/Allusers", async (req, res) => {
    let _data = req.body;

    let newData = {}



    // for(var key in _data){
    //     if(key == "user" || "goods"){
    //         newData[key] = _data[key];
    //     }

    // }



    let result = await db.select('users');
    res.send(result)
})

//admin---删除用户 ojbk
app.post("/deleteUser", async (req, res) => {

    let _data = req.body

    let _id = new ObjectID(_data.id)

    let oldData = await db.select("admin", { '_id': _id });

    //console.log("deleteUser _id===>" + _id)

    if (oldData.status) {

        let result = await db.delete("admin", { '_id': _id });

        res.send(result);
    }
    res.send(oldData);

})

//admin---添加成员  ojbk
app.post("/addAdmin", async (req, res) => {
    let _data = {
        username: req.body.username,
        password: req.body.password
    }
    //console.log("addAdmin result==>" + JSON.stringify(_data));

    let result = await db.select('admin', { username: _data.username })

    if (result.status) {

        //     //console.log("result==>" + JSON.stringify(result));
        res.send(apiResult(false, {}, 'the user in the exeit ....'));

    } else {
        //console.log("addAdmin _data==>" + JSON.stringify(_data));

        let addresult = await db.insert('admin', _data);

        token = jwt.sign(_data, secret, { 'expiresIn': 60 * 1 * 1 })

        res.send(apiResult(true, { res: addresult, token: token }))
    }

})

//admin---修改商品数据 ojbk
app.post('/updateGoods', async (req, res) => {

    //     "CommodityName" : "上海8424西瓜1个2.5kg以上/个",
    //     "MaxLimitCount" : 20,
    //     "OriginalPrice" : 35,
    //     "SellPrice" : 35,
    //     "State" : 1,
    //     "Spec" : "1个/份",
    //     "SmallPic" : "https://img12.yiguoimg.com/d/items/2018/180716/9288726228247792_300.jpg",
    //     "ShowOriginalPrice" : false,
    //     "SubTitle" : "皮薄肉嫩 实力网红瓜",
    //     "PromotionTag" : "第2件9.9元",
    //     "CommodityTag" : 21,
    //     "qty" : 0,
    //     "shelfDate" : "2018/11/19",
    //     "shelfTime" : "11:41",
    //     "sales" : 26


    let _data = JSON.parse(req.body.updateData);
    let typeSet;
    //判断要查询那个集合
    if (req.body.type == "meat") {

        typeSet = "meat_goodsData";

    } else if (req.body.type == "fruits") {

        typeSet = "goodsData";

    } else {

        res.send("type is Incorrect !");
    }

    let key;
    delete _data._id
    for (key in _data) {
        if (!_data[key]) {
            delete _data[key];
        }

    }
    //console.log("updateGoods typeSet===>" + typeSet)

    let oldData = await db.select(typeSet, { CommodityId: _data.CommodityId });

    if (oldData.status) {

        // let dataset = oldData.data;
        let _id = new ObjectID(oldData.data[0]._id)
        //console.log("updateGoods _id===>" + _id)

        //     //更新商品数据
        let newData = await db.updata(typeSet, { _id }, _data);

        if (newData.status) {

            res.send(newData);
        }

    }

    res.send(oldData);
})

//admin---删除商品   ojbk
app.post("/deleteGoods", async (req, res) => {

    let _data = JSON.parse(req.body.data);
    let type = req.body.type;
    let typeSet;
    let result;
    var guid;
    var guid1;

    if (type == "meat") {
        typeSet = "meat_goodsData";
    } else if (type == "fruits") {
        typeSet = "goodsData";
    } else {
        res.send("type not Incorrect !")
    }


    for (var key of _data) {

        guid = new ObjectID(key._id);

        var seekResult = await db.select(typeSet, { '_id': guid });

        if (seekResult.status) {

            // guid = new ObjectID(seekResult.data[0]._id);

            result = await db.delete(typeSet, { '_id': guid });

        }

    }
    res.send(apiResult(result.status, { guid }, "delete le " + _data.length + " tiao! "));

})
// --end

//admin --供应商
app.post("/supplier", async (req, res) => {

    let result = await db.select("Supplier");

    res.send(result);

})
//admin---搜索 
app.post("/cruxSeek", async (req, res) => {
    // db.goodsData.find({CommodityName:{$regex:/果.{1,}/}})
    // crux 关键字
    // type 查询什么类型的数据、
    let _data = req.body;
    let setNaem;
    if (_data.type == "meat") {
        setNaem = "meat_goodsData";
    } else if (_data.type == "fruits") {
        setNaem = "goodsData";
    } else if (_data.type == "user") {
        setNaem = "users";
    } else if (_data.type == "buycart") {
        setNaem = "buycart";
    } else {
        res.send('not seek type!!')
    }
    let _id = {}
    if (_data.id) {
        _id = new ObjectID(_data.id)
        //console.log("updateGoods _id===>" + _id)
    }


    // let result = await db.select(setNaem, { _id });
    let result = await db.select(setNaem, { _id }, _data);

    if (result.status) {

        res.send(result);
    }

    // }
    res.send(result)

})

//admin---后台查看用户订单
app.post("/seekbuycart", async (req, res) => {
    let _user = { username: req.body.username };
    //console.log("seekbuycart===>");
    // res.send(_user);
    let result = await db.select("buycart", _user);
    res.send(result);
})

//用户个人信息数据 
app.post('/userdata', filter, (req, res) => {
    let _data = {
        username: req.body.username,
    }
    db.select('users', _data).then((result) => {

        delete result.data[0].password
        res.send(apiResult(result.status, result.data))

        //console.log("userdata result==>" + result);

    })
})
//--end


// 修改个人用户数据
app.post('/updateUser', filter,async (req, res) => {

    // username: req.body.username || '',
    // password: req.body.password || "",
    // balance: '1000',    //余额
    // youB: '999999', //悠币
    // address: '',    //地址
    // Voucher: 3,  //优惠券
    // phone: '',  //手机号
    // nick: '',  //昵称
    // gender: 1,  //1 男 2女
    // birthday: "2018/7/17"  //生日

    let _data = req.body;
    let newData = {}
    let key;
    for (key in _data) {
        if (!/[(address)(nick)(gender)]/.test(key)) {
            //console.log("updateUser==>" + key)
            delete _data[key];
        }
    }
    let oldData = await db.select('users', { username: req.body.username });

    //console.log("updateUser oldData==>" + oldData)
    if (oldData.status) {

        let dataset = oldData.data;

        let _id = new ObjectID(dataset[0]['_id'])

        //更新用户数据
        let newData = await db.updata('users', { _id }, _data);
        //console.log("updateUser newData==>" + newData)
        res.send(newData);

    }

    res.send(oldData);
})
//--end

//修改密码
app.post('/changepwd', async (req, res) => {
    let query = {
        username: req.body.username,
        password: req.body.password,
        newpwd: req.body.newpwd
    }

    let oldData = await db.select('users', { username: req.body.username, password: req.body.password });

    if (oldData.status) {

        let dataset = oldData.data;
        dataset[0].password = query.newpwd;
        let _id = new ObjectID(dataset[0]['_id'])

        let newData = await db.updata('users', { _id }, dataset[0]);

        res.send(newData);

    }

    res.send(apiResult(false));
})
//--end

//login
app.post('/login', (req, res) => {
    let _data = {
        username: req.body.username,
        password: req.body.password
    }
    db.select('users', _data).then((result) => {

        //如果登录成功
        if (result.status) {
            token = jwt.sign(_data, secret, {
                'expiresIn': 60 * 60 * 24 * 30 // 设置过期时间, 
            })

            delete result.data[0].password
            res.send(apiResult(result.status, { username: result.data[0].username, token: token }));

        } else {

            res.send(result);
        }


    })
})



//user注册 api
app.post('/adduser', async (req, res) => {

    //用户注册时带的默认信息
    let _data = {
        username: req.body.username || '',
        password: req.body.password || "",
        balance: '1000',    //余额
        youB: '999999', //悠币
        address: '',    //地址
        Voucher: 3,  //优惠券
        phone: '',  //手机号
        nick: '',  //昵称
        gender: 1,  //1 男 2女
        birthday: "2018/7/17"  //生日

    }

    let user = {
        username: req.body.username,
        password: req.body.password
    }
    //console.log('username===>' + user.username);

    let result = await db.select('users', { username: user.username });
    //console.log("add result==>" + JSON.stringify(result));

    if (result.status) {

        res.send(apiResult(false, {}, "用户已经存在！"));

    } else {
        let addresult = await db.insert('users', _data);




        if (addresult.status) {

            let token = jwt.sign(user, secret, { 'expiresIn': 60 * 60 * 24 * 30 });

            //console.log("addresult token ok====>" + addresult.status);

            res.send(apiResult(true, { username: user.username, token: token }));
        }
    }
    res.send(apiResult(false, user, "我ye不知道的异常"));

})

// 购物车
app.post("/buycart", filter, async (req, res) => {
    // res.send(req.body)
    let _data = {
        username: req.body.username,
        SpCart: JSON.parse(req.body.SpCart),
    }

    let oldData = await db.select('buycart', { username: req.body.username });

    //console.log(oldData)
    if (oldData.status) {

        let dataset = oldData.data;
        dataset[0].SpCart = _data.SpCart;
        let _id = new ObjectID(dataset[0]['_id'])

        //更新商品数据
        let newData = await db.updata('buycart', { _id }, dataset[0]);
        //console.log(newData)
        res.send(_data);

    } else {

        let newData = await db.insert('buycart', _data)
        res.send(newData);
    }
    res.send(_data);
})
// ---end

//订单（支付或未支付）
app.post("/order", filter, async (req, res) => {
    // res.send(req.body)
    let _data = {
        username: req.body.username,
        SpCart: JSON.parse(req.body.SpCart),
        status: true
    }

    let oldData = await db.select('order', { username: req.body.username });

    //console.log(oldData)
    if (oldData.status) {

        let dataset = oldData.data;
        dataset[0].SpCart = _data.SpCart;
        let _id = new ObjectID(dataset[0]['_id'])

        //更新商品数据
        let newData = await db.updata('order', { _id }, dataset[0]);
        //console.log(newData)
        res.send(_data);

    } else {

        let newData = await db.insert('order', _data)
        res.send(newData);
    }
    res.send();
})
//--end

// 账户余额悠币
app.post("/balance", filter, (req, res) => {

    db.select('users', { username: req.body.username }).then((result) => {
        var _data = {
            youB: result.data[0].youB,
            balance: result.data[0].balance,
            Voucher: result.data[0].Voucher,
        }
        res.send(_data);
    })


})


//水果
app.post("/goodslist", (req, res) => {

    let _data = {};

    if (req.body.CommodityTag) {

        _data = { CommodityTag: req.body.CommodityTag - 0 };
    }


    //根据标识返回数据 goodslist
    db.select('goodsData', _data).then((result) => {

        //console.log(_data);

        res.send(result);
    })
    // res.send(_data);
})


//meat_goodsData
app.post("/meat_goodsData", async (req, res) => {

    let _data = {};

    if (req.body.CommodityTag) {

        _data = { CommodityTag: req.body.CommodityTag - 0 };
    }

    //根据标识返回数据 goodslist
    let result = await db.select('meat_goodsData', _data)

    res.send(result);
})


// 主页商品列表
app.post("/indx_goods", async (req, res) => {

    let f_result = await db.sortDB("home_goods", {}, { "floor": -1 });

    let result = await db.select('home_goods', );

    res.send(apiResult(true, result.data, { floor: f_result.data[0].floor }));

})

//paixu
//db.home_goods.find({},{"floor":1,_id:0}).sort({"likes":-1})
app.post("/paixu", async (req, res) => {
    // let result = await db.select("home_goods").find({}, { "floor": 1, _id: 0 }).sort({ "floor": -1 })

    let _data = req.body

    //价格 1低到高 { "SellPrice": -1 }
    let result = await db.sortDB("goodsData", {}, _data)
    // //销量 1低到高 
    // let result = await db.sortDB("goodsData", {}, { "sales": -1 })

    res.send(result)
})



// 分类
app.post("/kinds", (req, res) => {

    db.select('kinds').then((result) => {
        //console.log(result);

        result.data[0]._id ? delete result.data[0]._id : res.send(result);

        res.send(result);
    })
})

app.listen(1000);