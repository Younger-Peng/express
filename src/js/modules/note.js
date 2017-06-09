require('less/note.less');

var Toast = require('./Toast.js').Toast;
var Event = require('./event.js');

function Note(opts){
	this.initOpts(opts);
	this.createNote();
	this.setStyle();
	this.bindEvent();
}

Note.prototype = {
	colors: [
    ['#ea9b35','#efb04e'], // headColor, containerColor
    ['#dd598b','#e672a2'],
    ['#eee34b','#f2eb67'],
    ['#c24226','#d15a39'],
    ['#c1c341','#d0d25c'],
    ['#3f78c3','#5591d2']
	],

	defaultOpts: {
		id: '',
		$ct: $('#content').length>0 ? $('#content') : $('body'),
		context: 'input here'
	},

	initOpts: function(opts){
		this.opts = $.extend({},this.defaultOpts,opts||{});
		if(this.opts.id){
			this.id = this.opts.id;
		}
	},

	createNote: function(){
		var tpl = '<div class="note">'
						 +'<div class="note-head"><span class="delete">&times;</span></div>'
						 +'<div class="note-ct" spellcheck="false" contenteditable="true"></div>'
						 +'</div>';
		this.$note = $(tpl);
		this.$note.find('.note-ct').html(this.opts.context);
		this.opts.$ct.append(this.$note);
		if(!this.id) this.$note.css('bottom','10px');
	},

	setStyle: function(){
		var color = this.colors[Math.floor(Math.random()*6)];
		this.$note.find('.note-head').css('background-color',color[0]);
		this.$note.find('.note-ct').css('background-color',color[1]);
	},

	setLayout: function(){
		var self = this;
		if(self.clk){
			clearTimeout(self.clk);
		}
		self.clk = setTimeout(function(){
			Event.fire('waterfall')
			console.log('开始layout')
		}, 100)
	},

	bindEvent: function(){
		var self = this,
				$note = this.$note,
				$noteHead = $note.find('.note-head'),
				$noteCt = $note.find('.note-ct'),
				$delete = $note.find('.delete');

		$delete.on('click',function(){
			self.delete();
			console.log('delete myself')
		});

		$noteCt.on('focus',function(){
			console.log('focused!')
			if($noteCt.html() == 'input here')	$noteCt.html('');
				$noteCt.data('before',$noteCt.html())//表示给$noteCt这个jquery对象中，存储数据{before:'xxx'}
		}).on('blur',function(){
			if($noteCt.data('before')!= $noteCt.html()){ //如果已经不是之前的空字符串的话
				$noteCt.data('before',$noteCt.html()); //把before的值设为最新值
				self.setLayout();
				if(self.id){
					self.edit($noteCt.html())
				}else{
					self.add($noteCt.html())
				}
			}
		});

		$noteHead.on('mousedown',function(e){
			console.log('mousedown');
			var evtX = e.pageX - $note.offset().left,
					evtY = e.pageY - $note.offset().top;
			$note.addClass('draggable').data('evtPos',{x:evtX,y:evtY});
		}).on('mouseup',function(){
			$note.removeClass('draggable').removeData('evtPos')
		});

		$('body').on('mousemove',function(e){
			//只有页面中有class为draggable的元素时，后面这句指令才会生效

				$('.draggable').length && $('.draggable').offset({ 
					top: e.pageY - $('.draggable').data('evtPos').y,
					left: e.pageX - $('.draggable').data('evtPos').x
				})

		})
	},

	edit: function(msg){
		var self = this;
		$.post('/api/notes/edit',{
			id: this.id,
			note: msg
		}).done(function(ret){
			if(ret.status === 0){
				console.log('编辑后已更新到服务器');
				Toast('update success')
			}else{
				Toast(ret.errorMsg)
				console.log('编辑后更新到服务器出错了');
			}
		})
	},

	add: function(msg){
		console.log('add...');
		var self = this;
		$.post('/api/notes/add',{note:msg})
		 .done(function(ret){
		 	if(ret.status === 0){
		 		Toast('add success');
		 	}else{
		 		self.$note.remove();
		 		Event.fire('waterfall');
		 		Toast(ret.errorMsg)
		 	}
		 })
	},

	delete: function(){
		var self = this;
		$.post('/api/notes/delete',{id: this.id})
		  .done(function(ret){
		  	if(ret.status === 0){
		  		Toast('delete success');
		  		self.$note.remove();
		  		Event.fire('waterfall')
		  	}else{
		  		Toast(ret.errorMsg)
		  	}
		  })
	}

};


module.exports.Note = Note;