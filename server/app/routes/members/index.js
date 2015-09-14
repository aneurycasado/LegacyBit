'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
module.exports = router;
var _ = require('lodash');
var bitcore = require('bitcore');
var Chain = require('chain-node');
var chain = new Chain({
  keyId: '2f287deb0f8a9d951e6709403481743b',
  keySecret: '3d90cf057bf0479080dd2978e6dd0066',
  blockChain: 'testnet3'
});
var User = mongoose.model('User');

var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};


router.get('/user-info', ensureAuthenticated, function (req, res) {
    if(req.user.coinbase !== undefined){
        res.json(req.user);
    }else{
        chain.getAddress(req.user.address, function(err,resp){
           req.user.balance = resp[0].confirmed.balance;
           req.user.received = resp[0].confirmed.received;
           req.user.sent = resp[0].confirmed.sent;
           var info = {
             user: req.user,
             balance: resp[0].confirmed.balance,
             received: resp[0].confirmed.received,
             sent: resp[0].confirmed.sent
           };
           console.log(info);
           res.json(info);
        });
    }
});
router.get('/:name',function(req,res){
  User.find({name: req.params.name}).then(function(user){
    res.json(user[0]);
  });
});
