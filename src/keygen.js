const { ec: EC } = require('elliptic');

const ec = new EC('secp256k1');

const key = ec.genKeyPair();
module.exports = { key };
