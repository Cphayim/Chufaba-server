/*
 * 用户相关的请求响应路由
 * @Author: Cphayim 
 * @Date: 2017-04-21 21:23:45 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-04-30 21:35:55
 */

import express from 'express'
// 请求转发模块
import request from 'superagent'
// 数据库连接模块
import { User } from '../modules/db'
// 配置模块
import config from '../modules/config'
// 响应错误信息的模块
import errRes from '../modules/err-res'

// 创建路由
const router = express.Router();

// 短信验证码下发请求响应
/*
    测试: 暂时使用 get 请求，正式接入时改为 post
*/
router.get('/sms', [phoneValidator,repeatabilityValidator], (req, res) => {
    // 生成6位验证码
    let verificationCode = '';
    // 随机数 -> 字符串 -> 字符串长度补全 方案 (ES6 API, Babel 无法转换 padStart)
    // verificationCode = Math.floor(Math.random() * 1000000).toString().padStart(6,'0');
    // 拼接 方案 (兼容)
    for (let i = 0; i < 6; i++) {
        verificationCode += Math.floor(Math.random() * 10).toString();
    }
    // 服务器端转发请求通知短信验证服务器下发短信验证码
    request
        .post('https://sms.yunpian.com/v2/sms/single_send.json')
        // 请求头设置
        // .set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
        .type('form')
        .send({
            apikey: config.SMS_APIKEY, // 短信验证服务器 developer apikey
            // mobile: req.body.phone, // 目标手机号码
            mobile: req.query.phone, // 测试用 get 请求
            text: `【${config.APP_NAME}】您的验证码是${verificationCode}。如非本人操作，请忽略本短信` // 短信模板
        }).end((err, data) => {
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
    const phoneRegexp = /^(13|14|15|18)[0-9]{9}$/;
    // const phone = req.body.phone;
    const phone = req.query.phone; // 处理测试用 get 请求参数
    // 通过验证？回调下一个检测流函数：返回未通过验证的响应
    phoneRegexp.test(phone) ? next() : res.status(200).json({
        code: 'err_phone',
        msg: 'phone number format invalid'
    });
}
// 查重 (用于注册表单响应)
function repeatabilityValidator(req, res, next) {
    const phone = req.body.phone;
    // 数据库查询
    User.findOne({ phone }).then(data => {
        !data ? next() : res.status(200).json({
            code: 'err_repeat',
            msg: 'phone number repeat'
        })
    }).catch(err => {
        errRes.dbQueryErr(err);
    });
}

// 密码 md5 验证 (验证前端发送过来的密码是否使用了 32位 md5加密)
function md5Validator(req, res, next) {
    // 判断请求的表单数据密码是否 为32位 hash
    const md5Regexp = /^[0-9a-z]{32}$/;
    const password = req.body.password;
    md5Regexp.test(password) ? next() : res.status(200).json({
        code: 'err_md5',
        msg: 'password md5 invalid'
    });
}


// 导出模块
export default router;