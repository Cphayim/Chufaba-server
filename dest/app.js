'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _manage = require('./routers/manage');

var _manage2 = _interopRequireDefault(_manage);

var _product = require('./routers/product');

var _product2 = _interopRequireDefault(_product);

var _user = require('./routers/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
// post 请求体处理

// 路由模块
/*
 * 出发吧 服务器后端入口文件
 * @Author: Cphayim 
 * @Date: 2017-04-18 17:42:40 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-04-30 21:49:26
 */

app.use(_bodyParser2.default.json());

// HTTP 跨域响应头
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    req.method == "OPTIONS" ? res.send(200) : next();
});

// 路由挂载
app.use('/admin', _manage2.default);
app.use('/product', _product2.default);
app.use('/user', _user2.default);

app.get('/', function (req, res) {
    // 301 重定向
    res.status(301).redirect('/admin');
});

// 端口监听
// 开发环境: 本地(127.0.0.1)3000端口直接访问
// 生产环境: 公网 ip:80/443 端口(或域名)访问，Nginx 反向代理 转发到 3000 端口
app.listen(3000, function (_) {
    return console.log('Chufaba Server is Running.');
});