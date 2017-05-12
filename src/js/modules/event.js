var EventCenter = (function (){

	var events = {}
	function on(evt,handler){
		events[evt] = events[evt] || [];
		events[evt].push({
			handler: handler
		})
	}
	function fire(evt,args){
		if(!events[evt]){
			return
		}else {
			for(var i=0;i<events[evt].length;i++){
				events[evt][i].handler(args)
			}
		}
	}
	function off(evt){
		if(!events[evt]){
			return
		}else {
			events[evt] = [];
		}
	}
	return {
		on: on,
		fire: fire,
		off: off
	}
	
}())

module.exports = EventCenter;