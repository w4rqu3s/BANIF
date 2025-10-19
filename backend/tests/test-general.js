// Teste completo: criar usuários, fazer login e criar contas

async function register(nome, email, senha, cpf, funcao) {
  const response = await fetch('http://localhost:3333/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: nome,
      email: email,
      password: senha,
      cpf: cpf,
      role: funcao,
    }),
  })

  const data = await response.json()
  console.log(`✅ Registro (${nome}):`, data)
  return data
}

async function login(email, senha) {
  const response = await fetch('http://localhost:3333/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password: senha,
    }),
  })

  const data = await response.json()
  console.log(`🔐 Login (${email}):`, data)
  return data.token?.token // Retorna o token real (oat_...)
}

async function createAccount(tokenAuth, id) {
  const response = await fetch('http://localhost:3333/accounts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenAuth}`,
    },
    body: JSON.stringify({ userId: id }),
  })

  const data = await response.json()
  console.log(`🏦 Criar conta (User ${id}):`, data)
}

async function getAllAccounts(tokenAuth) {
  const response = await fetch('http://localhost:3333/accounts', {
    headers: { Authorization: `Bearer ${tokenAuth}` },
  })
  const data = await response.json()
  console.log('📋 Todas as contas:', data)
}

async function getMyAccount(tokenAuth) {
  const response = await fetch('http://localhost:3333/accounts/me', {
    headers: { Authorization: `Bearer ${tokenAuth}` },
  })
  const data = await response.json()
  console.log('💳 Minha conta:', data)
}

async function logoutAccount(tokenAuth) {
  const response = await fetch('http://localhost:3333/auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenAuth}`, 
    },
  })

  const data = await response.json()
  console.log('📩 Resposta do servidor:\n', data)
}

async function deposit(accountId, amount, tokenAuth) {
  const res = await fetch('http://localhost:3333/transactions/deposit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenAuth}`,
    },
    body: JSON.stringify({ accountId, amount }),
  })
  console.log('💰 Depósito:', await res.json())
}

async function withdraw(accountId, amount, tokenAuth) {
  const res = await fetch('http://localhost:3333/transactions/withdraw', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenAuth}`,
    },
    body: JSON.stringify({ accountId, amount }),
  })
  console.log('🏧 Saque:', await res.json())
}

async function transfer(fromAccountId, toAccountId, amount, tokenAuth) {
  const res = await fetch('http://localhost:3333/transactions/transfer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenAuth}`,
    },
    body: JSON.stringify({ fromAccountId, toAccountId, amount }),
  })
  console.log('🔁 Transferência:', await res.json())
}

async function history(tokenAuth) {
  const res = await fetch(`http://localhost:3333/accounts/history`, {
    headers: { Authorization: `Bearer ${tokenAuth}` },
  })
  console.log('📜 Histórico:', await res.json())
}

async function invest(accountId, type, amount, tokenAuth) {
  const res = await fetch('http://localhost:3333/investments/invest', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenAuth}`,
    },
    body: JSON.stringify({ accountId, type, amount}),
  })
  console.log('💰 Aplicação:', await res.json())
}

async function redeem(investmentId, tokenAuth) {
  const res = await fetch('http://localhost:3333/investments/redeem', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenAuth}`,
    },
    body: JSON.stringify({ investmentId }),
  })
  console.log('💸 Resgate:', await res.json())
}

async function list(accountId, tokenAuth) {
  const res = await fetch(`http://localhost:3333/investments/list?accountId=${accountId}`, {
    headers: { Authorization: `Bearer ${tokenAuth}` },
  })
  console.log('📊 Investimentos:', await res.json())
}


// 🧠 Função principal — executa tudo em sequência
async function main() {
  console.log('🚀 Iniciando testes BANIF...\n')
  
  // Etapa 1: registrar usuários
  await register('Cliente 1', 'cliente1@banif.com', '0', '11111111111', 'client')
  await register('Cliente 2', 'cliente2@banif.com', '0', '22222222222', 'client')
  await register('Gerente', 'gerente@banif.com', '0', '11369835973', 'manager')
  
  // Etapa 2: login e obtenção de tokens
  const tokenc1 = await login('cliente1@banif.com', '0')
  const tokenc2 = await login('cliente2@banif.com', '0')
  const tokeng1 = await login('gerente@banif.com', '0')

  // Etapa 3: criar contas
  // await createAccount(tokenc1, 1) // cliente 1 criando a própria conta
  await createAccount(tokeng1, 1) // gerente criando conta para cliente 1
  await createAccount(tokeng1, 2) // gerente criando conta para cliente 2
  // await createAccount(tokeng1, 2) // gerente criando outra conta para cliente 2

  // Etapa 4: verificar
  await getMyAccount(tokenc1)
  // await getAllAccounts(tokenc1)
  // await getAllAccounts(tokeng1)

  await deposit(1, 1000, tokenc1)
  // await withdraw(1, 200, tokenc1)
  // await transfer(1, 2, 100, tokenc1)
  // await history(1, tokenc1)
  // await history(2, tokenc1)
  // await history(5, tokenc1)
  // await transfer(1, 2, 100000, tokenc1)
  // await history(1, tokenc1)
  // await history(2, tokenc1)
  
  // Exemplo:
  await invest(1, 'CDB', 200, tokenc1)
  await list(1, tokenc1)
  await redeem(1, tokenc1)
  await list(1, tokenc1)

  await getMyAccount(tokenc1)
  
  await logoutAccount(tokenc1)
  await logoutAccount(tokenc2)
  await logoutAccount(tokeng1)
  // await logoutAccount(tokenc1)

  console.log('\n✅ Testes concluídos com sucesso!')
}

// main().catch(console.error)

const tokenw = await login('w4rqu3s@gmail.com', 'senha')
const token2 = await login('fran90@gmail.com', '12345678910')
await getAllAccounts(tokenw)
await history(tokenw)
await history(token2)
