import { BaseSeeder } from '@adonisjs/lucid/seeders'

import Account from '#models/account'

export default class AccountSeeder extends BaseSeeder {
  async run() {
    await Account.createMany([
      { userId: 1, accountNumber: 'BAN0001', balance: 2500 },
      { userId: 2, accountNumber: 'BAN0002', balance: 2000 },
      { userId: 3, accountNumber: 'BAN0003', balance: 1000 },
      { userId: 4, accountNumber: 'BAN0004', balance: 500 },
    ])
  }
}
