const { ec } = require('elliptic');

class Transaction {
	constructor(from, to, amount) {
		this.from = from;
		this.to = to;
		this.amount = amount;
	}
	calculateHash() {
		let hash = createHash('sha256');
		hash.update(this.from + this.to + this.amount);
		return hash.digest('hex');
	}
	signTransaction(signingKey) {
		if (signingKey.getPublic('hex') !== this.from) {
			throw new Error('You cannot sign transactions for other wallets!');
		}
		const hashTx = this.calculateHash();
		const sig = signingKey.sign(hashTx, 'base64');
		this.signature = sig.toDER('hex');
	}
	isValid() {
		if (this.from === 'SYS') return true;
		if (!this.signature || this.signature.length === 0) {
			throw new Error('No signature in this transaction');
		}
		const publicKey = ec.keyFromPublic(this.from, 'hex');
		return publicKey.verify(this.calculateHash(), this.signature);
	}
}
module.export = { Transaction };
