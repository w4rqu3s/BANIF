import type { HttpContext } from '@adonisjs/core/http'
import InvestmentService from '#services/investments_service'
import InvestmentValidator from '#validators/investment_validator'

export default class InvestmentsController {

  async invest({ auth, request, response }: HttpContext) {
    try {
      const { amount, type } = await InvestmentValidator.invest(request)
      const result = await InvestmentService.invest(auth.user!.id, amount, type)
      return response.ok(result)
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  async redeem({ auth, request, response }: HttpContext) {
    try {
      const { investmentId } = await InvestmentValidator.redeem(request)
      const result = await InvestmentService.redeem(auth.user!.id, investmentId)
      return response.ok(result)
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  async list({ auth, response }: HttpContext) {
    try {
      const investments = await InvestmentService.list(auth.user!.id)
      return response.ok(investments)
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }
}
