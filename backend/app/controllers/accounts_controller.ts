import type { HttpContext } from '@adonisjs/core/http'

import Account from '#models/account'
import User from '#models/user'
// import Transaction from '#models/transaction'
import db from '@adonisjs/lucid/services/db'

export default class AccountsController {

  async create({ request, auth, response }: HttpContext) {

    if (auth.user?.role !== 'manager') {
      return response.unauthorized({ message: 'Acesso negado' })
    }

    const { userId } = request.only(['userId']) // usar cpf?

    const user = await User.find(userId)
    if (!user) return response.notFound({ message: 'Usuário não encontrado' })

    const accountNumber = 'BAN' + Math.floor(100000 + Math.random() * 900000)
    const account = await Account.create({
      userId,
      accountNumber,
      balance: 0,
    })

    return response.created({ message: 'Conta criada com sucesso', account })
  }

  async show({ auth, response }: HttpContext) {

    const user = auth.user!
    const account = await Account.findBy('user_id', user.id)

    if (!account) return response.notFound({ message: 'Conta não encontrada' })
    return response.ok(account)
  }

  async index({ auth, response }: HttpContext) {

    if (auth.user?.role !== 'manager') {
      return response.unauthorized({ message: 'Acesso negado' })
    }

    const accounts = await Account.query().preload('user')

    return response.ok(accounts)
  }

  // async history({ request, response }: HttpContext) {

  //   const { accountId } = request.only(['accountId'])

  //   const account = await Account.find(accountId)
  //   if (!account) return response.notFound({ message: 'Conta não encontrada' })

  //   const transactions = await Transaction.query()
  //     .where('account_id', accountId)
  //     .orderBy('created_at', 'desc')
  //   // implementar junção com a lista de investimentos
  //   return response.ok(transactions)
  // }

  async history({ auth, response }: HttpContext) {
    
    const user = auth.user!
    const account = await user.related('account').query().first()

    if (!account) return response.notFound({ message: 'Conta não encontrada' })

    const history = await db
      .from('account_history')
      .where('account_id', account.id)
      .orderBy('date', 'desc')

    return response.ok({ account, history })
  }
}
