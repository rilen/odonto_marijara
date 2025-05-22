// client/src/components/Financeiro.jsx

import React, { useState, useEffect } from 'react';

const Financeiro = () => {
  const [transacoes, setTransacoes] = useState([
    { id: 1, tipo: 'Receber', valor: 500, contatoId: '1', contatoNome: 'João Silva', status: 'Pendente', data: '2025-05-20' },
    { id: 2, tipo: 'Pagar', valor: 200, contatoId: '2', contatoNome: 'Materiais Dentários', status: 'Pago', data: '2025-05-19' },
  ]);
  const [novaTransacao, setNovaTransacao] = useState({
    tipo: 'Receber',
    valor: '',
    contatoId: '', // Novo campo para o ID do contato (paciente/fornecedor)
    contatoNome: '', // Novo campo para o nome do contato selecionado
    status: 'Pendente',
    data: ''
  });
  const [contatos, setContatos] = useState([]); // Lista de todos os contatos
  const [error, setError] = useState('');

  // Carregar contatos ao montar o componente
  useEffect(() => {
    const fetchContatos = async () => {
      try {
        const response = await fetch('/api/contatos');
        const data = await response.json();
        if (response.ok) {
          setContatos(data);
          setError('');
        } else {
          setError(data.message || 'Erro ao carregar contatos para transações.');
        }
      } catch (err) {
        setError('Erro ao conectar com o servidor para carregar contatos.');
        console.error('Erro ao carregar contatos para financeiro:', err);
      }
    };
    fetchContatos();
  }, []);

  const handleInputChange = (e) => {
    setNovaTransacao({ ...novaTransacao, [e.target.name]: e.target.value });
  };

  // Handler para a seleção de contato (paciente/fornecedor)
  const handleContatoSelectChange = (e) => {
    const id = e.target.value;
    const selectedContato = contatos.find(c => c.id === id);
    setNovaTransacao({
      ...novaTransacao,
      contatoId: id,
      contatoNome: selectedContato ? selectedContato.nome : ''
    });
  };

  const adicionarTransacao = () => {
    if (!novaTransacao.valor || !novaTransacao.contatoId || !novaTransacao.data) {
      setError('Preencha todos os campos obrigatórios: Valor, Paciente/Fornecedor e Data!');
      return;
    }
    if (parseFloat(novaTransacao.valor) <= 0) {
      setError('O valor deve ser maior que zero!');
      return;
    }
    setError('');

    setTransacoes([...transacoes, {
      id: transacoes.length + 1,
      ...novaTransacao,
      valor: parseFloat(novaTransacao.valor) // Garante que o valor é um número
    }]);
    setNovaTransacao({ tipo: 'Receber', valor: '', contatoId: '', contatoNome: '', status: 'Pendente', data: '' });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Gestão Financeira</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Erro: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Transações</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Tipo</th>
                  <th className="py-3 px-6 text-left">Valor (R$)</th>
                  <th className="py-3 px-6 text-left">Contato</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-left">Data</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm font-light">
                {transacoes.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-3 px-6 text-center">Nenhuma transação encontrada.</td>
                  </tr>
                ) : (
                  transacoes.map((transacao) => (
                    <tr key={transacao.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-6 text-left">{transacao.tipo}</td>
                      <td className="py-3 px-6 text-left">R$ {transacao.valor.toFixed(2)}</td>
                      <td className="py-3 px-6 text-left">{transacao.contatoNome}</td>
                      <td className="py-3 px-6 text-left">{transacao.status}</td>
                      <td className="py-3 px-6 text-left">{transacao.data}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Nova Transação</h2>
          <div className="mb-4">
            <label htmlFor="tipo" className="block text-gray-700 text-sm font-bold mb-2">Tipo:</label>
            <select
              id="tipo"
              name="tipo"
              value={novaTransacao.tipo}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            >
              <option value="Receber">Receber</option>
              <option value="Pagar">Pagar</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="valor" className="block text-gray-700 text-sm font-bold mb-2">Valor (R$):</label>
            <input
              id="valor"
              type="number"
              name="valor"
              placeholder="Valor (R$)"
              value={novaTransacao.valor}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="contato" className="block text-gray-700 text-sm font-bold mb-2">Paciente/Fornecedor:</label>
            <select
              id="contato"
              name="contatoId"
              value={novaTransacao.contatoId}
              onChange={handleContatoSelectChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            >
              <option value="">-- Selecione --</option>
              {contatos.filter(c => {
                if (novaTransacao.tipo === 'Receber') return c.tipo === 'Paciente';
                if (novaTransacao.tipo === 'Pagar') return c.tipo === 'Fornecedor';
                return true; // Should not happen with current types
              }).map(contato => (
                <option key={contato.id} value={contato.id}>
                  {contato.nome} ({contato.tipo})
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">Status:</label>
            <select
              id="status"
              name="status"
              value={novaTransacao.status}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            >
              <option value="Pendente">Pendente</option>
              <option value="Pago">Pago</option>
              <option value="Atrasado">Atrasado</option>
              <option value="Nao Pago">Não Pago</option>
            </select>
          </div>
          <div className="mb-6">
            <label htmlFor="data" className="block text-gray-700 text-sm font-bold mb-2">Data:</label>
            <input
              id="data"
              type="date"
              name="data"
              value={novaTransacao.data}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            />
          </div>
          <button
            onClick={adicionarTransacao}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 w-full"
          >
            Adicionar Transação
          </button>
        </div>
      </div>
    </div>
  );
};

export default Financeiro;
