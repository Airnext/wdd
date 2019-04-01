let speakerModel = require('../models/speaker');
let clientModel = require('../models/client');
let nodemailer = require('nodemailer');
let path = require('path');
let fs = require('fs');

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
							amount: 5000,
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
		let viewModel = {}

		viewModel.uploadSuccess = req.flash('uploadSuccess');
		viewModel.uploadError = req.flash('uploadError');

		res.render('upload', viewModel);
	},
	checker: function(req, res){

		clientModel.findOne({email:{$regex:req.params.email}}, function(err, client){
			if(err){throw err;}

			console.log('client is ' + client);
			console.log('-----------------------------------------');
			console.log('                                          ');
			if(client){
			    let transporter = nodemailer.createTransport({
				    service:'Gmail',
				    auth: {
				        user: "wdd3.confirmation@gmail.com",
				        pass: "confirmation_3"
				    }
				});

				// setup email data with unicode symbols
			    let mailOptions = {
			        from: 'billing@alfred-victoria.com', // sender address
			        to: client.email, // list of receivers
			        subject: 'WDD 3.0 Ticket', // Subject line
			        text: 'You have secured your ticket to the annual WDD event. The event will hold on 1, May 2019. 8:00 AM prompt', // plain text body
			        html: '<div style="max-width:100%; background:#FF4500; color:#FFFFFF; padding:5px 0px;"><h1 style="text-align:center;">WDD 3.0</h1><table cellpadding="15px"><tr><td><b>Name</b></td><td>' + client.name + '</td></tr><tr><td><b>Ticket Number</b></td><td>' + client.ticketNumber + '</td></tr></table></div>' // html body
			    };

			    // send mail with defined transport object
			    transporter.sendMail(mailOptions, (error, info) => {
			        if (error) {
			            res.redirect('/');
			        }

			        console.log('Email was sent successfully');
			        //res.redirect('/upload');
			    });
			}else{
				res.json(false);
			}
		})		
	},
	uploader: function(req, res){
		function saveFile(){
			let possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
			let fileUrl = '';
			let userEmail = req.body.email;
			console.log('req.body.email ' + req.body.email);
			console.log('userEmail variable ' + userEmail);
			for(i=0; i < 6; i++){
				fileUrl += possible.charAt(Math.floor(Math.random() * possible.length));
			}

			clientModel.find({'filename':fileUrl}, function(err, files){
				if(err){throw err;}

				if(files.length > 0){
					saveFile();
				}else{
					let tempPath = req.file.path;
					let ext = path.extname(req.file.originalname).toLowerCase();
					let targetPath = path.resolve('./public/upload/' + fileUrl + ext);

					if(ext === '.pdf' || ext === '.doc' || ext === '.docx'){
						fs.rename(tempPath, targetPath, function(err){
							if(err){ throw err}



							clientModel.findOne({email:userEmail}, function(err, client){
								if(err){throw err;}	
								console.log(client);
								if(client){
									client.filename = fileUrl + ext;

									client.save(function(){
										req.flash('uploadSuccess','CV Uploaded Successfully!');
										res.redirect('/upload');
									});
								}else{
									req.flash('uploadError','Error Uploading CV!');
									res.redirect('/upload');
								}
								
							});
						});
					}else{
						fs.unlink(tempPath, function(err){
							res.status(500).json({'Error':'Invalid File Format.'});
						});
					}
				}
			})
		}

		saveFile();
	}
}
