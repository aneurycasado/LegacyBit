'use strict';
var passport = require('passport');
var CoinbaseStrategy = require('passport-coinbase').Strategy;
var mongoose = require('mongoose');
var UserModel = mongoose.model('User');
// var request = require('request');
module.exports = function (app) {
    var coinbaseConfig = app.getValue('env').COINBASE;
    var coinbaseCredentials = {
        clientID: coinbaseConfig.clientID,
        clientSecret: coinbaseConfig.clientSecret,
        callbackURL: coinbaseConfig.callbackURL,
        scope: ['user']
    };
    console.log(coinbaseCredentials);

    var verifyCallback = function (accessToken, refreshToken, profile, done) {
        console.log("Here");
        console.log(accessToken);
        UserModel.findOne({ 'coinbase.id': profile.id }).exec()
            .then(function (user) {

                if (user) {
                    return user;
                } else {
                    return UserModel.create({
                        coinbase: {
                            id: profile.id
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
    console.log(new CoinbaseStrategy(coinbaseCredentials, verifyCallback));
    passport.use(new CoinbaseStrategy(coinbaseCredentials, verifyCallback));

    app.get('/auth/coinbase', passport.authenticate('coinbase'));

    app.get('/auth/coinbase/callback',
        passport.authenticate('coinbase', { failureRedirect: '/login' }),
        function (req, res) {
            console.log("Here");
            res.redirect('/');
        });
};
