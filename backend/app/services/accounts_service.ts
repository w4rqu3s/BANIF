import Account from '#models/account'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'

export default class AccountService {

  static async create(userId: any) {
    const user = await User.find(userId)
    if (!user) throw new Error('Usuário não encontrado')

    const accountNumber = 'BAN' + Math.floor(100000 + Math.random() * 900000)
    const account = await Account.create({
      userId,
      accountNumber,
      balance: 0,
    })

    return account
  }
  static async show(userId: any) {
    const account = await Account.findBy('user_id', userId)
    if (!account) throw new Error('Conta não encontrada')
    return account
  }

  static async index() {
    const accounts = await Account.query().preload('user')
    return accounts
  }

  static async history(userId: any) {
    const account = await Account.query()
      .where('user_id', userId)
      .first()

    if (!account) throw new Error('Conta não encontrada')

    const history = await db
      .from('account_history')
      .where('account_id', account.id)
      .orderBy('date', 'desc')

    return { account, history }
  }
}
