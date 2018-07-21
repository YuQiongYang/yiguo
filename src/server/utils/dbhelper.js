const mc = require('mongodb').MongoClient;
const apiResult = require('./apiResult');
var util = require("util")
let db;

mc.connect('mongodb://127.0.0.1:27017', {
    useNewUrlParser: true
}, (err, client) => {
    if (err) { console.log('the mongodb connect ------------') }
    db = client.db('yiguo');
})

module.exports = {
    //_condition  条件
    //_collection  集合名 
    //_data 数据
    async select(_collection, _condition = {}, type = "") {
        try {
            let result = await db.collection(_collection).find(_condition).toArray();
            return apiResult(result.length > 0, result);
        } catch (err) {
            return apiResult(false, err);
        }
    },
    //
    async insert(_collection, _data = {}) {
        try {
            let result = await db.collection(_collection).insert(_data);
            return apiResult(result.ops.length > 0, result)
        } catch (err) {
            return apiResult(false, err);
        }
    },
    //把整个文档更新
    async updata(_collection, _condition, _data) {
        try {
            // let result = await db.collection(_collection).update(_condition, _data);
            //更新单个文档
            let result = await db.collection(_collection).updateOne(_condition, { $set: _data });

            return apiResult(true, result);

        } catch (err) {

            return apiResult(false, err);
        }
    }
    ,
    // //-个文档单条记录更新
    // async updata(_collection, _condition, _data) {
    //     try {
    //         let result = await db.collection(_collection).update(_condition, _data).toArray();
    //         //更新单个文档
    //         // let result = await db.collection(_collection).updateOne(_condition, { $set: _data });

    //         // if (result.status) {

    //         //     console.log("updata===========>")

    //         //     let seekResult = await db.collection(_collection).find(_condition).toArray();

    //         //         return apiResult(true, seekResult);
    //         // }

    //         return apiResult(true, result);

    //     } catch (err) {

    //         return apiResult(false, err);
    //     }
    // },
    //
    async delete(_collection, _condition) {

        try {
            // new mc.
            let result = await db.collection(_collection).remove(_condition)
            console.log("delete==>" + result)
            return apiResult(true, result);
        } catch (err) {
            return apiResult(false, err);
        }

    },
    async sortDB(_collection, _data, _condition) {
        //db.home_goods.find({},{"floor":1,_id:0}).sort({"likes":-1})
        //_id:0 ==>不显示 id
        //_condition  { "likes": -1 }  按照likes 字段的值来排序; -1/1 是排序的方式

        try {

            let result = await db.collection(_collection).find(_data || {}).sort(_condition).toArray();

            return apiResult(true, result);

        } catch (err) {

            return apiResult(false, err);
        }

    },
    async limitPage(_collection, _start, _end) {
        // skip 跳过 _start , limit 读取多少条数据
        try {

            let result = await db.collection(_collection).find().skip(_start).limit(_end).toArray

            return apiResult(true, result);

        } catch (err) { return apiResult(false, err); }


    }
}