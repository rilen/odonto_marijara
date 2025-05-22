// client/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importe seus componentes
import Contatos from './components/Contatos.jsx'; // Certifique-se de que o caminho está correto
import Anamnese from './components/Anamnese.jsx'; // Certifique-se de que o caminho está correto
import Agendamento from './components/Agendamento.jsx'; // Seu componente de agendamento
import GestaoUsuarios from './components/GestaoUsuarios.jsx'; // Seu componente de gestão de usuários
import Financeiro from './components/Financeiro.jsx'; // Seu componente financeiro

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota para a página de contatos */}
        <Route path="/contatos" element={<Contatos />} />

        {/* Rota para a anamnese, esperando um ID de paciente na URL */}
        <Route path="/anamnese/:pacienteId" element={<Anamnese />} />
        {/* Rota para anamnese sem ID (para quando o usuário acessa diretamente ou precisa selecionar) */}
        <Route path="/anamnese" element={<Anamnese />} />

        {/* Outras rotas da sua aplicação */}
        <Route path="/agendamento" element={<Agendamento />} />
        <Route path="/usuarios" element={<GestaoUsuarios />} />
        <Route path="/financeiro" element={<Financeiro />} />

        {/* Rota padrão ou home */}
        <Route path="/" element={<p className="p-4">Bem-vindo ao sistema Odonto Marijara!</p>} />
        {/* Adicione outras rotas conforme necessário */}
      </Routes>
    </Router>
  );
}

export default App;
