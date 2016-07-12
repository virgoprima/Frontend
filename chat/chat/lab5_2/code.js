var html ='<html><body>	<form action="/user" method="post">	<input type="text" name="test" class="text"><br><br>    <input type="text" name="ttt" class="text"><br><br><input type="text" name="email" class="text"><br><br> <input type="submit"></form></body></html>';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded



var port = process.env.PORT || 3000;

app.get ('/', function (req, res) {
    
   res.send(html)
   
  app.post('/user', function (req, res) {
             
  console.log(req.body.test);     
  console.log(req.body.ttt);  
  console.log(req.body.email);      

   
  res.send('Ваш логин = ' + req.body.test + '<br>' + 'Ваш пароль  = ' + req.body.ttt +'<br>' + 'Ваш email  = ' + req.body.email + '<br>'
            )
       
});

});

app.listen(port);