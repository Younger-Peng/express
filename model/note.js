//操作数据库
var Sequelize = require('sequelize');
var path = require('path');

 var sequelize = new Sequelize(undefined,undefined,undefined,{
 	host: 'localhost',
 	dialect: 'sqlite',
 	storage: path.join(__dirname,'../database/database.sqlite')
 })


 var Note = sequelize.define('note',{
 	text: {
 		type: Sequelize.STRING
 	},
 	uid: {
 		type: Sequelize.STRING
 	}
 });

 // sequelize.sync().then(function(){
 // 	 Note.create({
	//  	text: 'Hello World'
	//  }).then(function(note){
	//  	console.log(note)
	//  })
 // })




module.exports = Note;