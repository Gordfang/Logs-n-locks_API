/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var bcrypt = require('bcryptjs');

//////fonction pour supprimer des portes ou des liens entre un user et une porte
	function DestroyLinksUserLocks(reqSocket,listLock, idUser, callback){		
		console.log("tableau : "+listLock);
		console.log("id user= "+idUser);
		User.findOne({id: idUser}).exec(function (err, useR) {
			_.each(listLock, function(lock){
				console.log("lock");
				console.log(lock);
				Lock.findOne({id: lock.id}).populate('users').exec(function (err, locK) {
					console.log("locK");
					console.log(locK);
					if(lock.idAdmin == useR.id){
						User.publishRemove(useR.id, "locks", locK.id);
						_.each(locK.users, function(Alluser){
							Alluser.locks.remove(locK.id);
							Lock.unsubscribe(reqSocket, locK.id);
							sails.log('user ' + Alluser.id + ' has unsubscribe');
							Alluser.save(console.log);
						});
						Log.create({ message: "Supression du verrou "+locK.nameLock+" par l'administrateur "+useR.firstname+" "+useR.lastname, lock: locK.id, user: useR.id}).exec(function createCB(err, created){
							console.log("Success 1 : Création log réussie");		
						});
						Lock.destroy({id: locK.id}).exec(function (err, destroyed){
							console.log("destroyed");
							console.log(destroyed);
						});
					}
					else{
						useR.locks.remove(locK.id);
						User.publishRemove(useR.id, "locks", locK.id);
						Lock.unsubscribe(reqSocket, locK.id);
						sails.log('user ' + useR.id + ' has unsubscribe');
						useR.save(console.log);
						Log.create({ message: "Supression de l'utilisateur "+useR.firstname+" "+useR.lastname+" sur le verrou "+locK.nameLock, lock: locK.id, user: useR.id}).exec(function createCB(err, created){
							console.log("Success 1 : Création log réussie");		
						});
					}
					
				});
			});
			callback('',useR);
		});
	}

module.exports = {

	// Changement du password de l'utilisateur
	ChangePass: function(req,res){
		var param = req.allParams();
		console.log("id= "+req.user.id);
		console.log("pass= "+param.password);
		User.findOne(req.user.id).exec(function (err, user) {
			if (err) return res.serverError(err);
			if (!user) { console.log("Error 1 : changement Password"); }
			else {
				// do stuff
				bcrypt.genSalt(10, function(err, salt){
					if(err){						
						console.log('pass err 1 :'+ err);
						return res.json(err);
					}
					bcrypt.hash(param.password, salt,function(err,hash){
						if(err)
						{							
							console.log('pass err 2 :'+ err);
							return res.json(err);
						}
						user.password = hash;
						console.log('pass Contro :'+user.password);
						user.save(function (err) {
						if (err) return res.serverError(err);
							// your change to the user was saved.
							console.log("Success 1 : changement Password");
						});
					});
				});				
			}
		});
		return res.json("ok");
	},
	
	// Changement profil qui marche
	EditProfil: function(req,res){
		var param = req.allParams();
		console.log("id= "+req.user.id);
		console.log("mail= "+param.email);
		User.findOne(req.user.id).exec(function (err, user) {
			if (err) return res.serverError(err);
			if (!user) { console.log("Error 1 : changement Password"); }
			else {
				// do stuff
				user.firstame = param.firstame;
				user.lastname = param.lastname;
				user.save(function (err) {
					if (err) return res.serverError(err);
						// your change to the user was saved.
						console.log("Success 1 : changement name");
					});
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


	//// création d'un compte utilisateur
	AddUser: function(req, res){
		console.log("AddUser : ");
		var param = req.allParams();
		User.findOne({email: param.email}).exec(function (err, user) {
			console.log("1");
			if(!user)
			{
				console.log("2");
				User.create({lastname: param.lastname, firstname: param.firstname, email: param.email, password: param.password}).exec(function createCB(err, created){
					if (err) return res.serverError(err);
					console.log("Success 1 : Création User réussie");		
				});
				return res.json("Utilisateur créé");
			}
			else
				return res.json("email deja pris");
		});		
	},
	
	DeleteUser: function(req, res){
		if(!req.isSocket)return res.json(401,{err:'is not a socket request'});
		console.log("DeleteUser : ");
		var param = req.allParams();
		console.log('pass1 : '+ param.password);
		User.findOne({id: idUser}).populate('locks').exec(function (err, user){
			if(err){
				return res.json('erreur mot de passe');
				console.log("Error");
			}
			User.comparePassword(param.password,user, function(err,valid){
				var listLock = user.locks
				var idUser = req.user.id;
				console.log("Password Success 1");
				DestroyLinksUserLocks(req.socket,listLock, idUser, function(err,user){
					if(err){return res.json('error');}			
					user.destroy(function (err) {
						if (err) { return done(err); }
						console.log("Success 1");
						return res.json('success');
					});
				});				
			});			
		});
	},
	
	//// ajout de la liste des locks pour un utilisateur
	ListLocksForUser: function(req,res){
		if(!req.isSocket)return res.json(401,{err:'is not a socket request'});
		var param = req.allParams();
		console.log("id user= "+req.user.id);
		User.findOne(req.user.id).populate('locks').exec(function (err, user) {
			if (err) return res.serverError(err);
			if (!user) { console.log("Error 1 : Affichage Locks"); }
			else {
				_.each(user.locks, function(lock){
					Lock.subscribe(req.socket, lock.id);
					sails.log('user' + req.user.id + 'has subscribe');
				});
				user.socketId = req.socket.id;
				user.save(console.log);
				console.log(user.socketId);
				// do stuff						
				return res.json(user.locks);
			}
		})
	},


	
	///////////// Supression d'une porte pour un utilisateur
	DeleteLockForUser: function(req, res){
		if(!req.isSocket) return res.json(401,{err:'is not a socket request'});
		var param = req.allParams();
		console.log("id user= "+req.user.id);
		console.log("id lock= "+param.idLock);
		var idUser = req.user.id;
		var listLock = [];
		User.findOne({id: idUser}).populate('locks').exec(function (err, useR) {
			console.log(useR.locks);
			for(var i=0; i<useR.locks.length; i++){
				console.log(useR.locks.length);
				if(param.idLock == useR.locks[i].id) 
					listLock.push(useR.locks[i]);
			}
			console.log(listLock);
			DestroyLinksUserLocks(req.socket, listLock, idUser, function (err, valid){
				console.log('sucess');
			});
		});
		return res.json("ok");
	},



	

	  
	////Ajout d'un utilisateur pour une porte
	AddUserForLock: function(req, res){
		//if(!req.isSocket) return res.json(401,{err:'is not a socket request'});
		var param = req.allParams();
		console.log("id Lock = "+param.idLock);
		console.log("mail du new user = "+param.email);
		User.findOne({email : param.email}).populate('locks').exec(function (err, user) {
			if (err) return res.serverError(err);
			if (!user) { console.log("Error : L'utilisateur demandé n'existe pas"); }
				console.log('création de la liaison lock-user');
				user.locks.add(param.idLock);
				user.save();
				/*_.each(Lock.subscribers(param.idLock), function(sub){
					if(sub.id == user.socketId){
						Lock.subscribe(sub, param.idLock);
					}
				})*/
				User.publishAdd(user.id, "locks", param.idLock);
				/*Lock.findOne({id : param.idLock}).exec(function (err, lock){
					Log.create({ message: "Ajout de l'utilisateur "+user.firstname+" "+user.lastname+" au verrou "+lock.nameLock+" par l'utilisateur "+req.user.lastname+" "+req.user.firstname,
						lock: param.idLock, user: user.id}).exec(function createCB(err, created){
							console.log("Success 1 : Création log réussie");		
					});
				})*/
				return res.json('ok');
		})
	},
	
	////Supression d'un utilisateur pour une porte
	DeleteUserForLock: function(req, res){
		if(!req.isSocket) return res.json(401,{err:'is not a socket request'});
		var param = req.allParams();
		console.log("id Lock = "+param.idLock);
		console.log("id autre user = "+param.idUser);
		User.findOne(param.idUser).populate('locks').exec(function (err, user) {
			if (err) return res.serverError(err);
			if (!user) { return res.json("Error : L'utilisateur demandé n'existe pas"); }
			console.log('destruction de la liaison lock-user');
			Lock.findOne(param.idLock).exec(function (err, lock) {
				user.locks.remove(lock.id);
				user.save();
				_.each(Lock.subscribers(lock.id), function(sub){
					if(sub.id == user.socketId){
						Lock.unsubscribe(sub, lock.id);
					}
				})
				Log.create({ message: "Supression de l'utilisateur "+user.firstname+" "+user.lastname+" au verrou "+lock.id+" par l'administrateur", lock: lock.id, user: req.user.id}).exec(function createCB(err, created){
					console.log("Success 1 : Création log réussie");		
				});	
				User.publishRemove(user.id, "locks", lock.id);	
				return res.json('ok');			
			});
		})
	},
};

