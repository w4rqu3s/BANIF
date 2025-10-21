import { Authenticator } from "@adonisjs/auth"
import { Authenticators } from "@adonisjs/auth/types"

export default class UserPolicy {
  static async onlyManagers( auth :Authenticator<Authenticators>): Promise<void> {
    await auth.check()

    if (auth.user?.role !== 'manager') {
      throw new Error('Acesso negado: apenas gerentes podem executar esta ação')
    }
  }
}
