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
	},
	uploader: function(req, res){

		clientModel.findOne({email:{$regex:req.params.email}}, function(err, client){
			if(err){throw err;}
					
			if(client.length > 0){
				let transporter = nodemailer.createTransport({
				    service:'Gmail',
				    auth: {
				        user: "akhidenorernestium@gmail.com",
				        pass: "A7bra8ca12da2brA7"
				    }
				});

				// setup email data with unicode symbols
			    let mailOptions = {
			        from: 'billing@alfred-victoria.com', // sender address
			        to: client.email, // list of receivers
			        subject: 'WDD 3.0 Ticket Details', // Subject line
			        text: 'You have secured your ticket to the annual WDD event. The event will hold on 1, May 2019. 8:00 AM prompt', // plain text body
			        html: '<div style="max-width:30%; background:#FF4500; color:#FFFFFF; padding:5px 0px;"><h1 style="text-align:center;">WDD 3.0</h1><table cellpadding="15px"><tr><td><b>Name</b></td><td>'+client.name+'</td></tr><tr><td><b>Ticket Number</b></td><td>'+client.ticketNumber+'</td></tr></table></div>' // html body
			    };

			    // send mail with defined transport object
			    transporter.sendMail(mailOptions, (error, info) => {
			        if (error) {
			            res.redirect('/');
			        }
			    });
			    res.json(true);
			}else{
				res.json(false);
			}
		})		
	}
}
