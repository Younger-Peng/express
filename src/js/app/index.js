require('less/index.less')
var Toast = require('../modules/Toast.js').Toast
var NoteManager = require('../modules/note-manager.js');

var Event = require('../modules/event.js');
var WaterFall = require('../modules/waterfall.js').WaterFall;

NoteManager.load();

$('.add-note').on('click',function(){
	NoteManager.add();
})

Event.on('waterfall',function(){
	new WaterFall($('#content'),$('.note'));
})




