'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SMS = exports.User = exports.Market = exports.Journal = exports.Discovery = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.Promise = Promise; /*
                                       * 数据库配置模块
                                       * 数据库连接、集合结构Schema、集合Model实例导出
                                       * @Author: Cphayim 
                                       * @Date: 2017-04-21 20:28:21 
                                       * @Last Modified by: Cphayim
                                       * @Last Modified time: 2017-05-08 22:53:05
                                       */

var DB_PROTOCOL = 'mongodb',
    // 协议
DB_HOST = '127.0.0.1',
    // 主机名
DB_PORT = '27017',
    // 端口号
DB_NAME = 'chufaba',
    // 数据库名
DB_ACCOUNT = 'cfbworker',
    // 数据库账号
DB_PASS = '123456',
    // 数据库密码
// 是否使用 Auth 模式的 URL 
DB_URL = DB_ACCOUNT && DB_PASS ? DB_PROTOCOL + '://' + DB_ACCOUNT + ':' + DB_PASS + '@' + DB_HOST + ':' + DB_PORT + '/' + DB_NAME : DB_PROTOCOL + '://' + DB_HOST + ':' + DB_PORT + '/' + DB_NAME;

// 连接数据库
_mongoose2.default.connect(DB_URL);

// 数据库结构映射类
var Schema = _mongoose2.default.Schema;

// 实例化各数据映射对象
// 精选 数据集合结构
var discoverySchema = new Schema({
    avatar: String,
    background_image: String,
    destinations: String,
    hot: Number,
    id: Number,
    res_type: Number,
    title: String,
    url: String,
    user: String,
    user_id: Number,
    username: String,
    vip: Boolean
}, {
    versionKey: false,
    collection: 'discovery'
});
var Discovery = _mongoose2.default.model('Discovery', discoverySchema);
// 旅游日程 数据集合结构
var journalSchema = new Schema({
    avatar: String,
    average: String,
    background_image: String,
    comments: Number,
    compact: String,
    departure_date: String,
    destinations: Array,
    duration: Number,
    favs: Number,
    gowith: String,
    hot: Number,
    id: Number,
    intro: String,
    itinerary: Array,
    label: String,
    liked: Boolean,
    likes: Array,
    locations: Number,
    newest: Array,
    products: Boolean,
    summary: String,
    title: String,
    type: Number,
    url: String,
    user_id: Number,
    username: String,
    vip: Boolean
}, {
    versionKey: false,
    collection: 'journal'
});
var Journal = _mongoose2.default.model('Journal', journalSchema);

// 购买 数据集合结构
var marketSchema = new Schema({
    banners: Array,
    destinations: Array,
    products: Array
}, {
    versionKey: false,
    collection: 'market'
});
var Market = _mongoose2.default.model('Market', marketSchema);

// 用户 数据集合结构
var userSchema = new Schema({
    phone: String, // 手机号码, 辅键, 唯一
    password: String, // 密码 (前端MD5 -> 后端密码盐+MD5)
    password_salt: String, // 密码盐 (随机盐)
    username: String, // 用户名
    avatar: String, // 头像 URL 地址
    access_token: String, // 口令 (授权码)，cookie
    register_time: Number, // 注册时间戳，注册表单接口响应成功时的服务器时间
    last_time: Number, // 最后登录时间戳，最后一次提交登录表单的服务器时间
    permission: Number // 权限等级
}, {
    versionKey: false,
    collection: 'user'
});
var User = _mongoose2.default.model('User', userSchema);

// 验证码 数据集合结构
var smsSchema = new Schema({
    phone: String,
    vCode: String
}, {
    versionKey: false,
    collection: 'sms'
});
var SMS = _mongoose2.default.model('SMS', smsSchema);

// 连接状态监听
_mongoose2.default.connection.on('connected', function (_) {
    return console.log('chufaba mongodb connected, port: ' + DB_PORT);
}).on('error', function (_) {
    return console.log('chufaba mongodb failed, port: ' + DB_PORT);
}).on('disconnected', function (_) {
    return console.log('chufaba mongodb disconnected, port: ' + DB_PORT);
});

// 模块导出
exports.Discovery = Discovery;
exports.Journal = Journal;
exports.Market = Market;
exports.User = User;
exports.SMS = SMS;
//# sourceMappingURL=db.js.map
