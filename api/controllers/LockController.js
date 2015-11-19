/**
 * LockController
 *
 * @description :: Server-side logic for managing Locks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	//// Changement Etat IsOpen
	ChangeIsOpen: function(req,res){
		var param = req.allParams();
		console.log("ID= "+param.id);
		console.log("Isopen= "+param.isOpen);
		Lock.findOne(param.id).exec(function (err, lock) {
			if (err) return res.serverError(err);
			if (!lock) { console.log("Error 1 : changement IsOpen"); }
			else {
				console.log(lock.isOpen);
				if(param.isOpen == lock.isOpen){
					if(param.isOpen != false){
						console.log("Fail 1 : Porte déjà ouverte!");						
						return res.json("La porte est déjà ouverte!");
					}else{
						console.log("Fail 2 : Porte déjà fermée!");
						return res.json("La porte est déjà fermée!");
					}
				}else{
					lock.logs
					Lock.update({id:param.id},{isOpen:param.isOpen}).exec(function update(err,updated){
						// your change to the user was saved.
						console.log("Success 1 : changement IsOpen");
						Log.create({ isOpen: param.isOpen, lock: param.id}).exec(function createCB(err, created){
							console.log("Success 1 : Création log réussie");		
						});
						console.log(updated);
						Lock.publishUpdate(updated[0].id, {lock:updated[0]});
					});
					return res.json("ok");
				}
			} 
		})
	},
	
	//// Changement Nom Lock
	ChangeNameLock: function(req,res){
		var param = req.allParams();
		console.log("ID= "+param.id);
		console.log("NameLock= "+param.nameLock);
		Lock.findOne(param.id).exec(function (err, lock) {
			if (err) return res.serverError(err);
			if (!lock) { console.log("Error 1 : changement nameLock"); }
			else {
				// do stuff
				lock.nameLock = param.nameLock;
				Lock.update({id:param.id},{nameLock:param.nameLock}).exec(function update(err,updated){
						// your change to the user was saved.
						console.log("Success 1 : changement NameLock");
						/*Log.create({ name: param.nameLock, lock: param.id}).exec(function createCB(err, created){
							console.log("Success 1 : Création log réussie");		
						});*/
						console.log(updated);
						Lock.publishUpdate(updated[0].id, {lock:updated[0]});
				});
			}
		})
		return res.json("ok");
	},
	
	ListUsersForLock: function(req,res){
		var param = req.allParams();
		console.log("id lock= "+param.id);
		Lock.findOne(param.id).populate('users').exec(function (err, lock) {
			if (err) return res.serverError(err);
			if (!lock) { console.log("Error 1 : Affichage Users"); }
			else {
				console.log(lock.users);
				return res.json(lock.users);
			}
		})
	},

	AddLockForUser: function(req, res){
		if(!req.isSocket)return res.json(401,{err:'is not a socket request'});
		var param = req.allParams();
		console.log("id user = "+req.user.id);
		console.log("nom de la porte = "+param.nameLock);
		Lock.create({nameLock: param.nameLock, isOpen: false, users: req.user.id}).exec(function createCB(err, created){
			console.log("Success 1 : Création porte réussie");		
			/*Log.create({ name: param.nameLock, lock: param.id}).exec(function createCB(err, created){
				console.log("Success 1 : Création log réussie");		
			});*/
			console.log(created);
			Lock.subscribe(req.socket, created.id);
	///////////////////////////////////////////////////* à revoir le publishAdd*/
			User.publishAdd(req.user.id, "locks", created.id);
			sails.log('user' + req.user.id + 'has subscribe');
			return res.json(created);
		});

	},



	GetLogsForLock: function(req,res){
		if(!req.isSocket)return res.json(401,{err:'is not a socket request'});
		var idLock = req.param('idLock');
		Lock.find({id:idLock}).populate('logs').exec(function(err,lock){
			if(err)return res.error()
			Lock.subscribe(req, _.pluck(user,'id'))
			return res.json(lock)
		})
	}
};
