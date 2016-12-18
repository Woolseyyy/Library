var express = require('express');
var router = express.Router();
var userDao = require('../dao/userDao');
var fs = require('fs');

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '图书管理系统' });
});

router.post('/home',function(req, res, next){
  userDao.verify(req, res, function(info, res, next){
    res.render('home', {
      title : '图书管理系统',
      status : info.status,
      name : info.name,
      tel : info.tel
    });
  });
});

router.get('/insert', function(req, res, next) {
  res.render('insert', { title: '图书管理系统-图书入库' });
});

router.post('/insertDo', function(req, res, next){
  userDao.insertBookOne(req, res, function(req, res, next) {
    res.render('success', {
      title: 'success'
    });
  });
});

router.get('/select', function(req, res, next) {
  res.render('select', { title: '图书管理系统-图书查询' });
});

router.post('/selectDo', function(req, res, next){
  userDao.selectBook(req, res, function(result, res, next) {
    res.render('successSelect', {
      title: '查询结果',
      data : result
    });
  });
});

router.get('/manage', function(req, res, next){
  res.render('manage', { title : '图书管理系统-借书证管理'});
});

router.post('/insertCard', function(req, res, next){
  userDao.insertCard(req, res, function(req, res, next){
    res.render('success', { title : 'success' });
  });
});

router.post('/deleteCard', function(req, res, next){
  userDao.deleteCard(req, res, function(req, res, next){
    res.render('success', { title : 'success' });
  });
});

router.get('/test', function(req, res, next){
  fs.readFile('test.txt', function(err, data) {
    if(err){
      return console.error(err);
    }
    content = data.toString();
    info = JSON.parse(content);
    for (i=0; i < info.length; i++)
    {
      userDao.insertBookEach(info[i]);
    }
  });
});

router.get('/cardBorrow', function(req, res, next){
  res.render('cardBorrow', { title : '图书管理系统-借书'});
});

router.post('/cardBorrowCno', function(req, res, next){
  userDao.cardBook(req, res, function(result, card_cno,  res, next) {
    res.render('cardBorrowCno', {
      title: '查询结果',
      data : result,
      cno : card_cno
    });
  });
});

router.post('/borrowDo', function(req, res, next){
  userDao.ifCanBorrow(req, res, function(req, flag, res, next){
    if(flag == -1)
    {
      res.render('success', { title : '借书失败没有此书'});
    }
    else if(flag == 0)
    {
      userDao.cannotBorrow(req, res, function(req, res, result, next){
        res.render('noStock', {
          data : result[0].minDate,
          title : '该书无库存'
        });
      });
    }
    else
    {
      userDao.borrow(req, res, function(req, res, err, next){
        if(err)
        {
          res.render('success', {title:err});
        }
        else {
          res.render('success', {title: '借书成功'});
        }
      });
    }
  });
});

router.get('/cardReturn', function(req, res, next){
  res.render('cardReturn', { title : '图书管理系统-还书'});
});

router.post('/cardReturnCno', function(req, res, next){
  userDao.cardBook(req, res, function(result, card_cno,  res, next) {
    res.render('cardReturnCno', {
      title: '查询结果',
      data : result,
      cno : card_cno
    });
  });
});

router.post('/ReturnDo', function(req, res, next){
  userDao.ifCanReturn(req, res, function(req, flag, res, next){
    if(flag == 0)
    {
      res.render('success', { title : '还书失败您并没有借此书'});
    }
    else
    {
      userDao.return(req, res, function(req, res, err, next){
        if(err)
        {
          res.render('success', {title:err});
        }
        else {
          res.render('success', {title: '还书成功'});
        }
      });
    }
  });
});


module.exports = router;
