import React, { useState, lazy, Suspense } from 'react';
const Contatos = lazy(() => import('./contatos.js'));
const Agendamento = lazy(() => import('./agendamento.js'));
const Financeiro = lazy(() => import('./financeiro.js'));
const Estoque = lazy(() => import('./estoque.js'));
const Relatorios = lazy(() => import('./relatorios.js'));
const Odontograma = lazy(() => import('./odontograma.js'));
const Notificacoes = lazy(() => import('./notificacoes.js'));
const Dashboard = lazy(() => import('./dashboard.js'));
const Configuracoes = lazy(() => import('./configuracoes.js'));
const Anamnese = lazy(() => import('./anamnese.js'));
const Treinamento = lazy(() => import('./treinamento.js'));
const Suporte = lazy(() => import('./suporte.js'));
const Avaliacao = lazy(() => import('./avaliacao.js'));

const App = () => {
  const [modulo, setModulo] = useState('Dashboard');
  const [user, setUser] = useState(null);
  const [loginAttempts, setLoginAttempts] = useState(0);

  const login = (role) => {
    if (loginAttempts >= 5) {
      alert('Conta bloqueada! Contate o suporte.');
      return;
    }
    setUser({ role });
    setLoginAttempts(0);
  };

  const handleFailedLogin = () => {
    setLoginAttempts(loginAttempts + 1);
    if (loginAttempts + 1 >= 5) {
      alert('Conta bloqueada após 5 tentativas! Notificação enviada.');
    } else {
      alert(`Tentativa ${loginAttempts + 1}/5 falhou. Tente novamente.`);
    }
  };

  const renderModulo = () => {
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
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {!user ? (
        <div className="max-w-md mx-auto mt-8 p-4">
          <h2 className="text-xl font-bold">Login</h2>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            onClick={() => login('admin')}
          >
            Entrar como Admin
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded mt-4 ml-2"
            onClick={handleFailedLogin}
          >
            Simular Falha de Login
          </button>
          {loginAttempts > 0 && <p className="text-red-500 mt-2">Tentativas: {loginAttempts}/5</p>}
        </div>
      ) : (
        <div>
          <nav className="bg-blue-600 text-white p-4">
            <ul className="flex space-x-4 flex-wrap">
              {['Dashboard', 'Contatos', 'Agendamento', 'Financeiro', 'Estoque', 'Relatorios', 'Odontograma', 'Notificacoes', 'Configuracoes', 'Anamnese', 'Treinamento', 'Suporte', 'Avaliacao'].map(m => (
                <li key={m}>
                  <button onClick={() => setModulo(m)} className="hover:underline">{m}</button>
                </li>
              ))}
            </ul>
          </nav>
          <Suspense fallback={<div className="text-center mt-8">Carregando...</div>}>
            {renderModulo()}
          </Suspense>
        </div>
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
