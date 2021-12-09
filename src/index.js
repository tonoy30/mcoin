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
}

class MCoin {
	constructor() {
		this.chain = [this.createGenesisBlock()];
		this.difficulty = 5;
	}
	createGenesisBlock() {
		return new Block(0, 'Genesis Block', '0');
	}
	getLatestBlock() {
		return this.chain[this.chain.length - 1];
	}
	addBlock(newBlock) {
		newBlock.prevHash = this.getLatestBlock().hash;
		newBlock.mineBlock(this.difficulty);
		this.chain.push(newBlock);
	}
	isValid() {
		for (let i = 1; i < this.chain.length; i++) {
			const currentBlock = this.chain[i];
			const prevBlock = this.chain[i - 1];
			if (currentBlock.hash !== currentBlock.calculateHash()) {
				return false;
			}
			if (currentBlock.prevHash !== prevBlock.hash) {
				return false;
			}
		}
		return true;
	}
}
const mCoin = new MCoin();
const block = new Block('15/06/2020', { amount: 10 });
const block2 = new Block('14/07/2020', { amount: 10 });
mCoin.addBlock(block);
mCoin.addBlock(block2);
console.log(mCoin);
