const { Transaction } = require('./transaction');
const { Block } = require('./block');

class MCoin {
	constructor() {
		this.chain = [this.createGenesisBlock()];
		this.difficulty = 5;
		this.pendingTransactions = [];
		this.miningReward = 10;
	}

	createGenesisBlock() {
		return new Block(0, 'Genesis Block', '0');
	}

	getLatestBlock() {
		return this.chain[this.chain.length - 1];
	}

	addTransaction(transaction) {
		if (!transaction.from || !transaction.to) {
			throw new Error('Transaction must include from and to');
		}
		if (!transaction.isValid()) {
			throw new Error('Cannot add invalid transaction to chain');
		}
		this.pendingTransactions.push(transaction);
	}

	minePendingTransactions(minerAddress) {
		let block = new Block(Date.now(), this.pendingTransactions);
		block.mineBlock(this.difficulty);
		this.chain.push(block);
		this.pendingTransactions = [
			new Transaction('SYS', minerAddress, this.miningReward),
		];
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
			if (!currentBlock.hasValidTransactions()) {
				return false;
			}
		}
		return true;
	}
	getBalanceOfAddress(address) {
		let balance = 0;
		for (const block of this.chain) {
			for (const transaction of block.transactions) {
				if (transaction.from === address) {
					balance -= transaction.amount;
				}
				if (transaction.to === address) {
					balance += transaction.amount;
				}
			}
		}
		return balance;
	}
}
module.exports = { MCoin };
