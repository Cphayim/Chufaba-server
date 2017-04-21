'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DB_PROTOCOL = 'mongodb'; /*
                              * 数据库配置模块
                              * @Author: Cphayim 
                              * @Date: 2017-04-21 20:28:21 
                              * @Last Modified by: Cphayim
                              * @Last Modified time: 2017-04-21 21:12:34
                              */

var DB_HOST = '127.0.0.1';
var DB_PORT = '27017';
var DB_NAME = 'chufaba';
var DB_ACCOUNT = '';
var DB_PASS = '';

var DB_URL = DB_ACCOUNT && DB_PASS ? DB_PROTOCOL + '://' + DB_ACCOUNT + ':' + DB_PASS + '@' + DB_HOST + ':' + DB_PORT + '/' + DB_NAME : DB_PROTOCOL + '://' + DB_HOST + ':' + DB_PORT + '/' + DB_NAME;

// 连接数据库
_mongoose2.default.connect(DB_URL);

// 连接状态监听
_mongoose2.default.connection.on('connected', function () {
    console.log('chufaba mongodb connected, port: ' + DB_PORT);
}).on('error', function () {
    console.log('chufaba mongodb failed, port: ' + DB_PORT);
}).on('disconnected', function () {
    console.log('chufaba mongodb disconnected, port: ' + DB_PORT);
});;

module.exports = {
    mongoose: _mongoose2.default
};