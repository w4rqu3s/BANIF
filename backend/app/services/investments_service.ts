import Investment from '#models/investment'
import Account from '#models/account'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class InvestmentService {

  static async invest(userId: any, amount: number, type = 'poupanca') {
    const account = await Account.findBy('user_id', userId)
    if (!account) throw new Error('Conta não encontrada')

    let yieldRate = 0
    if (type === 'poupanca') yieldRate = 0.5
    else if (type === 'CDB') yieldRate = 15
    else if (type === 'tesouro') yieldRate = 10

    if (account.balance < amount) throw new Error('Saldo insuficiente para aplicar')

    await db.transaction(async (trx) => {
      account.useTransaction(trx)
      account.balance = parseFloat(account.balance as unknown as string)
      account.balance -= Number(amount)
      await account.save()

      const investment = new Investment()
      investment.useTransaction(trx)
      investment.merge({
        accountId: account.id,
        type,
        amount,
        yieldRate,
        status: 'active',
      })
      await investment.save()
    })

    return { message: 'Investimento realizado com sucesso' }
  }

  static async redeem(userId: any, investmentId: any) {
    const investment = await Investment.find(investmentId)
    if (!investment) throw new Error('Investimento não encontrado')
    if (investment.status === 'redeemed') throw new Error('Investimento já resgatado')

    const account = await Account.findBy('user_id', userId)
    if (!account) throw new Error('Conta não encontrada')

    const rendimento = (investment.amount * (investment.yieldRate / 100))
    const totalResgate = Number(investment.amount) + Number(rendimento)

    await db.transaction(async (trx) => {
      account.useTransaction(trx)
      investment.useTransaction(trx)

      account.balance = parseFloat(account.balance as unknown as string)
      account.balance += totalResgate
      investment.merge({
        status: 'redeemed',
        redeemedAt: DateTime.local()
      })

      await account.save()
      await investment.save()
    })

    return { message: 'Resgate realizado com sucesso', total: totalResgate }
  }

  static async list(userId: any) {
    const account = await Account.findBy('user_id', userId)
    if (!account) throw new Error('Conta não encontrada')

    const investments = await Investment.query()
      .where('account_id', account.id)
      .orderBy('id', 'desc')

    return investments
  }
}
