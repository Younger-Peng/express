var express = require('express');
var router = express.Router();
var passport = require('passport');
var GithubStrategy = require('passport-github').Strategy;
var JirenguStrategy = require('passport-jirengu').Strategy;

passport.serializeUser(function(user,done){
	console.log('---serializeUser---');
	console.log(user);
	done(null,user)
});

passport.deserializeUser(function(obj,done){
	console.log('---deserializeUser---');
	done(null,obj);
})

passport.use(new JirenguStrategy({
	clientID: '34e7d8da247822d8b98f3a44a581ca36d3d5bcd7fa088c9f5a468c39c887b4d2',
	tokenURL: 'http://user.jirengu.com/oauth/token',
	clientSecret: '67616fff9009e5172129d60092565841663d8141a98de58d59d8d59936d774b1',
	callbackURL: 'http://localhost:3030/auth/jirengu/callback'},
	function(accessToken,refreshToken,profile,done){
		done(null,profile)
	}
));

passport.use(new GithubStrategy({
    clientID: '27773eb99a7b1a2e800d',
    clientSecret: 'ebf9d5d818aabc05dcb97252f562d4138f6f8346',
    callbackURL: "http://www.youngerpeng.com/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // User.findOrCreate({ githubId: profile.id }, function (err, user) {
    // });
    done(null, profile);
  }
));

router.get('/github', passport.authenticate('github'));


router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    req.session.user = {
      id: req.user.id,
      username: req.user.displayName || req.user.username,
      avatar: req.user._json.avatar_url,
      provider: req.user.provider
    };
    res.redirect('/');
  });
	
router.get('/jirengu',passport.authenticate('jirengu'));

router.get('/jirengu/callback',
	passport.authenticate('jirengu',{failureRedirect: '/'}),
	function(req,res){
		console.log('success...');
		console.log(req.user);
		req.session.user = {
			id: req.user._json.uid,
			username: req.user._json.name,
			avatar: req.user._json.avatar,
			provider: req.user.provider
		};
		res.redirect('/');
	});

	router.get('/logout',function(req,res){
		req.session.destroy();
		res.redirect('/');
	})

module.exports = router;
