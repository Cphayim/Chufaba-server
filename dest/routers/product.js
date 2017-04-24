'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _db = require('../modules/db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 响应错误信息的模块

// 创建路由
/*
 * 产品相关的请求响应路由
 * @Author: Cphayim 
 * @Date: 2017-04-21 20:56:29 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-04-24 16:04:22
 */

var router = _express2.default.Router();
// 数据库连接模块

router.get('/good', function (req, res) {
    console.log(req.query);
    // 查询点索引
    var current = req.query.current ? parseInt(req.query.current) : 0;
    // 查询长度
    var offset = req.query.offset ? parseInt(req.query.offset) : 10;

    // 不返回数据库主键'_id',根据辅键'id'倒序查找，
    // 返回查询结果的第current到offset条
    _db2.default.Discovery.find({}, {
        _id: 0
    }).sort({
        id: -1
    }).skip(current).limit(offset).then(function (data) {
        // console.log(data);
        res.status(200).json({
            mess: 'ok',
            code: true,
            items: data
        });
    }).catch(function (err) {
        res.status(200).json({
            mess: 'database find err',
            code: false
        });
    });
});

// 导出模块
module.exports = router;