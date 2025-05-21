import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { lazy, Suspense } from 'react';

const Contatos = lazy(() => import('./Contatos.jsx'));
const Agendamento = lazy(() => import('./Agendamento.jsx'));
const Financeiro = lazy(() => import('./Financeiro.jsx'));
const Estoque = lazy(() => import('./Estoque.jsx'));
const Relatorios = lazy(() => import('./Relatorios.jsx'));
const Odontograma = lazy(() => import('./Odontograma.jsx'));
const Notificacoes = lazy(() => import('./Notificacoes.jsx'));
const Dashboard = lazy(() => import('./Dashboard.jsx'));
const Configuracoes = lazy(() => import('./Configuracoes.jsx'));
const Anamnese = lazy(() => import('./Anamnese.jsx'));
const Treinamento = lazy(() => import('./Treinamento.jsx'));
const Suporte = lazy(() => import('./Suporte.jsx'));
const Avaliacao = lazy(() => import('./Avaliacao.jsx'));
const GestaoUsuarios = lazy(() => import('./GestaoUsuarios.jsx'));

const App = () => {
  const [modulo, setModulo] = useState('Dashboard');
  const [user, setUser] = useState(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const login = async (e) => {
    e.preventDefault();
    if (loginAttempts >= 5) {
      alert('Conta bloqueada! Contate o suporte.');
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setUser({ id: data.id, email: data.email, role: data.role, modulos: data.modulos });
        setLoginAttempts(0);
        setEmail('');
        setPassword('');
        setError('');
      } else {
        setLoginAttempts(loginAttempts + 1);
        setError(data.message || 'E-mail ou senha inválidos.');
        if (loginAttempts + 1 >= 5) {
          alert('Conta bloqueada após 5 tentativas! Notificação enviada.');
        }
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor.');
    }
  };

  const logout = () => {
    setUser(null);
    setModulo('Dashboard');
    setLoginAttempts(0);
  };

  const renderModulo = () => {
    if (!user || !user.modulos.includes(modulo)) {
      return <div className="text-center mt-8">Acesso não autorizado!</div>;
    }
    switch (modulo) {
      case 'Contatos': return <Contatos />;
      case 'Agendamento': return <Agendamento />;
      case 'Financeiro': return <Financeiro />;
      case 'Estoque': return <Estoque />;
      case 'Relatorios': return <Relatorios />;
      case 'Odontograma': return <Odontograma />;
      case 'Notificacoes': return <Notificacoes />;
      case 'Dashboard': return <Dashboard />;
      case 'Configuracoes': return <Configuracoes />;
      case 'Anamnese': return <Anamnese />;
      case 'Treinamento': return <Treinamento />;
      case 'Suporte': return <Suporte />;
      case 'Avaliacao': return <Avaliacao />;
      case 'GestaoUsuarios': return <GestaoUsuarios />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {!user ? (
        <div className="max-w-md mx-auto mt-8 p-4">
          <h2 className="text-xl font-bold">Login</h2>
          <form onSubmit={login} className="mt-4">
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 w-full mb-2"
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 w-full mb-2"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Entrar
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {loginAttempts > 0 && <p className="text-red-500 mt-2">Tentativas: {loginAttempts}/5</p>}
          </form>
        </div>
      ) : (
        <div>
          <nav className="bg-blue-600 text-white p-4">
            <div className="flex justify-between items-center">
              <ul className="flex space-x-4 flex-wrap">
                {user.modulos.map((m) => (
                  <li key={m}>
                    <button
                      onClick={() => setModulo(m)}
                      className="hover:underline"
                    >
                      {m}
                    </button>
                  </li>
                ))}
              </ul>
              <div>
                <span className="mr-4">{user.email} ({user.role})</span>
                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Sair
                </button>
              </div>
            </div>
          </nav>
          <Suspense fallback={<div className="text-center mt-8">Carregando...</div>}>
            {renderModulo()}
          </Suspense>
        </div>
      )}
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);
