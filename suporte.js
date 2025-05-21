import React, { useState } from 'react';

const Suporte = () => {
  const [tickets, setTickets] = useState([
    { id: 1, assunto: 'Erro no agendamento', status: 'Aberto', data: '2025-05-20' },
  ]);
  const [novoTicket, setNovoTicket] = useState({ assunto: '', mensagem: '' });
  const [faq, setFaq] = useState('');

  const handleInputChange = (e) => {
    setNovoTicket({ ...novoTicket, [e.target.name]: e.target.value });
  };

  const criarTicket = () => {
    if (!novoTicket.assunto || !novoTicket.mensagem) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }
    setTickets([...tickets, { id: tickets.length + 1, ...novoTicket, status: 'Aberto', data: new Date().toISOString().split('T')[0] }]);
    setNovoTicket({ assunto: '', mensagem: '' });
  };

  const responderFaq = () => {
    if (!faq) {
      alert('Digite uma pergunta!');
      return;
    }
    const respostas = {
      'agendamento': 'Verifique o módulo Agendamento e selecione uma data válida.',
      'erro': 'Tente limpar o cache ou contate o suporte técnico.'
    };
    const resposta = Object.keys(respostas).find(key => faq.toLowerCase().includes(key));
    alert(resposta ? respostas[resposta] : 'Pergunta não encontrada. Crie um ticket.');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold">Suporte</h1>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="col-span-2 bg-white p-4 rounded shadow">
          <h2 className="text-xl">Tickets de Suporte</h2>
          <table className="w-full mt-4 border">
            <thead>
              <tr>
                <th>Assunto</th>
                <th>Status</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.assunto}</td>
                  <td>{ticket.status}</td>
                  <td>{ticket.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl">Novo Ticket</h2>
          <input
            type="text"
            name="assunto"
            placeholder="Assunto"
            value={novoTicket.assunto}
            onChange={handleInputChange}
            className="border p-2 w-full mt-2"
          />
          <textarea
            name="mensagem"
            placeholder="Descreva o problema"
            value={novoTicket.mensagem}
            onChange={handleInputChange}
            className="border p-2 w-full mt-2"
          />
          <button
            onClick={criarTicket}
            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
          >
            Enviar Ticket
          </button>
          <h2 className="text-xl mt-4">FAQ</h2>
          <input
            type="text"
            placeholder="Digite sua dúvida"
            value={faq}
            onChange={(e) => setFaq(e.target.value)}
            className="border p-2 w-full mt-2"
          />
          <button
            onClick={responderFaq}
            className="bg-green-500 text-white px-4 py-2 mt-2 rounded"
          >
            Consultar FAQ
          </button>
        </div>
      </div>
    </div>
  );
};

export default Suporte;
