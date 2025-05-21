import React, { useState } from 'react';

const Financeiro = () => {
  const [transacoes, setTransacoes] = useState([
    { id: 1, tipo: 'Receber', valor: 500, paciente: 'João Silva', status: 'Pendente', data: '2025-05-20' },
    { id: 2, tipo: 'Pagar', valor: 200, fornecedor: 'Materiais Dentários', status: 'Pago', data: '2025-05-19' },
  ]);
  const [novaTransacao, setNovaTransacao] = useState({ tipo: 'Receber', valor: '', paciente: '', status: 'Pendente', data: '' });

  const handleInputChange = (e) => {
    setNovaTransacao({ ...novaTransacao, [e.target.name]: e.target.value });
  };

  const adicionarTransacao = () => {
    if (!novaTransacao.valor || !novaTransacao.paciente || !novaTransacao.data) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }
    if (novaTransacao.valor <= 0) {
      alert('O valor deve ser maior que zero!');
      return;
    }
    setTransacoes([...transacoes, { id: transacoes.length + 1, ...novaTransacao }]);
    setNovaTransacao({ tipo: 'Receber', valor: '', paciente: '', status: 'Pendente', data: '' });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold">Gestão Financeira</h1>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="col-span-2 bg-white p-4 rounded shadow">
          <h2 className="text-xl">Transações</h2>
          <table className="w-full mt-4 border">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Valor (R$)</th>
                <th>Paciente/Fornecedor</th>
                <th>Status</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {transacoes.map((transacao) => (
                <tr key={transacao.id}>
                  <td>{transacao.tipo}</td>
                  <td>{transacao.valor}</td>
                  <td>{transacao.paciente || transacao.fornecedor}</td>
                  <td>{transacao.status}</td>
                  <td>{transacao.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl">Nova Transação</h2>
          <select
            name="tipo"
            value={novaTransacao.tipo}
            onChange={handleInputChange}
            className="border p-2 w-full mt-2"
          >
            <option value="Receber">Receber</option>
            <option value="Pagar">Pagar</option>
          </select>
          <input
            type="number"
            name="valor"
            placeholder="Valor (R$)"
            value={novaTransacao.valor}
            onChange={handleInputChange}
            className="border p-2 w-full mt-2"
          />
          <input
            type="text"
            name="paciente"
            placeholder="Paciente/Fornecedor"
            value={novaTransacao.paciente}
            onChange={handleInputChange}
            className="border p-2 w-full mt-2"
          />
          <select
            name="status"
            value={novaTransacao.status}
            onChange={handleInputChange}
            className="border p-2 w-full mt-2"
          >
            <option value="Pendente">Pendente</option>
            <option value="Pago">Pago</option>
          </select>
          <input
            type="date"
            name="data"
            value={novaTransacao.data}
            onChange={handleInputChange}
            className="border p-2 w-full mt-2"
          />
          <button
            onClick={adicionarTransacao}
            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Financeiro;
