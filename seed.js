/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/

var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('./server/db');
var User = Promise.promisifyAll(mongoose.model('User'));

var seedUsers = function () {

    var users = [
        {
            email: 'goku@dbz.com',
            password: 'password',
            privateKey: '064331f42f33e6ae85e8e9d8f8531d1cbd5756e007153f123839af430e3c367c',
            address: 'mngTeocevDNjLMddwpJ6QyznQUjxeNFNdq',
            src: 'http://www.4geekslikeyou.com/wp-content/uploads/2014/02/goku_by_maffo1989-d4vxux4.png',
            name: 'Goku'
        },
        {
            email: 'gohan@dbz.com',
            password: 'password',
            privateKey: '270354d8a5544ef2e19be824916c771701bd6fe6c8d9d5d9f0171a4247e63819',
            address: 'mg2oBJBVhcAiqtE6uDKGc3vtKnfetNWLqi',
            src: 'http://orig10.deviantart.net/cbb6/f/2013/033/2/c/kid_gohan_saiyan_saga_by_majingoku77-d5tkvhn.png',
            name: 'Gohan'
        },
        {
          email: 'krillin@dbz.com',
          password: 'password',
          address: 'N/A',
          privateKey: 'N/A',
          src: 'http://vignette2.wikia.nocookie.net/vsbattles/images/e/e8/Krillin_with_hair.png/revision/latest?cb=20150317093302',
          name: 'Krillin'
        }
    ];
    return User.createAsync(users);
};

connectToDb.then(function () {
    User.findAsync({}).then(function (users) {
        if (users.length === 0) {
            return seedUsers();
        } else {
            console.log(chalk.magenta('Seems to already be user data, exiting!'));
            process.kill(0);
        }
    }).then(function () {
        console.log(chalk.green('Seed successful!'));
        process.kill(0);
    }).catch(function (err) {
        console.error(err);
        process.kill(1);
    });
});
