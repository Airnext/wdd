let express = require('express');
let app = express();
let config = require('./server/configure');
let mongoose = require('mongoose');
const URI = require('./server/config');
	
app.set('port', process.env.PORT || 3700);
app.set('views', __dirname + '/views');

mongoose.connect(process.env.MONGODB_URI || URI);

// When successfully connected
mongoose.connection.on('connected', () => {
	console.log('Established Mongoose Default Connection');
});

// When connection throws an error
mongoose.connection.on('error', err => {
	console.log('Mongoose Default Connection Error : ' + err);
});


//mongoose.connect('mongodb://localhost/wdd');

app = config(app);

app.listen(app.get('port'),function(){
	console.log("Server started at localhost:" + app.get('port'));
});