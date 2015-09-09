'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
module.exports = router;
var _ = require('lodash');
var bitcore = require('bitcore');
var Will = mongoose.model('Will');
var Chain = require('chain-node');
var chain = new Chain({
  keyId: '2f287deb0f8a9d951e6709403481743b',
  keySecret: '3d90cf057bf0479080dd2978e6dd0066',
  blockChain: 'testnet3'
});

// var ensureAuthenticated = function (req, res, next) {
//     if (req.isAuthenticated()) {
//         next();
//     } else {
//         res.status(401).end();
//     }
// };
router.get("/", function(req,res){
  console.log("Get All Wills");
  Will.find().then(function(wills){
    res.json(wills);
  });
});

router.get("/:id", function(req,res){
  Will.findById(req.params.id).then(function(will){
    chain.transact(
      {
        inputs: [
          {
            address: will.originatorAddress,
            private_key: will.originatorPrivateKey
          }
        ],
        outputs: [
          {
            address: will.beneficiaryAddress,
            amount: will.amount
          }
        ]
      },function(err,response){
        if(err){
          console.log("Error");
          console.log(err);
        }else{
          console.log("Success");
          console.log(response);
        }
    });
    res.json(will);
  });
});

router.delete("/:id", function(req,res){
  console.log("Get One Will");
  Will.findByIdAndRemove(req.params.id).then(function(will){
    console.log(will);
    res.json(will);
  });
});

router.post('/create', function (req, res) {
    res.json(req.body);
    Will.create(req.body).then(function(createdWill){
      res.json(createdWill);
    });
});
