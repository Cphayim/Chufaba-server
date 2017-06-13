'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _db = require('../modules/db');

var _config = require('../modules/config');

var _config2 = _interopRequireDefault(_config);

var _md = require('../modules/md5');

var _errRes = require('../modules/err-res');

var _errRes2 = _interopRequireDefault(_errRes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * 随机码规范
 * password_salt    16位
 * access_token     32位
 */

// 创建路由

// MD5 算法模块

// 数据库连接模块

// 请求转发模块
var router = _express2.default.Router();
// 响应错误信息的模块

// 配置模块

// cookie 解析模块
/*
 * 用户相关的请求响应路由
 * @Author: Cphayim 
 * @Date: 2017-04-21 21:23:45 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-06-13 23:00:26
 */

router.use((0, _cookieParser2.default)());

// access_token 鉴权 [预处理管道: 手机格式验证]
router.post('/token', [phoneValidator], function (req, res) {
    _db.User.findOne(req.body).then(function (data) {
        if (data) {
            // 通过
            res.status(200).json({
                code: 1000,
                msg: 'auth passed'
            });
            // 更新最后登录时间
            var last_time = new Date().getTime();
            _db.User.update(data, {
                $set: {
                    last_time: last_time
                }
            }).then(function (_) {});
        } else {
            // 未通过
            res.status(200).json({
                code: 3030,
                msg: 'invalid access_token'
            });
        }
    }).catch(function (err) {
        return _errRes2.default.dbQueryErr(res);
    });
});

// 登录表单响应接口 [预处理管道: 手机格式验证、密码加密验证]
router.post('/login', [phoneValidator, md5Validator], function (req, res) {
    var formData = req.body;
    // 数据库查询
    _db.User.findOne({
        phone: formData.phone
    }).then(function (data) {
        // 没找到账号 (data:null)
        if (!data) {
            res.status(200).json({
                code: 3020,
                msg: 'this user is not found'
            });
            return;
        }
        // 密码校对( 数据库中的用户密码 === MD5(注册时生成的密码盐 + MD5(用户在前端表单输入的密码)) )
        if (data.password === (0, _md.MD5)(data.password_salt + formData.password)) {
            // 密码校验成功，调用 loginResponse，设置 access_token 并返回用户信息
            loginResponse(res, data);
        } else {
            // 返回密码错误
            res.status(200).json({
                code: 3021,
                msg: 'invalid password'
            });
        }
    }).catch(function (err) {
        return _errRes2.default.dbQueryErr(res);
    });
});

// 注册响应接口 [预处理管道: 手机号码验证、账号查重、密码加密验证]
router.post('/register', [phoneValidator, repeatabilityValidator, md5Validator, vCodeValidator], function (req, res) {
    // 删掉请求体中的验证码的属性
    delete req.body.vCode;
    var time = new Date().getTime();
    // 创建用户对象
    var userData = req.body;
    // 生成 16位 密码盐
    userData.password_salt = getRandomCode(16);
    // 密码盐 + 密码 => MD5加密
    userData.password = (0, _md.MD5)(userData.password_salt + userData.password);
    userData.avatar = '/avatar/default.png'; // 默认头像
    userData.register_time = time; // 注册时间戳
    userData.last_time = -1; // 最后登录时间戳
    userData.permission = 0; // 权限等级

    var user = new _db.User(userData);
    // 写入数据库
    user.save().then(function (data) {
        // 调用 loginResponse，设置 access_token 并返回用户信息
        loginResponse(res, data);
    }).catch(function (err) {
        return _errRes2.default.dbWriteErr(res);
    });
});

/**
 * 登录/注册接口公用，登录/注册成功后回调该函数
 * 生成 access_token(通行口令)
 * 返回登录成功的 json 包含用户基本信息
 * @param {Object} res 响应体对象
 * @param {Object} data 数据库用户数据
 */
function loginResponse(res, data) {
    // 生成 32位 access_token
    var access_token = getRandomCode(32);
    var last_time = new Date().getTime();
    // 更新数据库中的 access_token 和 登录时间
    _db.User.update(data, {
        $set: {
            access_token: access_token,
            last_time: last_time
        }
    }).then(function (_) {
        var expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        // 网页端设置 cookie (30天有效期) [app 端会跨域，无法使用 cookie]
        res.cookie('phone', data.phone, {
            expires: expires
        });
        res.cookie('access_token', access_token, {
            expires: expires
        });
        // 返回登录成功
        res.status(200).json({
            code: 1000,
            msg: 'auth passed',
            userInfo: {
                phone: data.phone,
                access_token: access_token,
                username: data.username,
                avatar: data.avatar
            }
        });
    }).catch(function (err) {
        return _errRes2.default.dbWriteErr(res);
    });
}

// 短信验证码下发请求响应 [预处理管道: 手机格式验证]
router.post('/sms', [phoneValidator], function (req, res) {
    // 构建延迟对象，若为注册验证码请求，则在查重后调用下面逻辑
    var defer = new Promise(function (resolve, reject) {
        // 判断是否来自注册表单? 是则进行账号查重
        if (req.body.r) {
            repeatabilityValidator(req, res, null, resolve);
        } else {
            resolve();
        }
    });
    defer.then(function (_) {
        var phone = req.body.phone;
        // 生成6位验证码
        var vCode = '';
        // 随机数取整 -> 字符串 -> 字符串长度补全 方案 (ES6 API, Babel 无法转换 padStart)
        // vCode = (~~(Math.random() * 1000000)).toString().padStart(6,'0');
        // 拼接 方案 (兼容)
        for (var i = 0; i < 6; i++) {
            vCode += (~~(Math.random() * 10)).toString();
        }
        // 服务器端转发请求到短信验证服务器下发短信验证码
        _superagent2.default.post('https://sms.yunpian.com/v2/sms/single_send.json')
        // 请求头设置
        // .set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
        .type('form').send({
            apikey: _config2.default.SMS_APIKEY, // 短信验证服务器 developer apikey
            mobile: phone, // 目标手机号码
            text: '\u3010' + _config2.default.APP_NAME + '\u3011\u60A8\u7684\u9A8C\u8BC1\u7801\u662F' + vCode + '\u3002\u5982\u975E\u672C\u4EBA\u64CD\u4F5C\uFF0C\u8BF7\u5FFD\u7565\u672C\u77ED\u4FE1' // 短信模板
        }).end(function (err, data) {
            if (data && data.body && data.body.code === 0) {
                // 临时存储，写入数据库
                // 查找有没有该用户的验证码记录？
                // 存在就更新这条记录，不存在则插入一条
                _db.SMS.findOne({
                    phone: phone
                }).then(function (data) {
                    if (data) {
                        // 更新数据
                        _db.SMS.update(data, {
                            $set: {
                                vCode: vCode
                            }
                        }).then(function (data) {
                            // 回调 sendSuccessResponse 函数
                            // 返回发送成功，并设置超时删除
                            sendSuccessResponse(res, {
                                phone: phone,
                                vCode: vCode
                            }, 10 * 60 * 1000);
                        }).catch(function (err) {
                            return _errRes2.default.dbWriteErr(res);
                        });
                    } else {
                        // 插入一条
                        var sms = new _db.SMS({
                            phone: phone,
                            vCode: vCode
                        });
                        sms.save().then(function (data) {
                            // 返回发送成功，并设置超时删除
                            sendSuccessResponse(res, {
                                phone: phone,
                                vCode: vCode
                            }, 10 * 60 * 1000);
                        }).catch(function (err) {
                            return _errRes2.default.dbWriteErr(res);
                        });
                    }
                }).catch(function (err) {
                    return _errRes2.default.dbQueryErr(res);
                });
            } else {
                // 发送失败
                res.status(200).json({
                    code: 3004,
                    msg: 'sent failed'
                });
            }
        });
    });
});
/**
 * 返回短信下发成功，并设置超时删除的定时器任务
 * @param {Object} queryObj 查询对象 
 * @param {Number} time 时长 
 */
function sendSuccessResponse(res, queryObj, time) {
    // 返回前端，短信下发成功
    res.status(200).json({
        code: 1000,
        msg: 'sent succeeded'
    });
    // 超时后，如果这条数据(根据vCode查找)还存在*就删除它
    // 若用户在超时范围内再次请求了验证码(更新了记录)，删除它的任务则应该交给下一个响应的定时器
    setTimeout(function (_) {
        _db.SMS.findObj(queryObj).then(function (data) {
            // 存在就删掉它
            data && _db.SMS.remove(data);
        });
    }, time);
}

/**
 * 数据检测流 
 * (下面的验证函数应在响应前按需添加到'请求处理管线')
 * 用于后端数据二次验证，防止用户绕过前端表单验证发送请求，导致脏数据进入数据库
 * 各环节未通过返回的参数说明
 * 手机号码格式验证未通过  {code: err_phone}
 * 手机号码重复注册       {code: err_repeat}
 * md5 验证未通过        {code: err_md5}
 */
// 手机号码格式验证
function phoneValidator(req, res, next) {
    var phoneRegexp = /^0?(13|15|17|18)[0-9]{9}$/;
    var phone = req.body.phone;
    // 通过验证？回调下一个检测流函数：返回未通过验证的响应
    phoneRegexp.test(phone) ? next() : res.status(200).json({
        code: 3001,
        msg: 'invalid phone number format'
    });
}
// 号码查重 (用于注册表单响应)
function repeatabilityValidator(req, res, next, resolve) {
    var phone = req.body.phone;
    // 数据库查询
    _db.User.findOne({
        phone: phone
    }).then(function (data) {
        // 是否没有数据? (是否传入 next 函数?回调下一个检测流函数:不处理): 返回号码重复
        !data ? next ? next() : '' : res.status(200).json({
            code: 3011,
            msg: 'repeat phone number'
        });
        resolve && !data && resolve();
    }).catch(function (err) {
        _errRes2.default.dbQueryErr(res);
    });
}
// 密码 md5 验证 (验证前端发送过来的密码是否使用了 32位 md5加密)
function md5Validator(req, res, next) {
    // 判断请求的表单数据密码是否 为32位 hash
    var md5Regexp = /^[0-9a-z]{32}$/;
    var password = req.body.password;
    md5Regexp.test(password) ? next() : res.status(200).json({
        code: 3003,
        msg: 'invalid password md5'
    });
}
// 短信验证码 验证
function vCodeValidator(req, res, next) {
    // 查找该验证码的记录
    _db.SMS.findOne({
        phone: req.body.phone,
        vCode: req.body.vCode
    }).then(function (data) {
        if (data) {
            next(); // 回调下一个检测流函数
        } else {
            res.status(200).json({
                code: 3005,
                msg: 'invalid vCode'
            });
        }
    }).catch(function (err) {
        return _errRes2.default.dbQueryErr(res);
    });
}

// 工具 函数
/**
 * 生成随机码
 * @param {Number} length 随机码长度
 * @returns 随机码字符串
 * getRandomCode(16) -> XGpU%FpjzV*7uSzP
 */
function getRandomCode(length) {
    var code = '';
    var chars = "~!@#$%^&*()_+,.?<>0123456789abcdefghijkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ";
    for (var i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// 导出模块
exports.default = router;
//# sourceMappingURL=user.js.map
