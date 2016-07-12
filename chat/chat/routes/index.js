var session = require('express-session');
var express = require('express');
var router = express.Router();

var app = express();
var bodyParser = require('body-parser');


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


/* GET home page. */
// router.get('/', function(req, res, next) {
//     console.log("We are here");
//    res.render('index', { title: 'Express' });
  
// }); 
//это надо раскомментировать для работы ajax

// router.get('/', function(req, res, next)
// { console.log("test is working");
//     // var sess = req.session
//     // if (sess.views) {
//     //     sess.views++
//     //     res.setHeader('Content-type', 'text/html')
//     //     res.write('<p>views: ' + sess.views + '</p>')
//     //     res.end()
//     // }
//     // else {
//     //     sess.views = 1
//     //     res.end('id' + req.session.id)
//     // }
// }
// )



// router.post('/ajaxservice/get', function(req, res, next) { 
// var data = [{ "name": "Peter", "data": "bla-bla"} , { "name": "Vasiliy", "data": "ps..."}]; 
// res.send(JSON.stringify(data)); 
// console.log(data);
// });

module.exports = router;


