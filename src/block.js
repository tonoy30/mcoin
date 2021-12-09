const { createHash } = require('crypto');
class Block {
	constructor(timestamp, transactions, prevHash = '') {
		this.timestamp = timestamp;
		this.transactions = transactions;
		this.prevHash = prevHash;
		this.hash = this.calculateHash();
		this.nonce = 0;
	}
	calculateHash() {
		let hash = createHash('sha256');
		hash.update(
			this.timestamp +
				JSON.stringify(this.transactions) +
				this.prevHash +
				this.nonce
		);
		return hash.digest('hex');
	}
	mineBlock(difficulty) {
		while (
			this.hash.substring(0, difficulty) !==
			Array(difficulty + 1).join('0')
		) {
			this.nonce++;
			this.hash = this.calculateHash();
		}
		console.log('Block mined: ' + this.hash);
	}
	hasValidTransactions() {
		for (const transaction of this.transactions) {
			if (!transaction.isValid()) {
				return false;
			}
		}
		return true;
	}
}
module.exports = { Block };
