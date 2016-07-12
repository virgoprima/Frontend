var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('config');
var mysql = require('mysql');
var connection = require ('../condb.js');
var chat = require ('../chat.js');


router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true })); 


var login = 'admin';
var password = '12345';

var login1 = 'master';
var password2 = '56789';

   
// router.get('/', function(req, res, next) {
//     console.log("HELLO");
//     res.render('admin', { title: 'Регистрационная форма', logged: req.session.logged  });
// });

/*Использовать этот роутер, если что*/ 
router.get('/', function(req, res, next) {
    res.render('login', { title: 'Регистрационная форма', logged: req.session.logged });
    // res.render('admin', { logged: req.session.logged});
});

//});

router.get('/users', function(req, res, next) {
	connection.query("SELECT * FROM user", function(err, rows, fields) {
		if(err) throw err;
		var users = [];
		for (var i = 0; i < rows.length; i++) {
			users.push(rows[i]);
		}
        console.log(users);
		res.render('admin', {title: 'Зарегистрироваться', users: users});
	});
});



router.post('/login', function(req, res, next) {
    
    
    if (login == req.body.login && password == req.body.password ||login1 == req.body.login && password2 == req.body.password ) 
    {
       var sql = "INSERT into user(login, password, firstname, lastname, parentname, age ) VALUES ('"+ login   +"' ,'"+ password +"', 'bl' ,'a-bla','-bla',12)" ;
        connection.query(sql, function(err, rows, fields)

           {
            if(err) throw err;
            res.render('login', { title: 'Авторизация прошла успешно', logged: req.session.logged=true });
           });
    }
 else        {
        
	    res.render('admin', { title: 'Неверный логин и пароль', logged: req.session.logged });
	        }

	
        
});

// router.get('/exit', function(req, res, next) {
//     console.log("HELLO");
//     res.render('admin', { title: 'Регистрационная форма', logged: false });
// });
router.post('/login/exit', function(req, res, next) {
    if (req.session) {
        req.session.destroy(function() {});
    }
    res.redirect('/');
})


router.get('/index', function(req, res, next) {
    console.log("We are here");
   res.render('index', { title: 'Express' });
  
});

router.post('/ajaxservice/get', function(req, res, next) { 
var data = [{ "name": "Peter", "data": "bla-bla"} , { "name": "Vasiliy", "data": "ps..."}]; 
res.send(JSON.stringify(data)); 
console.log(data);
});


module.exports = router;



// для запроса "publish"
router.post('/publish', function(req, res, next){
    
    var body = '';
    req
      .on ('data', function () {
          body +=req.read();
      })
      .on ('end', function() {
         
     chat.publish(body.message);
     console.log("УРА! НЕ РАБОТАЕТ!");
     res.end("ok");
})
});
   



