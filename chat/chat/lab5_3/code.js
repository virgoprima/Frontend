var html ='<html><body>	<form action="/user" method="post"><input type="text" name="ttt" class="text"><br><br><input type="text" name="email" class="text"><br><br> <input type="submit"></form></body></html>';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })); 




var port = process.env.PORT || 3000;

app.get ('/', function (req, res) {
    
   res.send(html)
   });
   
app.post('/user', function (req, res) {

var login = req.body.test;
var password = req.body.ttt;
var mail = req.body.email;

var util = require('util');
var mustache = require('mustache');
var view = {
title: login,
password: password,
email: mail,

};

var template = "Ваш логин {{title}} <br> Ваш пароль  {{password}} <br> Ваш email {{email}} ";
var fin = mustache.to_html(template, view);
console.log(fin);
res.send(fin)
});


app.listen(port)