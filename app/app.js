//app.js
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

app.set('views',path.join(__dirname,'views'));
app.set('view engine','jade');
app.set('port',process.env.PORT || 3000);

app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json());


var routes = require('./routes/index');

app.get('/',routes);

app.listen(app.get('port'),function(){
	console.log('Server is running on '+ app.get('port'));
});