var config = require('config');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var express = require('express');
var mysql = require('mysql');
var connection = require ('./condb.js');
var path = require('path');
var logger = require('morgan');
var app = express();
var mustacheExpress = require('mustache-express');



var port = process.env.PORT || config.get('port');

app.use(// при запуске сессии сервер будет отдавать cookie file с id
    session(
        {
            secret:' 23msdf134kasd ',
            name: 'authId',
            cookie: {maxAge: 60000},
        }
    )
)

console.log('Listening on port ' + port);
app.use(logger('dev'));


 
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./routes/index');
var admin = require('./routes/admin');



app.use('/', admin);
app.listen(port);


var sql = "SELECT * FROM ?? WHERE ?? = ?";
var inserts = ['user','id_user',1];
sql= mysql.format(sql, inserts);
console.log(sql);



