import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

import Transaction from '#models/transaction'
import Account from '#models/account'

export default class TransactionsController {

  async deposit({ auth, request, response }: HttpContext) {

    const { amount } = request.only(['amount'])

    const user = auth.user!
    const account = await Account.findBy('user_id', user.id)
    
    if (!account) return response.notFound({ message: 'Conta não encontrada' })

    account.balance = parseFloat(account.balance as unknown as string)
    account.balance += Number(amount)
    
    await account.save()

    await Transaction.create({
      accountId: account.id,
      type: 'deposit',
      amount,
      description: 'Depósito realizado',
    })

    return response.ok({ message: 'Depósito efetuado com sucesso', saldo: account.balance })
  }

  async withdraw({ auth, request, response }: HttpContext) {

    const { amount } = request.only(['amount'])

    const user = auth.user!
    const account = await Account.findBy('user_id', user.id)

    if (!account) return response.notFound({ message: 'Conta não encontrada' })

    account.balance = parseFloat(account.balance as unknown as string)

    if (account.balance < amount)
      return response.badRequest({ message: 'Saldo insuficiente' })

    account.balance -= Number(amount)
    await account.save()

    await Transaction.create({
      accountId: account.id,
      type: 'withdraw',
      amount,
      description: 'Saque realizado',
    })

    return response.ok({ message: 'Saque efetuado com sucesso', saldo: account.balance })
  }

  async transfer({ auth, request, response }: HttpContext) {

    const { toAccountId, amount } = request.only([ 'toAccountId', 'amount' ])

    const user = auth.user!
    const fromAccountId = await Account.findBy('user_id', user.id)

    if (!fromAccountId) return response.notFound({message: 'Conta não encontrada'})

    if (fromAccountId.id === toAccountId)
      return response.badRequest({ message: 'Contas devem ser diferentes' })

    const from = await Account.find(fromAccountId)
    const to = await Account.find(toAccountId)

    if (!from || !to) return response.notFound({ message: 'Conta de origem ou destino inválida' })

    from.balance = parseFloat(from.balance as unknown as string)
    to.balance = parseFloat(to.balance as unknown as string)

    if (from.balance < amount)
      return response.badRequest({ message: 'Saldo insuficiente na conta de origem' })

    await db.transaction(async (trx) => {
      from.useTransaction(trx)
      to.useTransaction(trx)

      from.balance -= Number(amount)
      to.balance += Number(amount)

      await from.save()
      await to.save()

      const outTx = new Transaction()
      outTx.useTransaction(trx)
      outTx.merge({
        accountId: from.id,
        type: 'transfer_out',
        amount,
        description: `Transferência para conta ${to.accountNumber}`,
      })
      await outTx.save()

      const inTx = new Transaction()
      inTx.useTransaction(trx)
      inTx.merge({
        accountId: to.id,
        type: 'transfer_in',
        amount,
        description: `Transferência recebida de conta ${from.accountNumber}`,
      })
      await inTx.save()
    })


    return response.ok({ message: 'Transferência realizada com sucesso' })
  }
}
