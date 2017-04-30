'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _db = require('../modules/db');

var _config = require('../modules/config');

var _config2 = _interopRequireDefault(_config);

var _errRes = require('../modules/err-res');

var _errRes2 = _interopRequireDefault(_errRes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 创建路由

// 配置模块

// 请求转发模块
var router = _express2.default.Router();

// 短信验证码下发请求响应
/*
    测试: 暂时使用 get 请求，正式接入时改为 post
*/

// 响应错误信息的模块

// 数据库连接模块
/*
 * 用户相关的请求响应路由
 * @Author: Cphayim 
 * @Date: 2017-04-21 21:23:45 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-04-30 21:35:55
 */

router.get('/sms', [phoneValidator, repeatabilityValidator], function (req, res) {
    // 生成6位验证码
    var verificationCode = '';
    // 随机数 -> 字符串 -> 字符串长度补全 方案 (ES6 API, Babel 无法转换 padStart)
    // verificationCode = Math.floor(Math.random() * 1000000).toString().padStart(6,'0');
    // 拼接 方案 (兼容)
    for (var i = 0; i < 6; i++) {
        verificationCode += Math.floor(Math.random() * 10).toString();
    }
    // 服务器端转发请求通知短信验证服务器下发短信验证码
    _superagent2.default.post('https://sms.yunpian.com/v2/sms/single_send.json')
    // 请求头设置
    // .set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
    .type('form').send({
        apikey: _config2.default.SMS_APIKEY, // 短信验证服务器 developer apikey
        // mobile: req.body.phone, // 目标手机号码
        mobile: req.query.phone, // 测试用 get 请求
        text: '\u3010' + _config2.default.APP_NAME + '\u3011\u60A8\u7684\u9A8C\u8BC1\u7801\u662F' + verificationCode + '\u3002\u5982\u975E\u672C\u4EBA\u64CD\u4F5C\uFF0C\u8BF7\u5FFD\u7565\u672C\u77ED\u4FE1' // 短信模板
    }).end(function (err, data) {
        if (data && data.body && data.body.code === 0) {
            res.status(200).json({
                code: 'ok',
                msg: 'sent succeeded'
            });
        } else {
            res.status(200).json({
                code: 'err_sms',
                msg: 'sent failed'
            });
        }
    });
});

/**
 * 脏数据检测流 
 * (下面的验证函数应在响应前按需添加到'请求处理管线')
 * 用于后端数据二次验证，防止用户绕过前端表单验证发送请求，导致脏数据进入数据库
 * 各环节未通过返回的参数说明
 * 手机号码格式验证未通过  {code: err_phone}
 * 手机号码重复注册       {code: err_repeat}
 * md5 验证未通过        {code: err_md5}
 */

// 手机号码格式验证
function phoneValidator(req, res, next) {
    var phoneRegexp = /^(13|14|15|18)[0-9]{9}$/;
    // const phone = req.body.phone;
    var phone = req.query.phone; // 处理测试用 get 请求参数
    // 通过验证？回调下一个检测流函数：返回未通过验证的响应
    phoneRegexp.test(phone) ? next() : res.status(200).json({
        code: 'err_phone',
        msg: 'phone number format invalid'
    });
}
// 查重 (用于注册表单响应)
function repeatabilityValidator(req, res, next) {
    var phone = req.body.phone;
    // 数据库查询
    _db.User.findOne({ phone: phone }).then(function (data) {
        !data ? next() : res.status(200).json({
            code: 'err_repeat',
            msg: 'phone number repeat'
        });
    }).catch(function (err) {
        _errRes2.default.dbQueryErr(err);
    });
}

// 密码 md5 验证 (验证前端发送过来的密码是否使用了 32位 md5加密)
function md5Validator(req, res, next) {
    // 判断请求的表单数据密码是否 为32位 hash
    var md5Regexp = /^[0-9a-z]{32}$/;
    var password = req.body.password;
    md5Regexp.test(password) ? next() : res.status(200).json({
        code: 'err_md5',
        msg: 'password md5 invalid'
    });
}

// 导出模块
exports.default = router;