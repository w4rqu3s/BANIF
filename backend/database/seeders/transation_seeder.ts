import { BaseSeeder } from '@adonisjs/lucid/seeders'

import Transaction from '#models/transaction'

export default class TransactionSeeder extends BaseSeeder {
  async run() {
    // await Transaction.createMany([
    //   { accountId: 1, type: 'deposit', amount: 3000, description: 'Depósito inicial' },
    //   { accountId: 1, type: 'withdraw', amount: 1000, description: 'Retirada' },
    //   { accountId: 1, type: 'transfer_in', amount: 100, description: 'nulo' },
    //   { accountId: 1, type: 'transfer_out', amount: 100, description: 'nulo' },
    //   { accountId: 2, type: 'transfer_in', amount: 100, description: 'nulo' },
    //   { accountId: 2, type: 'transfer_out', amount: 25, description: 'nulo' },
    //   { accountId: 2, type: 'transfer_out', amount: 250, description: 'nulo' }
    // ])
  }
}
