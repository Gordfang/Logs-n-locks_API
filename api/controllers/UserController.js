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
		console.log("id= "+param.id);
		console.log("pass= "+param.password);
		User.findOne(param.id).exec(function (err, user) {
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
	},

	//

	ListLocksForUser: function(req,res){
		var param = req.allParams();
		console.log("id user= "+param.id);
		User.findOne(param.id).populate('locks').exec(function (err, user) {
			if (err) return res.serverError(err);
			if (!user) { console.log("Error 1 : Affichage Locks"); }
			else {
				// do stuff
				for(var i=0; i< user.locks.length; i++){
					console.log("Id de la porte: "+user.locks[i].id);
					Lock.findOne(user.locks[i].id).exec(function (err, lock) {
						console.log("Nom de la porte: "+lock.nameLock);
						console.log("Ouverte: "+lock.isOpen);
					});
				}
			}
		})
	},

	 
};

