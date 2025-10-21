import vine from '@vinejs/vine'

export default class InvestmentValidator {
  static async invest(request: { all: () => any }) {
    const schema = vine.object({
      amount: vine.number().positive(),
      type: vine.enum(['poupanca', 'CDB', 'tesouro']).optional(),
    })
    return vine.validate({ schema, data: request.all() })
  }

  static async redeem(request: { all: () => any }) {
    const schema = vine.object({
      investmentId: vine.number(),
    })
    return vine.validate({ schema, data: request.all() })
  }
}
