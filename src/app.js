/*
 * 出发吧 服务器后端入口文件
 * @Author: Cphayim 
 * @Date: 2017-04-18 17:42:40 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-04-21 23:22:51
 */

import express from 'express'
import bodyParser from 'body-parser'
// 路由模块
import manage from './routers/manage'
import product from './routers/product'

const app = express();
// post 请求处理
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//     extends:false
// }));
app.use(express.static('www'));

// HTTP 跨域响应头
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    if (req.method == "OPTIONS") res.send(200);
    else next();
});

// 路由挂载
app.use('/admin', manage);
app.use('/product', product);

// 端口监听
app.listen(3000, () => console.log('Chufaba Server is Running.'));