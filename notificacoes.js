import React, { useState } from 'react';

const Notificacoes = () => {
  const [notificacoes, setNotificacoes] = useState([
    { id: 1, tipo: 'E-mail', destinatario: 'joao@email.com', mensagem: 'Consulta confirmada para 21/05/2025', status: 'Enviado', data: '2025-05-20' },
    { id: 2, tipo: 'WhatsApp', destinatario: '+5511999999999', mensagem: 'Lembrete: consulta amanhã às 10h', status: 'Pendente', data: '2025-05-20' },
  ]);
  const [novaNotificacao, setNovaNotificacao] = useState({ tipo: 'E-mail', destinatario: '', mensagem: '', status: 'Pendente' });

  const handleInputChange = (e) => {
    setNovaNotificacao({ ...novaNotificacao, [e.target.name]: e.target.value });
  };

  const enviarNotificacao = () => {
    if (novaNotificacao.destinatario && novaNotificacao.mensagem) {
      setNotificacoes([...notificacoes, { id: notificacoes.length + 1, ...novaNotificacao, data: new Date().toISOString().split('T')[0] }]);
      setNovaNotificacao({ tipo: 'E-mail', destinatario: '', mensagem: '', status: 'Pendente' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold">Notificações</h1>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="col-span-2 bg-white p-4 rounded shadow">
          <h2 className="text-xl">Histórico de Notificações</h2>
          <table className="w-full mt-4 border">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Destinatário</th>
                <th>Mensagem</th>
                <th>Status</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {notificacoes.map((notificacao) => (
                <tr key={notificacao.id}>
                  <td>{notificacao.tipo}</td>
                  <td>{notificacao.destinatario}</td>
                  <td>{notificacao.mensagem}</td>
                  <td>{notificacao.status}</td>
                  <td>{notificacao.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl">Nova Notificação</h2>
          <select
            name="tipo"
            value={novaNotificacao.tipo}
            onChange={handleInputChange}
            className="border p-2 w-full mt-2"
          >
            <option value="E-mail">E-mail</option>
            <option value="WhatsApp">WhatsApp</option>
          </select>
          <input
            type="text"
            name="destinatario"
            placeholder="E-mail ou Telefone"
            value={novaNotificacao.destinatario}
            onChange={handleInputChange}
            className="border p-2 w-full mt-2"
          />
          <textarea
            name="mensagem"
            placeholder="Mensagem"
            value={novaNotificacao.mensagem}
            onChange={handleInputChange}
            className="border p-2 w-full mt-2"
          />
          <button
            onClick={enviarNotificacao}
            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notificacoes;