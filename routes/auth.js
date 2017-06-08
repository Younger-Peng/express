var express = require('express');
var router = express.Router();
var passport = require('passport');
var GithubStrategy = require('passport-github').Strategy;

passport.serializeUser(function(user,done){
	console.log('---serializeUser---');
	console.log(user);
	done(null,user)
});

passport.deserializeUser(function(obj,done){
	console.log('---deserializeUser---');
	done(null,obj);
})

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
	

	router.get('/logout',function(req,res){
		req.session.destroy();
		res.redirect('/');
	})

module.exports = router;
