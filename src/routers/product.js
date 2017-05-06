/*
 * 产品相关的请求响应路由
 * @Author: Cphayim 
 * @Date: 2017-04-21 20:56:29 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-05-01 22:28:38
 */

import express from 'express'
// 数据库连接模块
import { Discovery, Journal, Market } from '../modules/db'
// 响应错误信息的模块
import errRes from '../modules/err-res'

// 创建路由
const router = express.Router();

// 精选列表 Discovery 数据响应
router.get('/good-list', (req, res) => {
    // 查询点索引
    const current = req.query.current ? parseInt(req.query.current) : 0;
    // 查询长度
    const offset = req.query.offset ? parseInt(req.query.offset) : 10;
    // 不返回数据库主键'_id',根据辅键'id'降序查找，
    // 返回查询结果中索引从 current 到 current+offset 的条目
    Discovery.find({}, {_id: 0})
    .sort({id: -1})
    .skip(current)
    .limit(offset).then(data => {
        res.status(200).json({
            mess: 'success',
            code: 'ok',
            items: data
        });
    }).catch(err => errRes.dbQueryErr(res));
});

// 精选详情 Journal 数据响应
router.get('/good-detail',(req,res)=>{
    // 查询索引 id
    const id = req.query.id;
    Journal.findOne({id},{_id:0}).then(data => {
        res.status(200).json({
            mess: 'success',
            code: 'ok',
            detailData: data
        });
    }).catch(err => errRes.dbQueryErr(res));
});

// 购买列表 数据响应
router.get('/market',(req,res)=>{
    Market.findOne({}, {_id: 0}).then(data => {
        res.status(200).json({
            mess: 'success',
            code: 'ok',
            marketData: data
        });
    }).catch(err => errRes.dbQueryErr(res));
});

// 导出模块
export default router;