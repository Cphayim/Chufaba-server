'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _db = require('../modules/db');

var _db2 = _interopRequireDefault(_db);

var _config = require('../modules/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 响应错误信息的模块

// 创建路由

// 数据库连接模块
/*
 * 用户相关的请求响应路由
 * @Author: Cphayim 
 * @Date: 2017-04-21 21:23:45 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-04-30 19:16:39
 */

var router = _express2.default.Router();

// 短信验证码下发请求响应
/*
    测试: 暂时使用 get 请求，正式接入时改为 post
*/

// 配置模块

// 请求转发模块
router.get('/sms', [phoneValid], function (req, res) {
    // 国内手机号码正则验证
    // 生成6位验证码
    var num = Math.floor(Math.random() * 1000000).toString();
    // 转发请求到短信验证服务器下发短信验证码
    _superagent2.default.post('https://sms.yunpian.com/v2/sms/single_send.json')
    // .set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
    .type('form').send({
        apikey: _config2.default.SMS_APIKEY,
        mobile: req.query.phone,
        text: '\u3010\u51FA\u53D1\u5427\u3011\u60A8\u7684\u9A8C\u8BC1\u7801\u662F' + num + '\u3002\u5982\u975E\u672C\u4EBA\u64CD\u4F5C\uFF0C\u8BF7\u5FFD\u7565\u672C\u77ED\u4FE1'
    }).end(function (j) {
        console.log(j);
        res.json({
            code: 1,
            mess: '验证码下发成功'
        });
    });
});

/**
 * 脏数据检测流
 * 
 * 各环节未通过返回的参数说明
 * 手机号码格式验证未通过  {code: err_phone}
 * md5 验证未通过        {code: err_md5}
 */

// 手机号码格式验证
function phoneValid(req, res, next) {
    var phoneRegexp = /^(13|14|15|18)[0-9]{9}$/;
    // const phone = req.body.phone;
    var phone = req.query.phone;
    console.log(req);
    if (!phoneRegexp.test(phone)) {
        res.json({
            code: 'err_md5',
            mess: 'phone format is invalid'
        });
        console.log(0);
    } else {
        console.log(1);
        next();
    }
}

// 密码 md5 验证
function md5Valid(req, res, next) {
    // 判断请求的表单数据密码是否 为32位 hash
    var md5Regexp = /^[0-9a-z]{32}$/;
    var password = req.body.password;
    // const flag = ;
    if (!md5Regexp.test(password)) {
        res.json({
            code: 'err_md5',
            mess: 'password md5 is invalid'
        });
    } else {
        next();
    }
}

// 导出模块
exports.default = router;