/**
 * Created by admin on 2016/4/19.
 */
// dao/userSqlMapping.js
// CRUD SQL语句
var user = {
    //登陆验证
    verify:'SELECT * FROM manager WHERE id=? AND password=?',
    //图书入库
    insertBook:'INSERT INTO book(bno, category, title, press, year, author, price, total, stock) VALUES(?,?,?,?,?,?,?,?,?)',
    //图书查询
    selectBook:'SELECT * FROM book WHERE (? OR bno=?) AND (? OR category=?) AND (? OR title=?) AND (? OR press=?) AND (? OR year=?) AND (? OR author=?) AND (? OR price=?) AND (? OR total=?) AND (? OR stock=?) ORDER BY ? ?',
    //借书还书
    cardBook:'SELECT * FROM book WHERE bno IN (SELECT bno FROM borrow WHERE cno=?)',
    //借
    ifCanBorrow:'SELECT stock FROM book WHERE bno=?',
    cannotBorrow:'SELECT MIN(return_date) AS minDate FROM borrow WHERE bno=? ',
    borrow:'INSERT INTO borrow(cno, bno, borrow_date,return_date, operator_id) VALUES(?,?,now(),date_add(now(), interval 2 month),?)',
    //还
    ifCanReturn:'SELECT * FROM borrow WHERE bno=? and cno=?',
    return:'DELETE FROM borrow WHERE bno=? and cno=?',
    //借书证管理
    insertCard:'INSERT INTO card(cno, name, department, type) VALUES(?,?,?,?)',
    deleteCard:'DELETE FROM card WHERE cno=?'
};

module.exports = user;
