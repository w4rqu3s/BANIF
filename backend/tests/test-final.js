import fetch from 'node-fetch'

const API = 'http://localhost:3333'

// ---------------------
// 🔐 AUTH
// ---------------------
async function register(name, email, password, cpf, adress, role, token) {
  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({name, email, password, cpf, adress, role}),
  })
  return res.json()
}

async function login(email, password) {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return res.json()
}

// ---------------------
// 💰 CONTAS
// ---------------------
async function createAccount(managerToken, userId) {
  const res = await fetch(`${API}/accounts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${managerToken}`,
    },
    body: JSON.stringify({ userId }),
  })
  return res.json()
}

async function getMyAccount(clientToken) {
  const res = await fetch(`${API}/accounts/me`, {
    headers: { Authorization: `Bearer ${clientToken}` },
  })
  return res.json()
}

// ---------------------
// 💸 TRANSAÇÕES
// ---------------------
async function deposit(clientToken, amount) {
  const res = await fetch(`${API}/transactions/deposit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${clientToken}`,
    },
    body: JSON.stringify({ amount }),
  })
  return res.json()
}

async function withdraw(clientToken, amount) {
  const res = await fetch(`${API}/transactions/withdraw`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${clientToken}`,
    },
    body: JSON.stringify({ amount }),
  })
  return res.json()
}

async function transfer(clientToken, accountNumber, amount) {
  const res = await fetch(`${API}/transactions/transfer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${clientToken}`,
    },
    body: JSON.stringify({ accountNumber, amount }),
  })
  return res.json()
}

// ---------------------
// 📈 INVESTIMENTOS
// ---------------------
async function invest(clientToken, type, amount) {
  const res = await fetch(`${API}/investments/invest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${clientToken}`,
    },
    body: JSON.stringify({ type, amount }),
  })
  return res.json()
}

async function redeem(clientToken, investmentId) {
    const res = await fetch(`${API}/investments/redeem`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${clientToken}`,
    },
    body: JSON.stringify({ investmentId }),
  })
  return res.json()
}

// ---------------------
// 🧾 HISTÓRICO
// ---------------------
async function getHistory(clientToken) {
  const res = await fetch(`${API}/accounts/history`, {
    headers: { Authorization: `Bearer ${clientToken}` },
  })
  return res.json()
}

// ---------------------
// 🚀 TESTE COMPLETO
// ---------------------
async function run() {
  console.log('\n🧠 BANIF - Teste de Fluxo Completo')

  const gerenteprimario = await login('w4rqu3s@gmail.com', 'senhagenerica123')
  const tokenprimario = gerenteprimario.token.token
  console.log(tokenprimario)

  // 1️⃣ Registrar usuários
  await register('Gerente', 'gerente@banif.com', '123456', '11111111111', 'teste', 'manager', tokenprimario)
  await register('Cliente 1', 'cliente1@banif.com', '123456', '22222222222', 'teste', 'client', tokenprimario)
  await register('Cliente 2', 'cliente2@banif.com', '123456', '33333333333', 'teste', 'client', tokenprimario)

  // 2️⃣ Login
  const gerente = await login('gerente@banif.com', '123456')
  const cliente1 = await login('cliente1@banif.com', '123456')
  const cliente2 = await login('cliente2@banif.com', '123456')

  const tkGerente = gerente.token?.token || gerente.token
  const tkC1 = cliente1.token?.token || cliente1.token
  const tkC2 = cliente2.token?.token || cliente2.token

  console.log('\n✅ Tokens obtidos:\n', { tkGerente, tkC1, tkC2 })

  // 3️⃣ Gerente cria contas
  console.log('\n🏦 Criando contas...')
  await createAccount(tkGerente, 6)
  await createAccount(tkGerente, 7)

  const acc1 = await getMyAccount(tkC1)
  const acc2 = await getMyAccount(tkC2)

  console.log('\n💳 Contas criadas:')
  console.log('Cliente 1 →', acc1.accountNumber)
  console.log('Cliente 2 →', acc2.accountNumber)

  // 4️⃣ Depósitos iniciais
  console.log('\n💰 Fazendo depósitos...')
  await deposit(tkC1, 1000)
  await deposit(tkC2, 2000)

  // 5️⃣ Transferência
  console.log('\n💸 Transferindo de Cliente 1 → Cliente 2...')
  console.log(await transfer(tkC1, acc2.accountNumber, 300))

  // 6️⃣ Saque
  console.log('\n🏧 Cliente 2 saca R$ 500...')
  await withdraw(tkC2, 500)

  // 7️⃣ Investimento
  console.log('\n📈 Cliente 1 investe R$ 200 em poupança...')
  await invest(tkC1, 'poupanca', 200)
  await redeem(tkC1, 1)

  // 8️⃣ Extrato
  console.log('\n🧾 Consultando extrato do Cliente 1...')
  const hist1 = await getHistory(tkC1)
  const hist2 = await getHistory(tkC2)
  console.log(hist1)
  console.log(hist2)

  console.log('\n✅ Teste completo finalizado!')
}

run().catch(console.error)
