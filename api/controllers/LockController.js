/**
 * LockController
 *
 * @description :: Server-side logic for managing Locks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var moment = require('moment');
 
module.exports = {
	//// Changement de l'état de la porte
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
						if(param.isOpen){
							Log.create({ message: "Ouverture du verrou"+updated.nameLock+" par l'utilisateur "+req.user.firstname+" "+req.user.lastname, lock: param.id, user: req.user.id}).exec(function createCB(err, created){
								console.log("Success 1 : Création log réussie");		
							});
						}
						else{
							Log.create({ message: "Fermeture du verrou"+updated.nameLock+" par l'utilisateur "+req.user.firstname+" "+req.user.lastname, lock: param.id, user: req.user.id}).exec(function createCB(err, created){
								console.log("Success 1 : Création log réussie");		
							});
						}
						
						console.log(updated);
						Lock.publishUpdate(updated[0].id, {lock:updated[0]});
					});
					return res.json("ok");
				}
			} 
		})
	},
	
	//// Changement du nom de la porte
	ChangeNameLock: function(req,res){
		var param = req.allParams();
		console.log("ID= "+param.id);
		console.log("NameLock= "+param.nameLock);
		Lock.findOne(param.id).exec(function (err, lock) {
			if (err) return res.serverError(err);
			if (!lock) { console.log("Error 1 : changement nameLock"); }
			else {
				// do stuff
				var ancienName = lock.nameLock
				Lock.update({id:param.id},{nameLock:param.nameLock}).exec(function update(err,updated){
						// your change to the user was saved.
						console.log("Success 1 : changement NameLock");
						Log.create({ message: "Changement du nom du verrou "+ancienName+" en "+param.nameLock+"par l'administrateur"+req.user.firstname+" "+req.user.lastname, lock: param.id, user: req.user.id}).exec(function createCB(err, created){
							console.log("Success 1 : Création log réussie");		
						});
						console.log(updated);
						Lock.publishUpdate(updated[0].id, {lock:updated[0]});
				});
			}
		})
		return res.json("ok");
	},
	
	///Affichage de la liste des utilisateurs pour une lock
	ListUsersForLock: function(req,res){
		var param = req.allParams();
		console.log("id lock list= "+param.id);
		Lock.findOne(param.id).populate('users').exec(function (err, lock) {
			if (err) return res.serverError(err);
			if (!lock) { console.log("Error 1 : Affichage Users"); }
			else {
				console.log(lock.users);
				return res.json(lock.users);
			}
		})
	},

/////////// Ajout d'une porte par un admin
	AddLockForUser: function(req, res){
		if(!req.isSocket)return res.json(401,{err:'is not a socket request'});
		var param = req.allParams();
		console.log("id user = "+req.user.id);
		console.log("nom de la porte = "+param.nameLock);
		Lock.create({nameLock: param.nameLock, isOpen: false, users: req.user.id, idAdmin: req.user.id}).exec(function createCB(err, created){
			console.log("Success 1 : Création porte réussie");		
			console.log(created);
			Lock.subscribe(req.socket, created.id);
			User.publishAdd(req.user.id, "locks", created.id);
			sails.log('user' + req.user.id + 'has subscribe');
			Log.create({ message: "Création du verrou "+created.nameLock+" réussi ", lock: created.id, user: req.user.id}).exec(function createCB(err, created){
						console.log("Success 1 : Création log réussie");		
				});

			return res.json(created);
		});

	},


/////////// Affichage des logs pour une porte
	ShowLogsForLock: function(req,res){
		var param = req.allParams();
		var listLog = [];
		console.log("id lock: "+param.idLock);
		Log.find({lock: param.idLock}).sort({id:'desc'}).exec(function (err,logs){
			var nblimit = logs.length;
			if(nblimit > 10)
				nblimit = 10;
			for(var i=0; i<nblimit; i++){
				console.log('test created : '+logs[i].createdAt);
				logs[i].createdAt = moment(logs[i].createdAt).format('lll');
				listLog[i] = logs[i];
			}
			console.log(listLog);
			return res.json(listLog);
		})
	}
};
