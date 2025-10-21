import { BaseSeeder } from '@adonisjs/lucid/seeders'

import UserSeeder from './user_seeder.js'
import AccountSeeder from './account_seeder.js'
import TransactionSeeder from './transation_seeder.js'
import InvestmentSeeder from './investment_seeder.js'

export default class DatabaseSeeder extends BaseSeeder {
  public async run() {
    await new UserSeeder(this.client).run()
    // await new AccountSeeder(this.client).run()
    // await new TransactionSeeder(this.client).run()
    // await new InvestmentSeeder(this.client).run()
  }
}
