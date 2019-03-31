let express = require('express');
let routes = require('./routes');
let path = require('path');
let exphbs = require('express-handlebars');
let	favicon = require('serve-favicon');
let	bodyParser = require('body-parser');
let expressValidator = require('express-validator');
let multer = require('multer');
let flash = require('express-flash');

module.exports = function(app){
	app.use(favicon(path.join(__dirname, '../public', 'img', 'favicon.png')));
	app.use(bodyParser.urlencoded({extended:false}));
	app.use(bodyParser.json());
	app.use(expressValidator());
	app.use(multer({'dest':'./public/upload/temp'}).single('file'));
	app.use(flash());
	app.use('/public/', express.static(path.join(__dirname, '../public')));
	routes(app);
	app.engine('handlebars', exphbs.create().engine);
	app.set('view engine', 'handlebars');
	return app;
}