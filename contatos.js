import React, { useState } from 'react';

const Contatos = () => {
  const [contatos, setContatos] = useState([
    { id: 1, nome: 'João Silva', tipo: 'Paciente', telefone: '11999999999', email: 'joao@email.com', odontograma: 'Link' },
    { id: 2, nome: 'Maria Santos', tipo: 'Paciente', telefone: '11888888888', email: 'maria@email.com', odontograma: 'Link' },
  ]);
  const [novoContato, setNovoContato] = useState({ nome: '', tipo: 'Paciente', telefone: '', email: '' });
  const [busca, setBusca] = useState('');

  const handleInputChange = (e) => {
    setNovoContato({ ...novoContato, [e.target.name]: e.target.value });
  };

  const adicionarContato = () => {
    if (!novoContato.nome || !novoContato.telefone || !novoContato.email) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }
    setContatos([...contatos, { id: contatos.length + 1, ...novoContato, odontograma: 'Link' }]);
    setNovoContato({ nome: '', tipo: 'Paciente', telefone: '', email: '' });
  };

  const contatosFiltrados = contatos.filter(c => 
    c.nome.toLowerCase().includes(busca.toLowerCase()) || c.telefone.includes(busca)
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold">Contatos</h1>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="col-span-2 bg-white p-4 rounded shadow">
          <h2 className="text-xl">Lista de Contatos</h2>
          <input
            type="text"
            placeholder="Buscar por nome ou CPF"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="border p-2 w-full mt-2"
          />
          <table className="w-full mt-4 border">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Telefone</th>
                <th>E-mail</th>
                <th>Odontograma</th>
              </tr>
            </thead>
            <tbody>
              {contatosFiltrados.map((contato) => (
                <tr key={contato.id}>
                  <td>{contato.nome}</td>
                  <td>{contato.tipo}</td>
                  <td>{contato.telefone}</td>
                  <td>{contato.email}</td>
                  <td><a href="#" className="text-blue-500">{contato.odontograma}</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl">Novo Contato</h2>
          <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={novoContato.nome}
            onChange={handleInputChange}
            className="border p-2 w-full mt-2"
          />
          <select
            name="tipo"
            value={novoContato.tipo}
            onChange={handleInputChange}
            className="border p-2 w-full mt-2"
          >
            <option value="Paciente">Paciente</option>
            <option value="Fornecedor">Fornecedor</option>
            <option value="Dentista">Dentista</option>
          </select>
          <input
            type="text"
            name="telefone"
            placeholder="Telefone"
            value={novoContato.telefone}
            onChange={handleInputChange}
            className="border p-2 w-full mt-2"
          />
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={novoContato.email}
            onChange={handleInputChange}
            className="border p-2 w-full mt-2"
          />
          <button
            onClick={adicionarContato}
            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contatos;
