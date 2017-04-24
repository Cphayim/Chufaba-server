'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.Promise = Promise; /*
                                       * 数据库配置模块
                                       * @Author: Cphayim 
                                       * @Date: 2017-04-21 20:28:21 
                                       * @Last Modified by: Cphayim
                                       * @Last Modified time: 2017-04-24 15:14:15
                                       */

var DB_PROTOCOL = 'mongodb';
var DB_HOST = '127.0.0.1';
var DB_PORT = '27017';
var DB_NAME = 'chufaba';
var DB_ACCOUNT = '';
var DB_PASS = '';
var DB_URL = DB_ACCOUNT && DB_PASS ? DB_PROTOCOL + '://' + DB_ACCOUNT + ':' + DB_PASS + '@' + DB_HOST + ':' + DB_PORT + '/' + DB_NAME : DB_PROTOCOL + '://' + DB_HOST + ':' + DB_PORT + '/' + DB_NAME;

// 连接数据库
_mongoose2.default.connect(DB_URL);

// 数据库结构映射类
var Schema = _mongoose2.default.Schema;

// 实例化各数据映射对象
// 精选 数据集合结构
var discoverySchema = new Schema({ avatar: String, background_image: String, destinations: String, hot: Number, id: Number, res_type: Number,
    title: String, url: String, user: String, user_id: Number, username: String, vip: Boolean }, { versionKey: false, collection: 'discovery' });
var Discovery = _mongoose2.default.model('Discovery', discoverySchema);
// 旅游日程 数据集合结构
var journalSchema = new Schema({ avatar: String, average: String, background_image: String, comments: Number,
    compact: String, departure_date: String, destinations: Array, duration: Number, favs: Number, gowith: String,
    hot: Number, id: Number, intro: String, itinerary: Array, label: String, liked: Boolean, likes: Array,
    locations: Number, newest: Array, products: Boolean, summary: String, title: String, type: Number,
    url: String, user_id: Number, username: String, vip: Boolean }, { versionKey: false, collection: 'journal' });
var Journal = _mongoose2.default.model('Journal', journalSchema);

// 连接状态监听
_mongoose2.default.connection.on('connected', function () {
    console.log('chufaba mongodb connected,  port: ' + DB_PORT);
}).on('error', function () {
    console.log('chufaba mongodb failed,  port: ' + DB_PORT);
}).on('disconnected', function () {
    console.log('chufaba mongodb disconnected,  port: ' + DB_PORT);
});;

module.exports = {
    Discovery: Discovery, Journal: Journal
};