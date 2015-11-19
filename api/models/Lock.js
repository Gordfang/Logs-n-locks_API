/**
* Lock.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
	nameLock:{
		type: "string",
		required: true,
		minLength: 3
	},
	isOpen:{
		type: "boolean",
		required: true
	},
	isAdmin:{
		model: 'user'
	},
	users:{
		collection: 'user',
		via: 'locks'
	},
	logs:{
		collection: 'log',
		via: 'lock'
	}
  }
};

