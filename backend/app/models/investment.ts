import { BaseModel, column, belongsTo} from '@adonisjs/lucid/orm'
import Account from './account.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

export default class Investment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare accountId: number

  @column()
  declare type: string

  @column()
  declare amount: number

  @column()
  declare yieldRate: number

  @column()
  declare status: 'active' | 'redeemed'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime()
  declare redeemedAt?: DateTime

  @belongsTo(() => Account)
  declare account: BelongsTo<typeof Account>
}
