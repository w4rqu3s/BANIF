import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'create_account_history_views'

  async up() {
    this.schema.raw(`
      CREATE VIEW account_history AS
      SELECT
        t.id AS record_id,
        t.account_id,
        t.type,
        t.amount,
        t.description,
        t.created_at AS date,
        'transaction' AS origin
      FROM transactions t
      UNION ALL
      SELECT
        i.id AS record_id,
        i.account_id,
        CASE
          WHEN i.status = 'active' THEN 'investment_active'
          WHEN i.status = 'redeemed' THEN 'investment_redeemed'
          ELSE 'investment'
        END AS type,
        i.amount,
        i.type AS description,
        i.created_at AS date,
        'investment' AS origin
      FROM investments i
      ORDER BY date DESC;
    `)
  }

  async down() {
    this.schema.raw(`DROP VIEW IF EXISTS account_history;`)
  }
}