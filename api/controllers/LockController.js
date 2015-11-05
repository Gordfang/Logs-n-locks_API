/**
 * LockController
 *
 * @description :: Server-side logic for managing Locks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	//// Changement Etat IsOpen
	IdLock: function(req,res){
		var param = req.allParams();
		console.log("param= "+param.id);
		console.log("ID= "+param.id);
		console.log("Isopen= "+param.isOpen);
		Lock.findOne(param.id).exec(function (err, lock) {
			if (err) return res.serverError(err);
			if (!lock) { console.log("Error 1 : changement IsOpen"); }
			else {
				// do stuff
				lock.isOpen = param.isOpen;
				lock.save(function (err) {
				if (err) return res.serverError(err);
					// your change to the user was saved.
					console.log("Success 1 : changement IsOpen");
				});
			}//return 
		})
	},
	
	//// Changement Nom Lock
	NameLock: function(req,res){
		var param = req.allParams();
		console.log("ID= "+param.id);
		console.log("NameLock= "+param.nameLock);
		Lock.findOne(param.id).exec(function (err, lock) {
			if (err) return res.serverError(err);
			if (!lock) { console.log("Error 1 : changement nameLock"); }
			else {
				// do stuff
				lock.nameLock = param.nameLock;
				lock.save(function (err) {
				if (err) return res.serverError(err);
					// your change to the user was saved.
					console.log("Success 1 : changement nameLock");
				});
			}
		})
		return res.json("ok");
	},
	
	ListUsersForLock: function(req,res){
		var param = req.allParams();
		console.log("ID Lock= "+param.id);
		Lock.findOne(param.id).populate('users').exec(function (err, lock) {
			if (err) return res.serverError(err);
			if (!lock) {console.log("Error 1 : List User for Lock"); }
			else {
				console.log("nb user : "+lock.users.length);
				return res.json(lock.users);
			}//return
		});
	},

	AddLockForUser: function(req, res){
		var param = req.allParams();
		console.log("id user = "+param.idUser);
		console.log("nom de la porte = "+param.nameLock);
		Lock.create({nameLock: param.nameLock, isOpen: false, users: param.idUser}).exec(function createCB(err, created){
			console.log("Success 1 : Création porte réussie");		
		});
		return res.json("ok");
	}
};
