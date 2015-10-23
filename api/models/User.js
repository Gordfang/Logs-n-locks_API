/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
	lastname:{
		type: "string",
		required: true,
		minLength: 3
	},
	firstname:{
		type: "string",
		required: true,
	},
	email:{
		type: "string",
		required: true,
		unique: true
	},
	password:{
		type: "string",
		required: true,
	},
	locks:{
		collection: 'lock',
		via: 'users'
	}
  }
};

