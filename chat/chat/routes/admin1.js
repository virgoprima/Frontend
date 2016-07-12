// var express = require('express');
// var router = express.Router();
// var session = require('express-session');


// var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');


// router.use(bodyParser.json())
// router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


// router.get('/', function(req, res, next) {
    
    
// var sess = req.session
// if (sess.views) {
// console.log(sess.views++);
// res.setHeader('ContentType',
// 'text/html')
// //res.write('<p>views: ' + sess.views + '</p>')
// //res.write('<p>expires in: ' + (sess.cookie.maxAge / 1000) + 's</p>')
// res.end()
// } else {
// sess.views = 1
// res.render("admin", {auth: false, name: ""});
// console.log(req.session.id )
// }
    
// });
// // //под auth должна быть сессионная переменная
// module.exports = router;




// router.post('/', function (req, res) {
// console.log("HERE");


// var login = 'admin';
// 	password = '12345';

// var log = req.body.login;// то, что ввел поьзователь
// console.log('log '+log)
// var pas = req.body.pswd;// то, что ввел пользователь
// console.log('pas '+pas)

// if ((log ==="Peter")&&(pas==="1234"))
// {


// var crypto = require('crypto');
// var hash = crypto.createHash('md5')
// .update('log')
// .update('pas')
// .digest('hex')
// console.log('We sent '+hash);

// res.render("admin", {auth: true, name: "Now you can leave the page"});}

// else{res.render("admin", {auth: false, name: "Pls log in again"});}

// }


// );

// router.get('/', function(req, res, next) {
    
    
// var sess = req.session
// if (sess.views) {
// console.log(sess.views++);
// res.setHeader('ContentType',
// 'text/html')
// //res.write('<p>views: ' + sess.views + '</p>')
// //res.write('<p>expires in: ' + (sess.cookie.maxAge / 1000) + 's</p>')
// res.end()
// } else {
// sess.views = 1
// res.render("admin", {auth: false, name: ""});
// console.log(req.session.id )
// }
    
// });
var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var session = require('express-session');

/* Registered users listing. */
    var login = 'admin';
	var password = '12345';
    //var log = req.body.login;// то, что ввел поьзователь
//var pas = req.body.password;// то, что ввел пользователь

/* GET users listing. */
router.get('/', function(req, res, next) {
	var sess = req.session;
    var hash = crypto.createHash('md5')
					.update(req.body.login)
					.update(req.body.password)
					.digest('hex');
    res.cookie('authId', hash, { maxAge: 900000, httpOnly: true });
	//console.log(req);
	 if (req.cookies.authId == hash) {
	res.render('admin', { title: 'Приветствие', login: login, logged: true });
	} else {
		res.render('admin', { title: 'Регистрационная форма', logged: false });
	}
});


router.post('/', function(req, res, next) {
	var sess = req.session;
	//console.log(req);
	var hash = crypto.createHash('md5')
					.update(req.body.login)
					.update(req.body.password)
					.digest('hex');

	if (hash == crypto.createHash('md5').update('login').update('password').digest('hex')) {
		res.cookie('authId', hash, { maxAge: 900000, httpOnly: true });
		res.render('admin', { title: 'Приветствие', login: req.body.login, logged: true });
	} else {
		// res.cookie('authId', false);
		res.render('admin', { title: 'Ошибка авторизации', logged: false });
	}
	
 	// res.send('key = ' + req.key + ', value = ' + req.value);
});



module.exports = router;