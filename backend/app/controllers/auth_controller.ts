import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthController {
  
   async register({ request, response, auth }: HttpContext) {

    if (auth.user?.role !== 'manager') {
      return response.unauthorized({ message: 'Acesso negado' })
    }

    try {
      const data = request.only(['name', 'email', 'password', 'cpf', 'adress', 'role'])
      const user = await User.create(data)

      return response.created({
        message: 'Usuário registrado com sucesso',
        user
      })
    } catch (error) {
      return response.badRequest({
        message: 'Erro ao registrar usuário',
        errors: error.messages || error.message,
      })
    }
  }


  async login({ request, response }: HttpContext) {

    const { email, password } = request.only(['email', 'password'])

    try {
        const user = await User.verifyCredentials(email, password)
        const token = await User.accessTokens.create(user, ['*'], {
        name: 'Login Token',
        expiresIn: '30 days',
      })

      return response.ok({
        message: 'Login realizado com sucesso',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      })
    } catch (e) {
      return response.unauthorized({ message: 'E-mail ou senha inválidos - ' + e })
    }
  }

   async logout({auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const token = auth.user?.currentAccessToken

      if (token) {
        await User.accessTokens.delete(user, token.identifier)
      }

      return response.ok({
        message: 'Logout realizado com sucesso',
      })
    } catch (error) {
      return response.unauthorized({
        message: 'Token inválido',
      })
    }
  }
}
