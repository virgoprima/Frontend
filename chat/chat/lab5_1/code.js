var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
app.get ('/reg', function ( req, res) {
    res.send('Hello, Express!')
})


app.get('/:key/:value', function(req, res) {

    key=req.params.key;
    value=req.params.value;
    res.send('I got key: '+key+' and value: '+value);
    console.log(req);
    
});

app.listen(port);
console.log('Listening on port ' + port);