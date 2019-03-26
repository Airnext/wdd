let mongoose = require('mongoose');
let	Schema = mongoose.Schema;
let	ObjectId = Schema.ObjectId;
	
let SpeakerSchema = new Schema({
	name:{type:String},
	description:{type:String},
	img:{type:String},
	details:{type:String},
	profileLink:{type:String}
});

module.exports = mongoose.model('speaker', SpeakerSchema);