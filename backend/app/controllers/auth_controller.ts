import type { HttpContext } from '@adonisjs/core/http'
import UserService from '#services/user_service'
import { registerValidator, loginValidator } from '#validators/user_validator'
import UserPolicy from '#policies/user_policy'

export default class AuthController {
  /** Registrar novo usuário */
  async register({ request, response, auth }: HttpContext) {
    try {
      await UserPolicy.onlyManagers(auth)

      const payload = await request.validateUsing(registerValidator)
      const user = await UserService.register(payload)

      return response.created({
        message: 'Usuário registrado com sucesso',
        user,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Erro ao registrar usuário',
        errors: error.messages || error.message,
      })
    }
  }

  /** Login */
  async login({ request, response }: HttpContext) {
    const payload = await request.validateUsing(loginValidator)

    try {
      const result = await UserService.login(payload)
      return response.ok(result)
    } catch {
      return response.unauthorized({
        message: 'E-mail ou senha inválidos',
      })
    }
  }

  /** Logout */
  async logout({ auth, response }: HttpContext) {
    try {
      await UserService.logout(auth)
      return response.ok({ message: 'Logout realizado com sucesso' })
    } catch {
      return response.unauthorized({ message: 'Token inválido' })
    }
  }
}
