/**
* Log.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
	isOpen:{
		type: "boolean",
		required: true
	},
	dateModif:{
		type: "Date",
		required: true
	},
	lock:{
		model: 'lock'
	}
  }
};
