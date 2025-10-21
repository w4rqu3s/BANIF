import vine from '@vinejs/vine'

export default class TransactionValidator {

    static async number(request: { all: () => any }) {
        const schema = vine.object({
            amount: vine.number().positive(),
        })
        return vine.validate({ schema, data: request.all() })
    }

    static async transfer(request: { all: () => any }) {
        console.log(request.all)
        const schema = vine.object({
            accountNumber: vine
                .string()
                .regex(/^BAN\d{6}$/),
            amount: vine.number().positive()
        })
        return vine.validate({ schema, data: request.all() })
    }
}
