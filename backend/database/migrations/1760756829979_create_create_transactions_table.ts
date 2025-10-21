import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('account_id')
        .unsigned()
        .references('id')
        .inTable('accounts')
        .onDelete('CASCADE')
      table.enum('type', ['deposit', 'withdraw', 'transfer_in', 'transfer_out', 'investment_applied']).notNullable()
      table.decimal('amount', 12, 2).notNullable()
      table.string('description')
      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
