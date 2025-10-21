import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    name: vine.string(),
    email: vine.string().email(),
    password: vine.string().minLength(6),
    cpf: vine.string(),
    adress: vine.string(),
    role: vine.enum(['client', 'manager']),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(6),
  })
)
