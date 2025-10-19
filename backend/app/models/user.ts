import { DateTime } from 'luxon'
import { BaseModel, column, hasOne} from '@adonisjs/lucid/orm'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import hash from '@adonisjs/core/services/hash'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { compose } from '@adonisjs/core/helpers'
import type { HasOne } from '@adonisjs/lucid/types/relations'

import Account from './account.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {

  @column({ isPrimary: true })
  declare id: number
  
  @column()
  declare name: string
  
  @column()
  declare email: string
  
  @column({ serializeAs: null })
  declare password: string
  
  @column()
  declare cpf: string

  @column()
  declare adress: string
  
  @column()
  declare role: 'manager' | 'client'
  
  @hasOne(() => Account)
  declare account: HasOne<typeof Account>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime


  static accessTokens = DbAccessTokensProvider.forModel(User)

}
