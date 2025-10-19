import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

import Investment from '#models/investment'
import Account from '#models/account'
// import Transaction from '#models/transaction'

export default class InvestmentsController {

  async invest({ auth, request, response }: HttpContext) {

    const { amount } = request.only([ 'amount' ])
    const type = 'poupanca'

    const user = auth.user!
    const account = await Account.findBy('user_id', user.id)

    if (!account) return response.notFound({message: 'Conta não encontrada'})

    var yieldRate = 0
    if (type == 'poupanca') {
      yieldRate = 0.5
    } else if (type == 'CDB') {
      yieldRate = 15
    } else if (type == 'tesouro') {
      yieldRate = 10
    }

    if (account.balance < amount)
      return response.badRequest({ message: 'Saldo insuficiente para aplicar' })

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

    return response.ok({ message: 'Investimento realizado com sucesso' })
  }

  async redeem({ auth, request, response }: HttpContext) {

    const { investmentId } = request.only(['investmentId'])

    const investment = await Investment.find(investmentId)

    if (!investment) return response.notFound({ message: 'Investimento não encontrado' })

    if (investment.status === 'redeemed')
      return response.badRequest({ message: 'Investimento já resgatado' })

    const user = auth.user!
    const account = await Account.findBy('user_id', user.id)
    if (!account) return response.notFound({ message: 'Conta não encontrada' })

    const rendimento = (investment.amount * (investment.yieldRate / 100)).toFixed(2)
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

    return response.ok({
      message: 'Resgate realizado com sucesso',
      total: totalResgate,
    })
  }

  async list({ auth, response }: HttpContext) {

    const user = auth.user!
    const account = await Account.findBy('user_id', user.id)

    if (!account) return response.notFound({message: 'Conta não encontrada'})

    const investments = await Investment.query()
      .where('account_id', account.id)
      .orderBy('id', 'desc')

    return response.ok(investments)
  }
}
