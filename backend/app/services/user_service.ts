import User from '#models/user'
import AccountService from './accounts_service.js'

export default class UserService {
  /** Criação de usuário */
  static async register(data: {
    name: string
    email: string
    password: string
    cpf: string
    adress: string
    role: 'client' | 'manager'
  }) {
    const user = await User.create(data)
    await AccountService.create(user.id)
    return user
  }

  /** Login */
  static async login({ email, password }: { email: string; password: string }) {
    const user = await User.verifyCredentials(email, password)

    const token = await User.accessTokens.create(user, ['*'], {
      name: 'Login Token',
      expiresIn: '30 days',
    })

    return {
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }
  }

  /** Logout */
  static async logout(auth: any) {
    const user = await auth.getUserOrFail()
    const token = auth.user?.currentAccessToken

    if (token) {
      await User.accessTokens.delete(user, token.identifier)
    }
  }
}
