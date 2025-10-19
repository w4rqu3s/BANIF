import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateAccountsTable extends BaseSchema {
  protected tableName = 'accounts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .unique()
      table.string('account_number').notNullable().unique()
      table.decimal('balance', 12, 2).defaultTo(0)
      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
