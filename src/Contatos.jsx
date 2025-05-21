```
import React, { useState, useEffect } from 'react';

const Contatos = () => {
  const [contatos, setContatos] = useState([
    { id: 1, nome: 'João Silva', cpf: '123.456.789-00', tipo: 'Paciente', telefone: '(11) 99999-0000' },
    { id: 2, nome: 'Dr. Ana', cpf: '987.654.321-00', tipo: 'Dentista', telefone: '(11) 98888-1111' },
  ]);
  const [novoContato, setNovoContato] = useState({ nome: '', cpf: '', tipo: 'Paciente', telefone: '' });
  const [search, setSearch] = useState('');
  const [editando, setEditando] = useState(null);

  const handleInputChange = (e) => {
    setNovoContato({ ...novoContato, [e.target.name]: e.target.value });
  };

  const adicionarOuEditarContato = () => {
    if (!novoContato.nome || !novoContato.cpf || !novoContato.telefone) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }
    if (editando) {
      setContatos(contatos.map((c) => (c.id === editando.id ? { id: c.id, ...novoContato } : c)));
      setEditando(null);
    } else {
      setContatos([...contatos, { id: contatos.length + 1, ...novoContato }]);
    }
    setNovoContato({ nome: '', cpf: '', tipo: 'Paciente', telefone: '' });
  };

  const editarContato = (contato) => {
    setEditando(contato);
    setNovoContato({ nome: contato.nome, cpf: contato.cpf, tipo: contato.tipo, telefone: contato.telefone });
  };

  const excluirContato = (id) => {
    if (window.confirm('Excluir contato?')) {
      setContatos(contatos.filter((c) => c.id !== id));
    }
  };

  const filteredContatos = contatos.filter(
    (c) => c.nome.toLowerCase().includes(search.toLowerCase()) || c.cpf.includes(search)
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold">Gestão de Contatos</h1>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="col-span-2 bg-white p-4 rounded shadow">
          <h2 className="text-xl">Contatos</h2>
          <input
            type="text"
            placeholder="Buscar por Nome ou CPF"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 w-full mt-2"
          />
          <table className="w-full mt-4 border">
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Tipo</th>
                <th>Telefone</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredContatos.map((contato) => (
                <tr key={contato.id}>
                  <td>{contato.nome}</td>
                  <td>{contato.cpf}</td>
                  <td>{contato.tipo}</td>
                  <td>{contato.telefone}</td>
                  <td>
                    <button
                      onClick={() => editarContato(contato)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => excluirContato(contato.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl">{editando ? 'Editar Contato' : 'Novo Contato'}</h2>
          <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={novoContato.nome}
            onChange={handleInputChange}
            className="border p-2 w-full mt-2"
          />
          <input
            type="text"
            name="cpf"
            placeholder="CPF"
            value={novoContato.cpf}
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
            <option value="Dentista">Dentista</option>
            <option value="Fornecedor">Fornecedor</option>
          </select>
          <input
            type="text"
            name="telefone"
            placeholder="Telefone"
            value={novoContato.telefone}
            onChange={handleInputChange}
            className="border p-2 w-full mt-2"
          />
          <button
            onClick={adicionarOuEditarContato}
            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
          >
            {editando ? 'Salvar' : 'Adicionar'}
          </button>
          {editando && (
            <button
              onClick={() => {
                setEditando(null);
                setNovoContato({ nome: '', cpf: '', tipo: 'Paciente', telefone: '' });
              }}
              className="bg-gray-500 text-white px-4 py-2 mt-2 rounded"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contatos;
```
