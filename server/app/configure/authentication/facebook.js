'use strict';
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var mongoose = require('mongoose');
var UserModel = mongoose.model('User');
var bitcore = require('bitcore');
var Chain = require('chain-node');
var chain = new Chain({
  keyId: '2f287deb0f8a9d951e6709403481743b',
  keySecret: '3d90cf057bf0479080dd2978e6dd0066',
  blockChain: 'testnet3'
});
module.exports = function (app) {

    var facebookConfig = app.getValue('env').FACEBOOK;

    var facebookCredentials = {
        clientID: facebookConfig.clientID,
        clientSecret: facebookConfig.clientSecret,
        callbackURL: facebookConfig.callbackURL
    };

    var verifyCallback = function (accessToken, refreshToken, profile, done) {

        UserModel.findOne({ 'facebook.id': profile.id }).exec()
            .then(function (user) {

                if (user) {
                    return user;
                } else {
                    var newPrivateKey = bitcore.PrivateKey("testnet");
                    var newPublicKey = newPrivateKey.toPublicKey();
                    return UserModel.create({
                        privateKey: newPrivateKey,
                        address: newPublicKey,
                        facebook: {
                            id: profile.id
                        }
                    });
                }

            }).then(function (userToLogin) {
                done(null, userToLogin);
            }, function (err) {
                console.error('Error creating user from Facebook authentication', err);
                done(err);
            })

    };

    passport.use(new FacebookStrategy(facebookCredentials, verifyCallback));

    app.get('/auth/facebook', passport.authenticate('facebook'));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/login' }),
        function (req, res) {
            res.redirect('/');
        });

};
