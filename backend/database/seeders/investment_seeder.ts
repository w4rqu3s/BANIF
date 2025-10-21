import Investment from '#models/investment'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class InvestmentSeeder extends BaseSeeder {
  async run() {
      // await Investment.createMany([
      //     {accountId: 1, type: 'poupanca', amount: 200, yieldRate: 0.5, status: 'active'},
      //     {accountId: 1, type: 'poupanca', amount: 250, yieldRate: 0.5, status: 'redeemed'},
      //     {accountId: 1, type: 'CDB', amount: 250, yieldRate: 15, status: 'active'},
      //     {accountId: 1, type: 'tesouro', amount: 250, yieldRate: 10, status: 'redeemed'},
      //   ])
  }
}