/*
 * 后台管理相关的请求响应路由
 * @Author: Cphayim 
 * @Date: 2017-04-21 22:26:25 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-04-30 19:24:05
 */

import express from 'express'
// 数据库连接模块
import { Discovery, Journal } from '../modules/db'
// 响应错误信息的模块

// 创建路由
const router = express.Router();

router.post('/discovery', (req, res) => {
    const discovery = new Discovery(req.body);
    discovery.save(function (err, data) {
        if (err) {
            res.send('失败');
        } else {
            res.send('成功');
        }
    })
});
router.post('/journal', (req, res) => {
    const journal = new Journal(req.body);
    journal.save(function (err, data) {
        if (err) {
            res.send('失败');
        } else {
            res.send('成功');
        }
    })
})

// 导出模块
export default router;