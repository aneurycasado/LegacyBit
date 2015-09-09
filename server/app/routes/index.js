'use strict';
var router = require('express').Router();
module.exports = router;

router.use('/members', require('./members'));
router.use('/will', require('./will'));



// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    console.log("Here");
    res.status(404).end();
});
