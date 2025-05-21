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
  const [idioma, setIdioma] = useState('Português');

  const traducoes = {
    Português: { login: 'Entrar como Admin', falha: 'Simular Falha de Login', tentativas: 'Tentativas' },
    Inglês: { login: 'Login as Admin', falha: 'Simulate Login Failure', tentativas: 'Attempts' },
    Espanhol: { login: 'Iniciar sesión como Admin', falha: 'Simular fallo de inicio de sesión', tentativas: 'Intentos' },
  };

  const login = (role) => {
    if (loginAttempts >= 5) {
      alert(traducoes[idioma].tentativas + ': Conta bloqueada! Contate o suporte.');
      return;
    }
    setUser({ role });
    setLoginAttempts(0);
  };

  const handleFailedLogin = () => {
    setLoginAttempts(loginAttempts + 1);
    if (loginAttempts + 1 >= 5) {
      alert(traducoes[idioma].tentativas + ': Conta bloqueada após 5 tentativas! Notificação enviada.');
    }
  };

  const renderModulo = () => {
    switch (modulo) {
      case 'Contatos': return <Contatos idioma={idioma} />;
      case 'Agendamento': return <Agendamento idioma={idioma} />;
      case 'Financeiro': return <Financeiro idioma={idioma} />;
      case 'Estoque': return <Estoque idioma={idioma} />;
      case 'Relatorios': return <Relatorios idioma={idioma} />;
      case 'Odontograma': return <Odontograma idioma={idioma} />;
      case 'Notificacoes': return <Notificacoes idioma={idioma} />;
      case 'Dashboard': return <Dashboard idioma={idioma} />;
      case 'Configuracoes': return <Configuracoes idioma={idioma} setIdioma={setIdioma} />;
      case 'Anamnese': return <Anamnese idioma={idioma} />;
      case 'Treinamento': return <Treinamento idioma={idioma} />;
      case 'Suporte': return <Suporte idioma={idioma} />;
      case 'Avaliacao': return <Avaliacao idioma={idioma} />;
      default: return <Dashboard idioma={idioma} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {!user ? (
        <div className="max-w-md mx-auto mt-8 p-4">
          <h2 className="text-xl">{traducoes[idioma].login}</h2>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            onClick={() => login('admin')}
          >
            {traducoes[idioma].login}
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded mt-4 ml-2"
            onClick={handleFailedLogin}
          >
            {traducoes[idioma].falha}
          </button>
          {loginAttempts > 0 && <p>{traducoes[idioma].tentativas}: {loginAttempts}/5</p>}
        </div>
      ) : (
        <div>
          <nav className="bg-blue-600 text-white p-4">
            <ul className="flex space-x-4 flex-wrap">
              {['Dashboard', 'Contatos', 'Agendamento', 'Financeiro', 'Estoque', 'Relatorios', 'Odontograma', 'Notificacoes', 'Configuracoes', 'Anamnese', 'Treinamento', 'Suporte', 'Avaliacao'].map(m => (
                <li key={m}>
                  <button onClick={() => setModulo(m)} className="hover:underline">
                    {traducoes[idioma][m] || m}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <Suspense fallback={<div>Carregando...</div>}>
            {renderModulo()}
          </Suspense>
        </div>
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
