import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'


import AuthController from '#controllers/auth_controller'

router.group(() => {
  router.post('/register', [AuthController, 'register']) // .use(middleware.auth())
  router.post('/login', [AuthController, 'login'])
  router.post('/logout', [AuthController, 'logout']).use(middleware.auth())
})
.prefix('/auth')

import AccountsController from '#controllers/accounts_controller'

router.group(() => {
  router.get('/', [AccountsController, 'index']).use(middleware.auth())
  router.get('/me', [AccountsController, 'show']).use(middleware.auth())
  router.post('/', [AccountsController, 'create']).use(middleware.auth())
  router.get('/history', [AccountsController, 'history']).use(middleware.auth())
}).prefix('/accounts')

import TransactionsController from '#controllers/transactions_controller'

router
.group(() => {
  router.post('/deposit', [TransactionsController, 'deposit']).use(middleware.auth())
  router.post('/withdraw', [TransactionsController, 'withdraw']).use(middleware.auth())
  router.post('/transfer', [TransactionsController, 'transfer']).use(middleware.auth())
})
.prefix('/transactions')

import InvestmentsController from '#controllers/investments_controller'

router
.group(() => {
  router.post('/invest', [InvestmentsController, 'invest']).use(middleware.auth())
  router.post('/redeem', [InvestmentsController, 'redeem']).use(middleware.auth())
  router.get('/list', [InvestmentsController, 'list']).use(middleware.auth())
})
.prefix('/investments')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})
