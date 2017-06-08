var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var loginData;
	if(req.session.user){
		loginData = {
			isLogin: true,
			user: {
				username: req.session.user.username,
				avatar: req.session.user.avatar
			}
		}			
	}else{
		loginData = {isLogin: false}
	}
  res.render('index', loginData);
});

module.exports = router;
