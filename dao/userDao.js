/**
 * Created by admin on 2016/4/19.
 */
// dao/userDao.js
// 实现与MySQL交互
var mysql = require('mysql');
var $conf = require('../conf/db');
var $util = require('../util/util');
var $sql = require('./userSqlMapping');

// 使用连接池，提升性能
var pool  = mysql.createPool($util.extend({}, $conf.mysql));

// 向前台返回JSON方法的简单封装
var jsonWrite = function (res, ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code:'1',
            msg: '操作失败'
        });
    } else {
        res.json(ret);
    }
};

module.exports = {
    verify:function (req, res, next) {
        pool.getConnection(function(err, connection) {
            // 获取前台页面传过来的参数
            var param = req.body;

            //验证账户密码
            //verify:'SELECT * FROM manager WHERE id=? AND password=?'
            connection.query($sql.verify, [param.id, param.password], function(err, result){
                if(result != '' ){
                    var info = {
                        status : 1,
                        name : result[0].name,
                        tel : result[0].tel
                    }
                }
                else {
                    var info = {
                        status : 0,
                        name : null,
                        tel : null
                    }
                }

                // 释放连接
                connection.release();
                next(info, res, next);
            })
        });
    },

    insertBookOne: function (req, res, next) {
        pool.getConnection(function(err, connection) {
            // 获取前台页面传过来的参数
            var param = req.body;

            // 建立连接，向表中插入值
            // 'INSERT INTO book(bno, category, title, press, year, author, price, total, stock) VALUES(?,?,?,?,?,?,?,?,?)',
            connection.query($sql.insertBook, [param.book_bno, param.book_category, param.book_title, param.book_press, param.book_year, param.book_author, param.book_price, param.book_total, param.book_stock], function(err, result) {
                if(result) {
                    result = {
                        code: 200,
                        msg:'图书入库成功'
                    };
                }

                // 释放连接
                connection.release();
                next(req, res, next);
            });
        });
    },

    insertBookEach: function (data) {
        pool.getConnection(function(err, connection) {

            // 建立连接，向表中插入值
            // 'INSERT INTO book(bno, category, title, press, year, author, price, total, stock) VALUES(?,?,?,?,?,?,?,?,?)',
            connection.query($sql.insertBook, [data.bno, data.category, data.title, data.press, data.year, data.author, data.price, data.total, data.stock], function(err, result) {
                if(result) {
                    result = {
                        code: 200,
                        msg:'图书入库成功'
                    };
                }

                // 释放连接
                connection.release();
            });
        });
    },

    selectBook: function (req, res, next) {
        pool.getConnection(function(err, connection) {
            // 获取前台页面传过来的参数
            var param = req.body;

            var ifBook_bno = (param.book_bno == '')? 1 : 0;
            var ifBook_category = (param.book_category == '')? 1 : 0;
            var ifBook_title = (param.book_title == '')? 1 : 0;
            var ifBook_press = (param.book_press == '')? 1 : 0;
            var ifBook_year = (param.book_year == '')? 1 : 0;
            var ifBook_author = (param.book_author == '')? 1 : 0;
            var ifBook_price = (param.book_price == '')? 1 : 0;
            var ifBook_total = (param.book_total == '')? 1 : 0;
            var ifBook_stock = (param.book_stock == '')? 1 : 0;

            // 建立连接，向表中插入值
            // 'SELECT * FROM book WHERE (? OR bno=?) AND (? OR category=?) AND (? OR title=?) AND (? OR press=?) AND (? OR year=?) AND (? OR author=?) AND (? OR price=?) AND (? OR total=?) AND (? OR stock=?) ORDER BY ? ?',
            connection.query($sql.selectBook,
                [ifBook_bno, param.book_bno,
                ifBook_category, param.book_category,
                ifBook_title, param.book_title,
                ifBook_press, param.book_press,
                ifBook_year, param.book_year,
                ifBook_author, param.book_author,
                ifBook_price, param.book_price,
                ifBook_total, param.total,
                ifBook_stock, param.stock,
                param.select_order, param.AD],
                function(err, result) {

                    // 释放连接
                     connection.release();
                    console.log(result);

                    next(result, res, next);
            });
        });
    },

    cardBook: function (req, res, next) {
        pool.getConnection(function(err, connection) {
            // 获取前台页面传过来的参数
            var param = req.body;

            // 建立连接，向表中插入值
            // 'SELECT * FROM book WHERE bno IN (SELECT bno FROM borrow WHERE cno=? and return_date=null)',
            connection.query($sql.cardBook, [param.card_cno],
                function(err, result) {
                    // 释放连接
                    connection.release();
                    next(result, param.card_cno, res, next);
                });
        });
    },

    insertCard: function (req, res, next) {
        pool.getConnection(function(err, connection) {
            // 获取前台页面传过来的参数
            var param = req.body;

            // 建立连接，向表中插入值
            // 'INSERT INTO card(cno, name, department, type) VALUES(?,?,?,?)',
            connection.query($sql.insertCard, [param.card_cno, param.card_name, param.card_department, param.card_type], function(err, result) {
                if(result) {
                    result = {
                        code: 200,
                        msg:'借书证增加成功'
                    };
                }

                // 释放连接
                connection.release();
                next(req, res, next);
            });
        });
    },

    deleteCard: function (req, res, next) {
        pool.getConnection(function(err, connection) {
            // 获取前台页面传过来的参数
            var param = req.body;

            // 建立连接，向表中插入值
            // 'DELETE FROM card WHERE cno=?',
            connection.query($sql.deleteCard, [param.card_cno], function(err, result) {
                if(result) {
                    result = {
                        code: 200,
                        msg:'图书删除成功'
                    };
                }

                // 释放连接
                connection.release();
                next(req, res, next);
            });
        });
    },

    ifCanBorrow: function(req, res, next) {
        pool.getConnection(function (err, connection) {
            // 获取前台页面传过来的参数
            var param = req.body;

            // 建立连接，向表中插入值
            // 'SELECT stock FROM book WHERE bno=?',
            connection.query($sql.ifCanBorrow, [param.book_bno], function(err, result) {
                if(result == '')//没有bno
                {
                    flag = -1;
                }
                else if(result[0].stock > 0)//有余量
                {
                    flag = 1;
                }
                else
                {
                    flag = 0;
                }

                // 释放连接
                connection.release();
                next(req, flag, res, next);
            });
        });
    },

    cannotBorrow: function(req, res, next) {
        pool.getConnection(function (err, connection) {
            // 获取前台页面传过来的参数
            var param = req.body;

            // 建立连接，向表中插入值
            // 'SELECT MIN(return_date) FROM borrow WHERE bno=?',
            connection.query($sql.cannotBorrow, [param.book_bno], function(err, result) {

                // 释放连接
                connection.release();
                next(req, res, result, next);
            });
        });
    },

    borrow: function(req, res, next) {
        pool.getConnection(function (err, connection) {
            // 获取前台页面传过来的参数
            var param = req.body;

            // 建立连接，向表中插入值
            // 'INSERT INTO borrow(cno, bno, borrow_date,return_date, operator_id) VALUES(?,?,now(),date_add(now(), interval 2 month),?)',
            connection.query($sql.borrow, [param.card_cno, param.book_bno, param.operator_id], function(err, result) {

                // 释放连接
                connection.release();
                next(req, res, err, next);
            });
        });
    },

    ifCanReturn: function(req, res, next) {
        pool.getConnection(function (err, connection) {
            // 获取前台页面传过来的参数
            var param = req.body;

            // 建立连接，向表中插入值
            // 'SELECT * FROM borrow WHERE bno=? and cno=?',
            connection.query($sql.ifCanReturn, [param.book_bno, param.card_cno], function(err, result) {
                console.log(result);
                if(result == '')//没有bno
                {
                    flag = 0;
                }
                else
                {
                    flag = 1;
                }

                // 释放连接
                connection.release();
                next(req, flag, res, next);
            });
        });
    },

    return: function(req, res, next) {
        pool.getConnection(function (err, connection) {
            // 获取前台页面传过来的参数
            var param = req.body;

            // 建立连接，向表中插入值
            // 'DELETE FROM borrow WHERE bno=? and cno=?',
            connection.query($sql.return, [param.book_bno, param.card_cno], function(err, result) {

                // 释放连接
                connection.release();
                next(req, res, err, next);
            });
        });
    }
};

