import React, { useState } from 'react';

const Estoque = () => {
  const [itens, setItens] = useState([
    { id: 1, nome: 'Resina Composta', quantidade: 50, minimo: 10, categoria: 'Consumível' },
    { id: 2, nome: 'Luvas Descartáveis', quantidade: 200, minimo: 50, categoria: 'Consumível' },
  ]);
  const [novoItem, setNovoItem] = useState({ nome: '', quantidade: '', minimo: '', categoria: 'Consumível' });

  const handleInputChange = (e) => {
    setNovoItem({ ...novoItem, [e.target.name]: e.target.value });
  };

  const adicionarItem = () => {
    if (novoItem.nome && novoItem.quantidade && novoItem.minimo) {
      setItens([...itens, { id: itens.length + 1, ...novoItem }]);
      setNovoItem({ nome: '', quantidade: '', minimo: '', categoria: 'Consumível' });
    }
  };

  const atualizarQuantidade = (id, delta) => {
    setItens(itens.map(item => 
      item.id === id ? { ...item, quantidade: Number(item.quantidade) + delta } : item
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold">Gestão de Estoque</h1>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="col-span-2 bg-white p-4 rounded shadow">
          <h2 className="text-xl">Itens em Estoque</h2>
          <table className="w-full mt-4 border">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Quantidade</th>
                <th>Mínimo</th>
                <th>Categoria</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {itens.map((item) => (
                <tr key={item.id} className={item.quantidade <= item.minimo ? 'bg-red-100' : ''}>
                  <td>{item.nome}</td>
                  <td>{item.quantidade}</td>
                  <td>{item.minimo}</td>
                  <td>{item.categoria}</td>
                  <td>
                    <button
                      onClick={() => atualizarQuantidade(item.id, 10)}
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                    >
                      +10
                    </button>
                    <button
                      onClick={() => atualizarQuantidade(item.id, -10)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      -10
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl">Novo Item</h2>
          <input
            type="text"
            name="nome"
            placeholder="Nome do Item"
            value={novoItem.nome}
            onChange={handleInputChange}
            className="border p-2 w-full mt-2"
          />
          <input
            type="number"
            name="quantidade"
            placeholder="Quantidade"
            value={novoItem.quantidade}
            onChange={handleInputChange}
            className="border p-2 w-full mt-2"
          />
          <input
            type="number"
            name="minimo"
            placeholder="Estoque Mínimo"
            value={novoItem.minimo}
            onChange={handleInputChange}
            className="border p-2 w-full mt-2"
          />
          <select
            name="categoria"
            value={novoItem.categoria}
            onChange={handleInputChange}
            className="border p-2 w-full mt-2"
          >
            <option value="Consumível">Consumível</option>
            <option value="Equipamento">Equipamento</option>
          </select>
          <button
            onClick={adicionarItem}
            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Estoque;