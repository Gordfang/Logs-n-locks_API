/**
 * LockController
 *
 * @description :: Server-side logic for managing Locks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	//// Changement Etat IsOpen
	IdLock: function(req,res){
		lock.update({id:1},{IsOpen:true}).exec(function afterwards(err,updated){
			if(err){
				console.log("error changement IsOpen");
				return;
			}
			console.log("Changement IsOpen success");
		});
	},
	
	//// Changement Nom Lock
	NameLock: function(req,res){
	lock.update({id:''},{nameLock:''}).exec(function afterwards(err,updated){
			if(err){
				console.log("error changement nameLock");
				return;
			}
			console.log("Changement nameLock success");
		});
	},
};

