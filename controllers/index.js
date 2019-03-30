let speakerModel = require('../models/speaker');
let clientModel = require('../models/client');

module.exports = {
	index: function(req, res){
		let viewModel = {
			speakers: []
		}

		speakerModel.find({},{}, function(err, speakers){
			viewModel.speakers = speakers;

			res.render('index', viewModel);
		})
	},
	speaker: function(req, res){
		let viewModel = {
			speaker:{}
		}

		speakerModel.findOne({name:{$regex:req.params.name}}, function(err, speaker){
			viewModel.speaker = speaker;

			res.render('speaker-details', viewModel);
		})
	},
	purchase: function(req, res){
		function saveClient(){
			
				let newTicketNumber = 0;
				newTicketNumber = Math.floor(Math.random() * 1500);

				clientModel.find({ticketNumber:newTicketNumber}, function(err, ticket){
					if(err){throw err;}
					
					if(ticket.length > 0){
						saveClient();
					}else{
						let newClient = new clientModel({
							name: req.body.name,
							email: req.body.email,
							phone: req.body.phone,
							ticketNumber: newTicketNumber
						})

						newClient.save(function(err){
							if(err){throw err;}

							res.redirect('https://paystack.com/pay/wdd');
						});
					}
				});
		}
		saveClient();
	},
	upload: function(req, res){
		res.render('upload');
	}
}
