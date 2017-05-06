/*
 * 用户相关的请求响应路由
 * @Author: Cphayim 
 * @Date: 2017-04-21 21:23:45 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-05-07 01:09:25
 */

import express from 'express'
// 请求转发模块
import request from 'superagent'
// cookie 解析模块
import cookieParser from 'cookie-parser'
// 数据库连接模块
import {
    User,
    SMS
} from '../modules/db'
// 配置模块
import config from '../modules/config'
// MD5 算法模块
import {
    MD5
} from '../modules/md5'
// 响应错误信息的模块
import errRes from '../modules/err-res'

/*
 * 随机码规范
 * password_salt    16位
 * access_token     32位
 */

// 创建路由
const router = express.Router();
router.use(cookieParser());

// 登录表单响应接口 [预处理管道: 手机格式验证、密码加密验证]
router.post('/login', [phoneValidator, md5Validator], (req, res) => {
    const formData = req.body;
    // 数据库查询
    User.findOne({
        phone: formData.phone
    }).then(data => {
        // 没找到账号 (data:null)
        if (!data) {
            res.status(200).json({
                code: 'fail',
                msg: 'this user is not found'
            });
            return;
        }
        // 密码校对( 数据库中的用户密码 === MD5(注册时生成的密码盐 + MD5(用户在前端表单输入的密码)) )
        if (data.password === MD5(data.password_salt + formData.password)) {
            // 密码校验成功，调用 loginResponse，设置 access_token 并返回用户信息
            loginResponse(res, data);
        } else {
            // 返回密码错误
            res.status(200).json({
                code: 'fail',
                msg: 'invalid password'
            })
        }
    }).catch(err => errRes.dbQueryErr(res));
});

// 注册表单响应接口 [预处理管道: 手机号码验证、账号查重、密码加密验证]
router.post('/register', [phoneValidator, repeatabilityValidator, md5Validator, vCodeValidator], (req, res) => {
    // 删掉请求体中的验证码的属性
    delete req.body.vCode;
    // 创建用户对象
    const time = new Date().getTime();
    const userData = req.body;
    // 生成 16位 密码盐
    userData.password_salt = getRandomCode(16);
    // 密码盐 + 密码 => MD5加密
    userData.password = MD5(userData.password_salt + userData.password);
    userData.avatar = '/avatar/default.jpg'; // 默认头像
    userData.register_time = time; // 注册时间戳
    userData.last_time = -1; // 最后登录时间戳
    userData.permission = 0; // 权限等级

    const user = new User(userData);
    // 写入数据库
    user.save().then(data => {
        // 调用 loginResponse，设置 access_token 并返回用户信息
        loginResponse(res, data);
    }).catch(err => errRes.dbWriteErr(res));
});

/**
 * 登录响应 (登录/注册接口公用，登录/注册成功后回调该函数)
 * 生成 access_token(通行口令) 写入 cookie
 * 返回登录成功的 json 包含用户基本信息
 * @param {Object} res 响应体对象
 * @param {Object} data 数据库用户数据
 */
function loginResponse(res, data) {
    // 生成 32位 access_token
    const access_token = getRandomCode(32);
    // 更新数据库中的 access_token (之前登录的设备下一次 token 鉴权将失败，需要重新登录)
    User.update(data, {
        $set: {
            access_token
        }
    }).then(_ => {
        const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        // 设置 cookie (30天有效期) [app 端会跨域，无法使用 cookie]
        res.cookie('phone', data.phone, {
            expires
        });
        res.cookie('access_token', access_token, {
            expires
        });
        // 返回登录成功
        res.status(200).json({
            code: 'ok',
            msg: 'auth passed',
            userInfo: {
                phone: data.phone,
                access_token,
                username: data.username,
                avatar: data.avatar
            }
        });
    }).catch(err => errRes.dbWriteErr(res));
}

// 短信验证码下发请求响应 [预处理管道: 手机格式验证]
router.post('/sms', [phoneValidator], (req, res) => {
    // 判断是否来自注册表单? 是则进行账号查重
    req.body.r && repeatabilityValidator(req, res);
    console.log(123);
    const phone = req.body.phone;
    // 生成6位验证码
    let vCode = '';
    // 随机数取整 -> 字符串 -> 字符串长度补全 方案 (ES6 API, Babel 无法转换 padStart)
    // vCode = (~~(Math.random() * 1000000)).toString().padStart(6,'0');
    // 拼接 方案 (兼容)
    for (let i = 0; i < 6; i++) {
        vCode += (~~(Math.random() * 10)).toString();
    }
    // 服务器端转发请求短信验证服务器下发短信验证码
    request
        .post('https://sms.yunpian.com/v2/sms/single_send.json')
        // 请求头设置
        // .set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
        .type('form')
        .send({
            apikey: config.SMS_APIKEY, // 短信验证服务器 developer apikey
            mobile: phone, // 目标手机号码
            text: `【${config.APP_NAME}】您的验证码是${vCode}。如非本人操作，请忽略本短信` // 短信模板
        }).end((err, data) => {
            if (data && data.body && data.body.code === 0) {
                // 临时存储，写入数据库
                // 查找有没有该用户的验证码记录？
                // 存在就更新这条记录，不存在则插入一条
                SMS.findOne({
                    phone
                }).then(data => {
                    if (data) {
                        // 更新数据
                        SMS.update(data, {
                            $set: {
                                vCode
                            }
                        }).then(data => {
                            // 返回发送成功，并设置超时删除
                            sendSuccessResponse(res, {
                                phone,
                                vCode
                            }, 10 * 60 * 1000);
                        }).catch(err => errRes.dbWriteErr(res));
                    } else {
                        // 插入一条
                        const sms = new SMS({
                            phone,
                            vCode
                        });
                        sms.save().then(data => {
                            // 返回发送成功，并设置超时删除
                            sendSuccessResponse(res, {
                                phone,
                                vCode
                            }, 10 * 60 * 1000);
                        }).catch(err => errRes.dbWriteErr(res));
                    }
                }).catch(err => errRes.dbQueryErr(res));
            } else {
                // 发送失败
                res.status(200).json({
                    code: 'err_sms',
                    msg: 'sent failed'
                });
            }
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
        code: 'ok',
        msg: 'sent succeeded'
    });
    // 超时后，如果这条数据(根据vCode查找)还存在*就删除它
    // 若用户在超时范围内再次请求了验证码(更新了记录)，删除它的任务则应该交给下一个响应的定时器
    setTimeout(_ => {
        SMS.findObj(queryObj).then(data => {
            // 存在就删掉它
            data && SMS.remove(data);
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
    const phoneRegexp = /^0?(13|14|15|18)[0-9]{9}$/;
    const phone = req.body.phone;
    // 通过验证？回调下一个检测流函数：返回未通过验证的响应
    phoneRegexp.test(phone) ? next() : res.status(200).json({
        code: 'phone',
        msg: 'invalid phone number format'
    });
}
// 号码查重 (用于注册表单响应)
function repeatabilityValidator(req, res, next) {
    const phone = req.body.phone;
    // 数据库查询
    User.findOne({
        phone
    }).then(data => {
        // 是否没有数据? 回调下一个检测流函数: 返回号码重复
        !data ? (next ? next() : '') : res.status(200).json({
            code: 'repeat',
            msg: 'repeat phone number'
        })
    }).catch(err => {
        errRes.dbQueryErr(res);
    });
}
// 密码 md5 验证 (验证前端发送过来的密码是否使用了 32位 md5加密)
function md5Validator(req, res, next) {
    // 判断请求的表单数据密码是否 为32位 hash
    const md5Regexp = /^[0-9a-z]{32}$/;
    const password = req.body.password;
    md5Regexp.test(password) ? next() : res.status(200).json({
        code: 'md5',
        msg: 'invalid password md5'
    });
}
// 短信验证码 验证
function vCodeValidator(req, res, next) {
    // 查找该验证码的记录
    SMS.findOne({
        phone: req.body.phone,
        vCode: req.body.vCode
    }).then(data => {
        if (data) {
            next(); // 回调下一个检测流函数
        } else {
            res.status(200).json({
                code: 'vCode',
                msg: 'invalid vCode'
            });
        }
    }).catch(err => errRes.dbQueryErr(res));
}


// 工具 函数
/**
 * 生成随机码
 * @param {Number} length 随机码长度
 * @returns 随机码字符串
 * getRandomCode(16) -> XGpU%FpjzV*7uSzP
 */
function getRandomCode(length) {
    let code = '';
    const chars = "~!@#$%^&*()_+,.?<>0123456789abcdefghijkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ";
    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// 导出模块
export default router;