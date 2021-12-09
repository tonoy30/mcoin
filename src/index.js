const { MCoin } = require('./mcoin');
const { Transaction } = require('./transaction');
const { key } = require('./keygen');
const walletId = key.getPublic('hex');

const mcoin = new MCoin();
const tx1 = new Transaction(walletId, '0x123', 5);
tx1.signTransaction(key);
mcoin.addTransaction(tx1);
mcoin.minePendingTransactions(walletId);
console.log(mcoin.getBalanceOfAddress(walletId));
mcoin.minePendingTransactions(walletId);
console.log(mcoin.getBalanceOfAddress(walletId));
console.log(mcoin.chain);
console.log(mcoin.isChainValid());
