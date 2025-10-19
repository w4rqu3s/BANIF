import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'investments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('account_id')
        .unsigned()
        .references('id')
        .inTable('accounts')
        .onDelete('CASCADE')

      table.string('type').notNullable() // Ex: 'CDB', 'Tesouro Direto', 'Poupança'
      table.decimal('amount', 12, 2).notNullable()
      table.decimal('yield_rate', 5, 2).defaultTo(0) // rendimento %
      table.enum('status', ['active', 'redeemed']).defaultTo('active')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('redeemed_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
