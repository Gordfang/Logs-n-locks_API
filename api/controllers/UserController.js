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

	AddUser: function(req, res){
		console.log("AddUser : ");
		var param = req.allParams();
		User.findOne({email: param.email}).exec(function (err, user) {
			if(!user)
			{
				User.create({lastname: param.lastname, firstname: param.firstname, email: param.email, password: param.password}).exec(function createCB(err, created){
					if (err) return res.serverError(err);
					console.log("Success 1 : Création User réussie");		
				});
				return res.json("ok");
			}
		});
		return res.json("email deja pris");
	},
	
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
				// do stuff						
				return res.json(user.locks);
			}
		})
	},

	DeleteLockForUser: function(req, res){
		if(!req.isSocket)return res.json(401,{err:'is not a socket request'});
		var param = req.allParams();
		console.log("id user= "+req.user.id);
		console.log("id lock= "+param.idLock);
		User.findOne({id: req.user.id}).populate('locks').exec(function (err, user) {
		if (err) return res.serverError(err);
			if (!user) { console.log("Error 1 : Affichage Locks"); }
			else {				
				user.locks.remove(param.idLock);
				User.publishRemove(req.user.id, "locks", param.idLock);
				Lock.unsubscribe(req.socket, param.idLock);
				sails.log('user' + req.user.id + 'has unsubscribe');
				user.save(console.log);
			}
		})
		return res.json("ok");
	},
	
	AddUserForLock: function(req, res){
		var param = req.allParams();
		console.log("id Lock = "+param.idLock);
		console.log("mail du new user = "+param.email);
		User.findOne({email : param.email}).populate('locks').exec(function (err, user) {
			if (err) return res.serverError(err);
			if (!user) { console.log("Error : L'utilisateur demandé n'existe pas"); }
			else {
				console.log('création de la liaison lock-user');
				user.locks.add(param.idLock);
				user.save(console.log);					
				return res.json('ok');
			}
			return res.json("Error : L'utilisateur demandé n'existe pas");
		})
	},
	
	DeleteUserForLock: function(req, res){
		var param = req.allParams();
		console.log("id Lock = "+param.idLock);
		console.log("id autre user = "+param.idUser);
		User.findOne(param.idUser).populate('locks').exec(function (err, user) {
			if (err) return res.serverError(err);
			if (!user) { console.log("Error : L'utilisateur demandé n'existe pas"); }
			else {
				user.locks.add(req.lockId);
				user.save(console.log);		
				//Lock.publishCreate(14, {lock:created[0]});			
				console.log('destruction de la liaison lock-user');
				user.locks.delete(param.idLock);
				user.save(console.log);					
				return res.json('ok');
			}
			return res.json("Error : L'utilisateur demandé n'existe pas");
		})
	},
};

