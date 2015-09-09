var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    originatorAddress: {
      type: String
    },
    originatorPrivateKey:{
      type: String
    },
    originatorName: {
      type: String
    },
    beneficiaryName: {
      type: String
    },
    beneficiaryAddress: {
      type: String
    },
    verifierName: {
      type: String
    },
    amount: {
      type: String
    }
});

mongoose.model('Will', schema);
