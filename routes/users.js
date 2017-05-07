var express = require('express');
var router = express.Router();

/* GET users listing. */

// router.use(function(req,res,next){
// 	setTimeout(function(){
// 		res.send('resond with a next')
// 	}, 2000)
// 	next()
// })
// router.use(function(req,res,next){
// 	res.send('respond with a resource');
// })



router.use('/abc/:id',function(req, res, next) {
	console.log('first abc')
	console.log(req.params.id,typeof req.params.id)

  setTimeout(function(){
  	if(req.params.id === ':1000') next()
  	else {
  		console.log('Request URL:',req.originalUrl);
  		next()
  	}
	},0)
}, function(req,res,next){
	console.log('second abc');
	setTimeout(function(){
		var data = {name: "Peng",age: 28,work:["web-front","designer","painter"]}
		console.log('Request Type',req.method)
		res.render('rocks',data)
	}, 0)
	
});


router.use('/def',function(req, res, next) {
	console.log('this is next')
  setTimeout(function(){
  	req.query.test="def"
  	next()
  }, 1000)
});



router.get('/abc', function(req, res, next) {
	console.log('final abc')
  setTimeout(function(){
  	res.send('respond with a resource abc and 9 seconds has passed!');
  }, 3000)
});

router.get('/def', function(req, res, next) {
  res.send('respond with a resource def'+req.query.test);
});
module.exports = router;
