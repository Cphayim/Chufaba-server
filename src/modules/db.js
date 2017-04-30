/*
 * 数据库配置模块
 * @Author: Cphayim 
 * @Date: 2017-04-21 20:28:21 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-04-30 19:09:17
 */
import mongoose from 'mongoose'

mongoose.Promise = Promise;
const DB_PROTOCOL = 'mongodb',
    DB_HOST = '127.0.0.1',
    DB_PORT = '27017',
    DB_NAME = 'chufaba',
    DB_ACCOUNT = '',
    DB_PASS = '',
    DB_URL = DB_ACCOUNT && DB_PASS ?
    `${DB_PROTOCOL}://${DB_ACCOUNT}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}` :
    `${DB_PROTOCOL}://${DB_HOST}:${DB_PORT}/${DB_NAME}`;

// 连接数据库
mongoose.connect(DB_URL);

// 数据库结构映射类
const Schema = mongoose.Schema;

// 实例化各数据映射对象
// 精选 数据集合结构
let discoverySchema = new Schema({
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
let Discovery = mongoose.model('Discovery', discoverySchema);
// 旅游日程 数据集合结构
let journalSchema = new Schema({
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
let Journal = mongoose.model('Journal', journalSchema);

// 用户 数据集合结构
let userSchema = new Schema({
    phone:Number,
    username:String,
    password:String,
    pass_salt:String,
    user_token:String
},{
    versionKey: false,
    collection: 'user'
});
let User = mongoose.model('User',userSchema);

// 连接状态监听
mongoose.connection.on('connected', () => {
    console.log(`chufaba mongodb connected,  port: ${DB_PORT}`);
}).on('error', () => {
    console.log(`chufaba mongodb failed,  port: ${DB_PORT}`);
}).on('disconnected', () => {
    console.log(`chufaba mongodb disconnected,  port: ${DB_PORT}`);
});;

export default {
    Discovery,
    Journal
};