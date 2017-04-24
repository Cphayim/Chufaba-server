'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _db = require('../modules/db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 响应错误信息的模块

// 创建路由
/*
 * 后台管理相关的请求响应路由
 * @Author: Cphayim 
 * @Date: 2017-04-21 22:26:25 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-04-21 23:37:20
 */

var router = _express2.default.Router();
// 数据库连接模块


router.post('/discovery', function (req, res) {
    var discovery = new _db2.default.Discovery(req.body);
    discovery.save(function (err, data) {
        if (err) {
            res.send('失败');
        } else {
            res.send('成功');
        }
    });
});
router.post('/journal', function (req, res) {
    var journal = new _db2.default.Journal(req.body);
    journal.save(function (err, data) {
        if (err) {
            res.send('失败');
        } else {
            res.send('成功');
        }
    });
});

// 导出模块
module.exports = router;