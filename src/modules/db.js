/*
 * 数据库配置模块
 * 数据库连接、集合结构Schema、集合Model实例导出
 * @Author: Cphayim 
 * @Date: 2017-04-21 20:28:21 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-04-30 19:33:35
 */
import mongoose from 'mongoose'

mongoose.Promise = Promise;
const DB_PROTOCOL = 'mongodb',  // 协议
    DB_HOST = '127.0.0.1', // 主机名
    DB_PORT = '27017', // 端口号
    DB_NAME = 'chufaba', // 数据库名
    DB_ACCOUNT = '', // 数据库账号
    DB_PASS = '', // 数据库密码
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

// 用户 数据集合结构
const userSchema = new Schema({
    phone: Number,
    username: String,
    password: String,
    pass_salt: String,
    user_token: String
}, {
    versionKey: false,
    collection: 'user'
});
const User = mongoose.model('User', userSchema);

// 连接状态监听
mongoose.connection.on('connected', _ => {
    console.log(`chufaba mongodb connected, port: ${DB_PORT}`);
}).on('error', _ => {
    console.log(`chufaba mongodb failed, port: ${DB_PORT}`);
}).on('disconnected', _ => {
    console.log(`chufaba mongodb disconnected, port: ${DB_PORT}`);
});;

// 模块导出
export {
    Discovery, // 精选列表
    Journal, // 精选详情
    User //用户
};