'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _db = require('../modules/db');

var _errRes = require('../modules/err-res');

var _errRes2 = _interopRequireDefault(_errRes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 创建路由

// 数据库连接模块
var router = _express2.default.Router();

// 精选列表 Discovery 数据响应

// 响应错误信息的模块
/*
 * 产品相关的请求响应路由
 * @Author: Cphayim 
 * @Date: 2017-04-21 20:56:29 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-05-01 22:28:38
 */

router.get('/good-list', function (req, res) {
    // 查询点索引
    var current = req.query.current ? parseInt(req.query.current) : 0;
    // 查询长度
    var offset = req.query.offset ? parseInt(req.query.offset) : 10;
    // 不返回数据库主键'_id',根据辅键'id'降序查找，
    // 返回查询结果中索引从 current 到 current+offset 的条目
    _db.Discovery.find({}, { _id: 0 }).sort({ id: -1 }).skip(current).limit(offset).then(function (data) {
        res.status(200).json({
            mess: 'success',
            code: 'ok',
            items: data
        });
    }).catch(function (err) {
        return _errRes2.default.dbQueryErr(res);
    });
});

// 精选详情 Journal 数据响应
router.get('/good-detail', function (req, res) {
    // 查询索引 id
    var id = req.query.id;
    _db.Journal.findOne({ id: id }, { _id: 0 }).then(function (data) {
        res.status(200).json({
            mess: 'success',
            code: 'ok',
            detailData: data
        });
    }).catch(function (err) {
        return _errRes2.default.dbQueryErr(res);
    });
});

// 购买列表 数据响应
router.get('/market', function (req, res) {
    _db.Market.findOne({}, { _id: 0 }).then(function (data) {
        res.status(200).json({
            mess: 'success',
            code: 'ok',
            marketData: data
        });
    }).catch(function (err) {
        return _errRes2.default.dbQueryErr(res);
    });
});

// 导出模块
exports.default = router;
//# sourceMappingURL=product.js.map
