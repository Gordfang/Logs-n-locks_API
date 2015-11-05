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
		return res.json("ok")
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
				var list = [];
				for(var i=0; i< user.locks.length; i++){
					console.log("Id de la porte: "+user.locks[i].id);
					Lock.findOne(user.locks[i].id).exec(function (err, lock) {
						console.log("Nom de la porte: "+lock.nameLock);
						console.log("Ouverte: "+lock.isOpen);
						var obj = {id: user.locks[i].id, name:lock.nameLock, ouverte: lock.isOpen};
						list.push(obj);
					});
				}
				return res.json(list);
			}
		})
	},

	DeleteLockForUser: function(req, res){
		var param = req.allParams();
		console.log("id user= "+param.idUser);
		console.log("id lock= "+param.idLock);
		console.log("token= "+param.authorization);
		User.findOne({id: param.idUser}).populate('locks').exec(function (err, user) {
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

