import type { HttpContext } from '@adonisjs/core/http'
import AccountService from '#services/accounts_service'
import UserPolicy from '#policies/user_policy'

export default class AccountsController {

  async create({ request, auth, response }: HttpContext) {

    try {
      await UserPolicy.onlyManagers(auth)

      const { userId } = request.only(['userId'])

      const account = await AccountService.create(userId)

      return response.created({
        message: 'Conta criada com sucesso',
        account
      })
    } catch (error) {
      return response.badRequest({
        message: error.message || 'Erro ao criar conta',
      })
    }
  }

  async show({ auth, response }: HttpContext) {
    try {
      const userId = auth.user!.id
      const account = await AccountService.show(userId)
      return response.ok(account)
    } catch (error) {
      return response.notFound({
        message: error.message
      })
    }
  }

  async index({ auth, response }: HttpContext) {
    try {
      await UserPolicy.onlyManagers(auth)
      const accounts = await AccountService.index()
      return response.ok(accounts)
    } catch (error) {
      return response.unauthorized({
        message: error.message
      })
    }
  }

  async history({ auth, response }: HttpContext) {
    try {
      const userId = auth.user!.id
      const result = await AccountService.history(userId)
      return response.ok(result)
    } catch (error) {
      return response.notFound({
        message: error.message
      })
    }
  }
}
