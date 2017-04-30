/*
 * 用户相关的请求响应路由
 * @Author: Cphayim 
 * @Date: 2017-04-21 21:23:45 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-04-30 19:16:39
 */

import express from 'express'
// 请求转发模块
import request from 'superagent'
// 数据库连接模块
import DB from '../modules/db'
// 配置模块
import config from '../modules/config'
// 响应错误信息的模块

// 创建路由
const router = express.Router();


// 短信验证码下发请求响应
/*
    测试: 暂时使用 get 请求，正式接入时改为 post
*/
router.get('/sms', [phoneValid], (req, res) => {
    // 国内手机号码正则验证
    // 生成6位验证码
    let num = Math.floor(Math.random() * 1000000).toString();
    // 转发请求到短信验证服务器下发短信验证码
    request
        .post('https://sms.yunpian.com/v2/sms/single_send.json')
        // .set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
        .type('form')
        .send({
            apikey: config.SMS_APIKEY,
            mobile: req.query.phone,
            text: `【出发吧】您的验证码是${num}。如非本人操作，请忽略本短信`
        }).end(j => {
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
    const phoneRegexp = /^(13|14|15|18)[0-9]{9}$/;
    // const phone = req.body.phone;
    const phone = req.query.phone;
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
    const md5Regexp = /^[0-9a-z]{32}$/;
    const password = req.body.password;
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
export default router;