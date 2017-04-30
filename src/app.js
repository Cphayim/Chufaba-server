/*
 * 出发吧 服务器后端入口文件
 * @Author: Cphayim 
 * @Date: 2017-04-18 17:42:40 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-04-30 21:49:26
 */

import express from 'express'
import bodyParser from 'body-parser'
// 路由模块
import manage from './routers/manage'
import product from './routers/product'
import user from './routers/user'

const app = express();
// post 请求体处理
app.use(bodyParser.json());

// HTTP 跨域响应头
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    req.method == "OPTIONS" ? res.send(200) : next();
});

// 路由挂载
app.use('/admin', manage);
app.use('/product', product);
app.use('/user', user);

app.get('/', (req, res) => {
    // 301 重定向
    res.status(301).redirect('/admin');
});

// 端口监听
// 开发环境: 本地(127.0.0.1)3000端口直接访问
// 生产环境: 公网 ip:80/443 端口(或域名)访问，Nginx 反向代理 转发到 3000 端口
app.listen(3000, _ => console.log('Chufaba Server is Running.'));