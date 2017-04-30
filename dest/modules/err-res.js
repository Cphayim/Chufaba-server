'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * 错误 响应模块
 * @Author: Cphayim 
 * @Date: 2017-04-30 21:21:24 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-04-30 21:27:15
 */

var ErrRes = function () {
    function ErrRes() {
        _classCallCheck(this, ErrRes);
    }

    _createClass(ErrRes, [{
        key: 'dbQueryErr',

        // 数据库查询失败
        value: function dbQueryErr(res) {
            res.status(200).json({
                code: 'err_db_query',
                msg: 'database query failed'
            });
        }
        // 数据库写入失败

    }, {
        key: 'dbWriteErr',
        value: function dbWriteErr(res) {
            res.status(200).json({
                code: 'err_db_write',
                msg: 'database write failed'
            });
        }
    }]);

    return ErrRes;
}();

exports.default = new ErrRes();