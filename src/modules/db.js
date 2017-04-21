/*
 * 数据库配置模块
 * @Author: Cphayim 
 * @Date: 2017-04-21 20:28:21 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-04-21 21:12:34
 */

import mongoose from 'mongoose'

const DB_PROTOCOL = 'mongodb';
const DB_HOST = '127.0.0.1';
const DB_PORT = '27017';
const DB_NAME = 'chufaba';
const DB_ACCOUNT = '';
const DB_PASS = '';

const DB_URL = DB_ACCOUNT && DB_PASS ?
    `${DB_PROTOCOL}://${DB_ACCOUNT}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}` :
    `${DB_PROTOCOL}://${DB_HOST}:${DB_PORT}/${DB_NAME}`;

// 连接数据库
mongoose.connect(DB_URL);

// 连接状态监听
mongoose.connection.on('connected', () => {
    console.log(`chufaba mongodb connected, port: ${DB_PORT}`);
}).on('error', () => {
    console.log(`chufaba mongodb failed, port: ${DB_PORT}`);
}).on('disconnected', () => {
    console.log(`chufaba mongodb disconnected, port: ${DB_PORT}`);
});;

module.exports = {
    mongoose
};