/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var bcrypt = require('bcryptjs');

module.exports = {
	// Changement password
	ChangePass: function(req,res){
		var param = req.allParams();
		console.log("id= "+req.user.id);
		console.log("pass= "+param.password);
		User.findOne(req.user.id).exec(function (err, user) {
			if (err) return res.serverError(err);
			if (!user) { console.log("Error 1 : changement Password"); }
			else {
				// do stuff
				user.password = param.password;
				user.save(function (err) {
				if (err) return res.serverError(err);
					// your change to the user was saved.
					console.log("Success 1 : changement Password");
				});
			}
		})
		return res.json("ok")
	},
	
	// Changement e-mail
	ChangeMail: function(req,res){
		var param = req.allParams();
		console.log("id= "+req.user.id);
		console.log("mail= "+param.email);
		User.findOne(req.user.id).exec(function (err, user) {
			if (err) return res.serverError(err);
			if (!user) { console.log("Error 1 : changement Password"); }
			else {
				// do stuff
				User.find(param.email).exec(function (err, user){
					if (err) return res.serverError(err);
					if (user) { console.log("Error 1 : changement Mail déja utilisé"); }
					else {
						user.email = param.email;
						user.save(function (err) {
						if (err) return res.serverError(err);
							// your change to the user was saved.
							console.log("Success 1 : changement Mail");
						});
					}
				});				
			}
		})
	},

	//

	ListLocksForUser: function(req,res){
		var param = req.allParams();
		console.log("id user= "+req.user.id);
		User.findOne(req.user.id).populate('locks').exec(function (err, user) {
			if (err) return res.serverError(err);
			if (!user) { console.log("Error 1 : Affichage Locks"); }
			else {
				// do stuff						
				return res.json(user.locks);
			}
		})
	},

	DeleteLockForUser: function(req, res){
		var param = req.allParams();
		console.log("id user= "+req.user.id);
		console.log("id lock= "+param.idLock);
		console.log("token= "+param.authorization);
		User.findOne({id: req.user.id}).populate('locks').exec(function (err, user) {
		if (err) return res.serverError(err);
			if (!user) { console.log("Error 1 : Affichage Locks"); }
			else {				
				user.locks.remove(param.idLock);
				user.save(console.log);
			}
		})
		return res.json("ok");
	},
};

