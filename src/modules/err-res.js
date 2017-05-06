/*
 * 错误 响应模块
 * @Author: Cphayim 
 * @Date: 2017-04-30 21:21:24 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-05-03 23:46:03
 */

// 异常响应类，只包含响应方法
class ErrRes {
    // 数据库查询失败
    dbQueryErr(res){
        res.status(200).json({
            code:'err_db_query',
            msg:'database query failed'
        });
    }
    // 数据库写入失败
    dbWriteErr(res){
        res.status(200).json({
            code:'err_db_write',
            msg:'database write failed'
        });
    }
}

export default new ErrRes