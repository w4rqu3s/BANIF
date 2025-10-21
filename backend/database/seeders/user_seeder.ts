import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class UserSeeder extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        name: 'Victor Pecine Marques',
        email: 'w4rqu3s@gmail.com',
        password: 'senhagenerica123',
        cpf: '11369835973',
        adress: 'Paranaguá PR Justo Éris Almada Insfran 19',
        role: 'manager'
      },
      {
        name: 'Francisco Romeu Caicedo',
        email: 'fran90@gmail.com',
        password: '12345678910',
        cpf: '12345678900',
        adress: 'São Paulo SP Lorem Ipslum 276',
        role: 'client'
      },
      {
        name: 'Lucas Pecine Marques',
        email: 'lucpecmarq2@gmail.com',
        password: 'gelatinus',
        cpf: '06498731099',
        adress: 'Londres UK Lorem Ipslum 77',
        role: 'client'
      },
      {
        name: 'Hanae Rosa Terato Ramos',
        email: 'hanae.rosa09@gmail.com',
        password: '123456',
        cpf: '00000000000',
        adress: 'Paranguá PR Cominese 1909',
        role: 'manager'
      }
    ])
  }
}
