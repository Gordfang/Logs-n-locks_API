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
			}
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
	},
	
	ListUsersForLock: function(req,res){
		var param = req.allParams();
		console.log("ID Lock= "+param.id);
		Lock.findOne(param.id).exec(function (err, lock) {
			if (err) return res.serverError(err);
			if (!lock) {console.log("Error 1 : List User for Lock"); }
			else {
				for(var i = 0; i <  lock.users.length; i++){
					console.log(lock.users[i]);
				}
			}
		});
	},
};

