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
                    user.coinbase.accessToken = accessToken,
                    user.coinbase.refreshToken = refreshToken
                    return user.save();
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
      var client = new Client({'accessToken':req.user.coinbase.accessToken,'refreshToken':req.user.coinbase.refreshToken});
      client.getCurrentUser(function(err,user){
        if(err){
          res.send("Need to refresh");
        }else{
          var newUser = {
            name: user.name,
            email: user.email,
            src: user.avatar_url
          };
          UserModel.findOne({'coinbase.id':req.user.coinbase.id}).then(function(currentUser){
            currentUser.name = user.name;
            currentUser.email = user.email;
            currentUser.src = user.avatar_url;
            currentUser.save().then(function(savedUser){
              client.getAccounts(function(err,accounts){
                console.log('accounts');
                console.log(accounts);
                var response = {
                  name: savedUser.name,
                  email: savedUser.email,
                  bitCoinBalance: accounts[0].balance.amount,
                  usdBalance: accounts[0].native_balance.amount,
                  coinbase: savedUser.coinbase,
                  src: savedUser.avatar_url
                }
                console.log("Response");
                console.log(response);
                res.json(response);
              })
            });
          });
        }
      });
    });
};
