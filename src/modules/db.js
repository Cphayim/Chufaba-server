/*
 * 数据库配置模块
 * 数据库连接、集合结构Schema、集合Model实例导出
 * @Author: Cphayim 
 * @Date: 2017-04-21 20:28:21 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-05-06 23:13:44
 */
import mongoose from 'mongoose'

mongoose.Promise = Promise;
const DB_PROTOCOL = 'mongodb', // 协议
    DB_HOST = '127.0.0.1', // 主机名
    DB_PORT = '27017', // 端口号
    DB_NAME = 'chufaba', // 数据库名
    DB_ACCOUNT = 'cfbworker', // 数据库账号
    DB_PASS = '123456', // 数据库密码
    // 是否使用 Auth 模式的 URL 
    DB_URL = DB_ACCOUNT && DB_PASS ?
    `${DB_PROTOCOL}://${DB_ACCOUNT}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}` :
    `${DB_PROTOCOL}://${DB_HOST}:${DB_PORT}/${DB_NAME}`;

// 连接数据库
mongoose.connect(DB_URL);

// 数据库结构映射类
const Schema = mongoose.Schema;

// 实例化各数据映射对象
// 精选 数据集合结构
const discoverySchema = new Schema({
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
const Discovery = mongoose.model('Discovery', discoverySchema);
// 旅游日程 数据集合结构
const journalSchema = new Schema({
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
const Journal = mongoose.model('Journal', journalSchema);

// 购买 数据集合结构
const marketSchema = new Schema({
    banners: Array,
    destinations: Array,
    products: Array
}, {
    versionKey: false,
    collection: 'market'
});
const Market = mongoose.model('Market', marketSchema);

// 用户 数据集合结构
const userSchema = new Schema({
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
const User = mongoose.model('User', userSchema);

// 验证码 数据集合结构
const smsSchema = new Schema({
    phone: String,
    vCode: String,
},{
    versionKey: false,
    collection: 'sms'
});
const SMS = mongoose.model('SMS', smsSchema);

// 连接状态监听
mongoose.connection
    .on('connected', _ => console.log(`chufaba mongodb connected, port: ${DB_PORT}`))
    .on('error', _ => console.log(`chufaba mongodb failed, port: ${DB_PORT}`))
    .on('disconnected', _ => console.log(`chufaba mongodb disconnected, port: ${DB_PORT}`));

// 模块导出
export {
    Discovery, // 精选列表
    Journal, // 精选详情
    Market, // 购买列表
    User, //用户
    SMS
};