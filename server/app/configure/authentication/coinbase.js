'use strict';
var passport = require('passport');
var CoinbaseStrategy = require('passport-coinbase').Strategy;
var mongoose = require('mongoose');
var UserModel = mongoose.model('User');
var Client = require('coinbase').Client;

module.exports = function (app) {
    var coinbaseConfig = app.getValue('env').COINBASE;
    var coinbaseCredentials = {
        clientID: coinbaseConfig.clientID,
        clientSecret: coinbaseConfig.clientSecret,
        callbackURL: coinbaseConfig.callbackURL,
        scope: ['user']
    };
    var verifyCallback = function (accessToken, refreshToken, profile, done) {
        UserModel.findOne({ 'coinbase.id': profile.id }).exec()
            .then(function (user) {
                if (user) {
                    return user;
                }else{
                    return UserModel.create({
                        coinbase: {
                            id: profile.id,
                            accessToken: accessToken,
                            refreshToken: refreshToken
                        }
                    });
                }
            }).then(function (userToLogin) {
                done(null, userToLogin);
            }, function (err) {
                console.error('Error creating user from COINBASE authentication', err);
                done(err);
            });
    };
    passport.use(new CoinbaseStrategy(coinbaseCredentials, verifyCallback));

    app.get('/auth/coinbase', passport.authenticate('coinbase'));

    app.get('/auth/coinbase/callback',
        passport.authenticate('coinbase', { failureRedirect: '/login' }),
        function (req, res) {
            console.log("Here");
            res.redirect('/');
        });
    app.get('/coinbase/getUser', function(req,res){
      console.log(req.user);
      var client = new Client({'accessToken':req.user.coinbase.accessToken,'refreshToken':req.user.coinbase.refreshToken});
      client.getAccounts(function(err,accounts){
        accounts.forEach(function(acct){
          console.log('my bal: ' + acct.balance.amount + ' for ' + acct.name);
        });
      });
      res.json(req.user);
    });
};
