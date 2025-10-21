import Transaction from '#models/transaction'
import Account from '#models/account'
import db from '@adonisjs/lucid/services/db'

export default class TransactionService {

  static async deposit(userId: any, amount: any) {

    const account = await Account.findBy('user_id', userId)
    if (!account) throw new Error('Conta não encontrada')

    account.balance = parseFloat(account.balance as unknown as string)
    account.balance += Number(amount)
    await account.save()

    await Transaction.create({
      accountId: account.id,
      type: 'deposit',
      amount,
      description: 'Depósito realizado',
    })

    return account.balance
  }

  static async withdraw(userId: any, amount: number) {
    const account = await Account.findBy('user_id', userId)
    if (!account) throw new Error('Conta não encontrada')

    account.balance = parseFloat(account.balance as unknown as string)
    if (account.balance < amount) throw new Error('Saldo insuficiente')

    account.balance -= Number(amount)
    await account.save()

    await Transaction.create({
      accountId: account.id,
      type: 'withdraw',
      amount,
      description: 'Saque realizado',
    })

    return account.balance
  }

  static async transfer(fromUserId: any, toAccountNumber: string, amount: number) {

    const from = await Account.findBy('user_id', fromUserId)
    if (!from) throw new Error('Conta não encontrada')

    const to = await Account.findBy('account_number', toAccountNumber)
    if (!to) throw new Error('Conta destino inválida')

    if (from.id === to.id) throw new Error('Contas devem ser diferentes')

    from.balance = parseFloat(from.balance as unknown as string)
    to.balance = parseFloat(to.balance as unknown as string)
    if (from.balance < amount) throw new Error('Saldo insuficiente na conta de origem')

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
  }
}
