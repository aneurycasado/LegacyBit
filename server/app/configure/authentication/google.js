'use strict';

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
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

    var googleConfig = app.getValue('env').GOOGLE;

    var googleCredentials = {
        clientID: googleConfig.clientID,
        clientSecret: googleConfig.clientSecret,
        callbackURL: googleConfig.callbackURL
    };

    var verifyCallback = function (accessToken, refreshToken, profile, done) {

        UserModel.findOne({ 'google.id': profile.id }).exec()
            .then(function (user) {
                if (user) {
                    return user;
                } else {
                    var newPrivateKey = bitcore.PrivateKey("testnet");
                    var newPublicKey = newPrivateKey.toPublicKey();
                    return UserModel.create({
                        privateKey: newPrivateKey,
                        address: newPublicKey,
                        google: {
                            id: profile.id
                        }
                    });
                }
            }).then(function (userToLogin) {
                done(null, userToLogin);
            }, function (err) {
                console.error('Error creating user from Google authentication', err);
                done(err);
            });

    };

    passport.use(new GoogleStrategy(googleCredentials, verifyCallback));

    app.get('/auth/google', passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    }));

    app.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/login' }),
        function (req, res) {
            res.redirect('/');
        });

};
