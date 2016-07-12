var mysql = require('mysql');
var connection = mysql.createConnection({
host: 'localhost',
user: 'root',
password:'syPS5KA9',
database:'chat'
});
connection.connect();



module.exports=connection;