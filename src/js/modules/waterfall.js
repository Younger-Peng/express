	function WaterFall($tagContainerEle,$tagEle){
		this.$tagContainerEle = $tagContainerEle;
		this.$tagEle = $tagEle;
		this.$init();
		this.$layout();
		this.$update();
	}
	WaterFall.prototype = {
		$init: function(){
			this.$colArr = [];
			this.$colNum = parseInt(this.$tagContainerEle.width()/this.$tagEle.width());
			this.$colWidth = parseInt(this.$tagContainerEle.width()/this.$colNum);
		},
		$layout: function(){
			for(var i=0;i<this.$colNum;i++){
				this.$colArr.push(0)
			}
			var _this = this;
			this.$tagEle.each(function(){
				var minValue = Math.min.apply(null,_this.$colArr);
				var minIndex = _this.$colArr.indexOf(minValue);
				$(this).css({
					top: minValue,
					left: _this.$colWidth*minIndex
				})
				_this.$colArr[minIndex] += $(this).outerHeight(true)
			})
		 },
		 $update: function(){
		 	var _this = this
			 $(window).on('resize',function(){
			 	_this.$init()
				 _this.$layout.call(_this)
			 });
			 this.$tagEle.on('keypress',function(e){
			 	if(e.key === 'Enter'){
			 		setTimeout(function(){
			 			_this.$init.call(_this);
			 			_this.$layout.call(_this)
			 		}, 0)
			 	}
			 })
		 }
	}
	module.exports.WaterFall = WaterFall;