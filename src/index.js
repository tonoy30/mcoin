const { MCoin } = require('./mcoin');
const { Transaction } = require('./transaction');
const { ec } = require('./keygen');
const key = ec.genKeyPair();
const key1 = ec.genKeyPair();

const walletId = key.getPublic('hex');
const walletId1 = key1.getPublic('hex');
console.log(walletId);
console.log(walletId1);

const mcoin = new MCoin();
const tx = new Transaction(walletId, walletId1, 5);
const tx1 = new Transaction(walletId1, walletId, 15);

tx.signTransaction(key);
tx1.signTransaction(key1);

mcoin.addTransaction(tx);
mcoin.addTransaction(tx1);

mcoin.minePendingTransactions(walletId);
console.log(mcoin.getBalanceOfAddress(walletId));

mcoin.minePendingTransactions(walletId1);
console.log(mcoin.getBalanceOfAddress(walletId1));

console.log(mcoin.chain);
console.log(mcoin.isChainValid());
