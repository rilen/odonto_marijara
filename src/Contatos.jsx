```
       import React, { useState, useEffect } from 'react';

       const Contatos = () => {
         const [contatos, setContatos] = useState([]);
         const [novoContato, setNovoContato] = useState({ nome: '', cpf: '', tipo: 'Paciente', telefone: '' });
         const [search, setSearch] = useState('');
         const [editando, setEditando] = useState(null);
         const [error, setError] = useState('');

         useEffect(() => {
           fetchContatos();
         }, []);

         const fetchContatos = async () => {
           try {
             const response = await fetch('/api/contatos');
             const data = await response.json();
             if (response.ok) {
               setContatos(data);
               setError('');
             } else {
               setError(data.message || 'Erro ao carregar contatos.');
             }
           } catch (err) {
             setError('Erro ao conectar com o servidor.');
           }
         };

         const handleInputChange = (e) => {
           setNovoContato({ ...novoContato, [e.target.name]: e.target.value });
         };

         const adicionarOuEditarContato = async () => {
           if (!novoContato.nome || !novoContato.cpf || !novoContato.telefone) {
             alert('Preencha todos os campos!');
             return;
           }
           try {
             const url = editando ? `/api/contatos/${editando.id}` : '/api/contatos';
             const method = editando ? 'PUT' : 'POST';
             const response = await fetch(url, {
               method,
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify(novoContato),
             });
             const data = await response.json();
             if (response.ok) {
               fetchContatos();
               setNovoContato({ nome: '', cpf: '', tipo: 'Paciente', telefone: '' });
               setEditando(null);
               setError('');
             } else {
               setError(data.message || 'Erro ao salvar contato.');
             }
           } catch (err) {
             setError('Erro ao conectar com o servidor.');
           }
         };

         const editarContato = (contato) => {
           setEditando(contato);
           setNovoContato({ nome: contato.nome, cpf: contato.cpf, tipo: contato.tipo, telefone: contato.telefone });
         };

         const excluirContato = async (id) => {
           if (window.confirm('Excluir contato?')) {
             try {
               const response = await fetch(`/api/contatos/${id}`, { method: 'DELETE' });
               if (response.ok) {
                 fetchContatos();
                 setError('');
               } else {
                 const data = await response.json();
                 setError(data.message || 'Erro ao excluir contato.');
               }
             } catch (err) {
               setError('Erro ao conectar com o servidor.');
             }
           }
         };

         const filteredContatos = contatos.filter(
           (c) => c.nome.toLowerCase().includes(search.toLowerCase()) || c.cpf.includes(search)
         );

         return (
           <div className="min-h-screen bg-gray-100 p-4">
             <h1 className="text-2xl font-bold">Gestão de Contatos</h1>
             {error && <p className="text-red-500 mt-2">{error}</p>}
             <div className="grid grid-cols-3 gap-4 mt-4">
               <div className="col-span-2 bg-white p-4 rounded shadow">
                 <input
                   type="text"
                   placeholder="Buscar por Nome ou CPF"
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   className="border p-2 w-full mb-4"
                 />
                 <table className="w-full border">
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
