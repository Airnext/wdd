let express = require('express');
let	router = express.Router();
let	index = require('../controllers/index');
	
module.exports = function(app){
	router.get('/', index.index);
	router.get('/speaker-details/:name', index.speaker);
	router.post('/purchase', index.purchase);

	router.use(function(req, res){
		res.status(404).send('Page Not Found');
	});
	
	app.use(router);
}