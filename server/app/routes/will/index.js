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

router.post('/create', function (req, res) {
    res.json(req.body);
    Will.create(req.body).then(function(createdWill){
      res.json(createdWill);
    });
    // chain.getAddress(req.user.address, function(err,resp){
    //    //console.log(resp[0].confirmed);
    //    req.user.balance = resp[0].confirmed.balance;
    //    req.user.received = resp[0].confirmed.received;
    //    req.user.sent = resp[0].confirmed.sent;
    //    var info = {
    //      user: req.user,
    //      balance: resp[0].confirmed.balance,
    //      received: resp[0].confirmed.received,
    //      sent: resp[0].confirmed.sent
    //    };
    //    console.log(info);
    //    res.json(info);
    // });
    // var newPrivateKey = bitcore.PrivateKey("testnet");
    // console.log(newPrivateKey.toString());
    // var newPublicKey = newPrivateKey.toPublicKey();
    // console.log(newPublicKey.toAddress().toString());
    // chain.transact(
    //   {
    //     inputs: [
    //       {
    //         address: req.user.address,
    //         private_key: req.user.privateKey
    //       }
    //     ],
    //     outputs: [
    //       {
    //         address: 'mg2oBJBVhcAiqtE6uDKGc3vtKnfetNWLqi',
    //         amount: 60000
    //       }
    //     ]
    //   },function(err,response){
    //     if(err){
    //       console.log(err);
    //     }else{
    //       console.log(response);
    //     }
    // });
    // var theStash = [
    //     'http://ep.yimg.com/ay/candy-crate/bulk-candy-store-2.gif',
    //     'http://www.dailybunny.com/.a/6a00d8341bfd0953ef0148c793026c970c-pi',
    //     'http://images.boomsbeat.com/data/images/full/44019/puppy-wink_1-jpg.jpg',
    //     'http://p-fst1.pixstatic.com/51071384dbd0cb50dc00616b._w.540_h.610_s.fit_.jpg',
    //     'http://childcarecenter.us/static/images/providers/2/89732/logo-sunshine.png',
    //     'http://www.allgraphics123.com/ag/01/10683/10683.jpg',
    //     'http://img.pandawhale.com/post-23576-aflac-dancing-duck-pigeons-vic-RU0j.gif',
    //     'http://www.eveningnews24.co.uk/polopoly_fs/1.1960527.1362056030!/image/1301571176.jpg_gen/derivatives/landscape_630/1301571176.jpg',
    //     'http://media.giphy.com/media/vCKC987OpQAco/giphy.gif',
    //     'https://my.vetmatrixbase.com/clients/12679/images/cats-animals-grass-kittens--800x960.jpg',
    //     'http://www.dailymobile.net/wp-content/uploads/2014/10/lollipops.jpg'
    // ];
});
