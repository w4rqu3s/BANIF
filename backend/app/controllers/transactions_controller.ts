import type { HttpContext } from '@adonisjs/core/http'
import TransactionService from '#services/transactions_service'
import TransactionValidator from '#validators/transaction_validator'

export default class TransactionsController {

  async deposit({ auth, request, response }: HttpContext) {

    try {
      
      const { amount } = await TransactionValidator.number(request)
      
      const saldo = await TransactionService.deposit(auth.user!.id, amount)

      return response.ok({ message: 'Depósito efetuado com sucesso', saldo })

    } catch (error) {

      return response.badRequest({ message: error.message })
    }
  }

  async withdraw({ auth, request, response }: HttpContext) {
    try {
      const { amount } = await TransactionValidator.number(request)
      
      const saldo = await TransactionService.withdraw(auth.user!.id, amount)
      return response.ok({ message: 'Saque efetuado com sucesso', saldo })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  async transfer({ auth, request, response }: HttpContext) {
    try {
      const { accountNumber, amount } = await TransactionValidator.transfer(request)

      await TransactionService.transfer(auth.user!.id, accountNumber, amount)

      return response.ok({ message: 'Transferência realizada com sucesso' })

    } catch (error) {

      return response.badRequest({ message: error.message })

    }
  }
}
