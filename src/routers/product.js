/*
 * 产品相关的请求响应路由
 * @Author: Cphayim 
 * @Date: 2017-04-21 20:56:29 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-04-30 19:08:50
 */

import express from 'express'
// 数据库连接模块
import DB from '../modules/db'
// 响应错误信息的模块

// 创建路由
const router = express.Router();

// 精选列表数据响应
router.get('/good-list', (req, res) => {
    // 查询点索引
    const current = req.query.current ? parseInt(req.query.current) : 0;
    // 查询长度
    const offset = req.query.offset ? parseInt(req.query.offset) : 10;

    // 不返回数据库主键'_id',根据辅键'id'倒序查找，
    // 返回查询结果的第current到offset条
    DB.Discovery.find({}, {_id: 0})
    .sort({id: -1})
    .skip(current)
    .limit(offset).then(data => {
        res.status(200).json({
            mess: 'ok',
            code: true,
            items: data
        });
    }).catch(function (err) {
        res.status(200).json({
            mess: 'database find err',
            code: false,
        });
    });
});
// 精选详情数据响应
router.get('/good-detail',(req,res)=>{
    // 查询索引 id
    const id = req.query.id;
    DB.Journal.findOne({id},{_id:0}).then(data=>{
        res.status(200).json({
            mess: 'ok',
            code: true,
            detailData: data
        });
    }).catch(function (err) {
        res.status(200).json({
            mess: 'database find err',
            code: false,
        });
    });
});

// 导出模块
export default router;