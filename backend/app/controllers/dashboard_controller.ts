import db from '@adonisjs/lucid/services/db'
import Account from '#models/account'
import Transaction from '#models/transaction'
import Investment from '#models/investment'
import { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {

  async manager({ response }: HttpContext) {
    const totalAccounts = await Account.query().count('* as total')
    const totalBalance = await Account.query().sum('balance as total')
    const totalInvestments = await Investment.query().sum('amount as total')
    const totalTransactions = await Transaction.query().count('* as total')

    const recentTransactions = await Transaction.query()
      .orderBy('created_at', 'desc')
      .limit(10)

    return response.ok({
      stats: {
        contas: totalAccounts[0].$extras.total,
        saldo_total: totalBalance[0].$extras.total,
        investimentos: totalInvestments[0].$extras.total,
        transacoes: totalTransactions[0].$extras.total,
      },
      recentes: recentTransactions,
    })
  }

  async client({ auth, response }: HttpContext) {
    const user = auth.user!
    const account = await Account.findBy('user_id', user.id)

    if (!account) {
      return response.notFound({ message: 'Conta não encontrada' })
    }

    const transactions = await db
      .from('transactions')
      .where('account_id', account.id)
      .orderBy('created_at', 'desc')
    //   .limit(5)

    // Investimentos ativos
    const investments = await Investment.query()
        .where('account_id', account.id)
        .orderByRaw(`CASE WHEN status = 'active' THEN 0 ELSE 1 END`)
        .orderBy('id', 'desc')

    return response.ok({
      account: {
        number: account.accountNumber,
        saldo: account.balance,
      },
      resumo: {
        investimentos: investments.length
      },
      ultimas_transacoes: transactions,
      investments,
    })
  }
}
