let mongoose = require('mongoose');
let	Schema = mongoose.Schema;
let	ObjectId = Schema.ObjectId;
	
let ClientSchema = new Schema({
	name:{type:String},
	email:{type:String},
	phone:{type:String},
	ticketNumber:{type:Number},
	dateCreated:{type:Date, 'default':Date.now}
});

module.exports = mongoose.model('client', ClientSchema);