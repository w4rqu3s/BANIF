import React, { createContext, useState, useEffect } from 'react';

// Criação do contexto
export const UserContext = createContext(null);

// Provider que vai envolver a aplicação
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Exemplo: carregar usuário salvo no localStorage ao iniciar o app
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Exemplo: salvar no localStorage sempre que o user mudar
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  // Valor compartilhado com toda a aplicação
  const value = {
    user,
    setUser,
    logout: () => setUser(null),
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
