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
		return new Block(Date.parse('2017-01-01'), [], '0');
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
		if (transaction.amount <= 0) {
			throw new Error('Transaction amount must be greater than 0');
		}
		// if (this.getBalanceOfAddress(transaction.from) < transaction.amount) {
		// 	throw new Error('Not enough balance');
		// }
		this.pendingTransactions.push(transaction);
	}

	minePendingTransactions(minerAddress) {
		const rewardTx = new Transaction(null, minerAddress, this.miningReward);
		this.pendingTransactions.push(rewardTx);

		const block = new Block(
			Date.now(),
			this.pendingTransactions,
			this.getLatestBlock().hash
		);
		block.mineBlock(this.difficulty);
		this.chain.push(block);

		this.pendingTransactions = [];
	}

	isChainValid() {
		const realGenesis = JSON.stringify(this.createGenesisBlock());
		if (realGenesis !== JSON.stringify(this.chain[0])) {
			return false;
		}
		// Check the remaining blocks on the chain to see if there hashes and
		// signatures are correct
		for (let i = 1; i < this.chain.length; i++) {
			const currentBlock = this.chain[i];
			const previousBlock = this.chain[i - 1];

			if (previousBlock.hash !== currentBlock.prevHash) {
				return false;
			}

			if (!currentBlock.hasValidTransactions()) {
				return false;
			}

			if (currentBlock.hash !== currentBlock.calculateHash()) {
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
