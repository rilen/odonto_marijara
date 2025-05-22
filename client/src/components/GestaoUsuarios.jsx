// client/src/components/GestaoUsuarios.jsx

import React, { useState, useEffect } from 'react';

const GestaoUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [novoUsuario, setNovoUsuario] = useState({
    email: '',
    senha: '',
    role: 'operador',
  });
  const [editando, setEditando] = useState(null);
  const [permissoes, setPermissoes] = useState([]);
  const [error, setError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Estado para o modal de confirmação de exclusão
  const [userToDeleteId, setUserToDeleteId] = useState(null); // ID do usuário a ser excluído

  // Carregar usuários
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch('/api/usuarios');
      const data = await response.json();
      if (response.ok) {
        setUsuarios(data);
        setError('');
      } else {
        setError(data.message || 'Erro ao carregar usuários.');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor. Verifique a conexão com o banco de dados.');
      console.error('Erro ao carregar usuários:', err);
    }
  };

  // Módulos disponíveis por perfil (para exibição e seleção de permissões)
  const modulosPorPerfil = {
    admin: [
      'Dashboard', 'Contatos', 'Agendamento', 'Financeiro', 'Estoque', 'Relatorios',
      'Odontograma', 'Notificacoes', 'Configuracoes', 'Anamnese', 'Treinamento',
      'Suporte', 'Avaliacao', 'GestaoUsuarios',
    ],
    operador: ['Agendamento', 'Financeiro', 'Relatorios'],
    dentista: ['Contatos', 'Anamnese', 'Odontograma', 'Relatorios', 'Avaliacao'],
  };

  const handleInputChange = (e) => {
    setNovoUsuario({ ...novoUsuario, [e.target.name]: e.target.value });
  };

  const handlePermissoesChange = (modulo) => {
    if (permissoes.includes(modulo)) {
      setPermissoes(permissoes.filter((m) => m !== modulo));
    } else {
      setPermissoes([...permissoes, modulo]);
    }
  };

  const cadastrarOuEditarUsuario = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário
    if (!novoUsuario.email || !novoUsuario.senha) {
      setError('Preencha e-mail e senha!');
      return;
    }

    const usuarioData = {
      email: novoUsuario.email,
      senha: novoUsuario.senha,
      role: novoUsuario.role,
      // Se permissões personalizadas foram selecionadas, use-as; caso contrário, use as padrão do perfil
      modulos: permissoes.length > 0 ? permissoes : modulosPorPerfil[novoUsuario.role],
    };

    try {
      const url = editando ? `/api/usuarios/${editando.id}` : '/api/usuarios';
      const method = editando ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuarioData),
      });
      const data = await response.json();
      if (response.ok) {
        fetchUsuarios(); // Recarrega a lista de usuários
        setNovoUsuario({ email: '', senha: '', role: 'operador' }); // Reseta o formulário
        setPermissoes([]); // Limpa as permissões selecionadas
        setEditando(null); // Sai do modo de edição
        setError('');
        // Usar um modal ou mensagem na UI em vez de alert
        // alert(editando ? 'Usuário atualizado!' : 'Usuário cadastrado!');
      } else {
        setError(data.message || 'Erro ao salvar usuário.');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor. Verifique a conexão com o banco de dados.');
      console.error('Erro ao salvar usuário:', err);
    }
  };

  const editarUsuario = (usuario) => {
    setEditando(usuario);
    setNovoUsuario({ email: usuario.email, senha: '', role: usuario.role }); // Senha vazia para não preencher com hash
    setPermissoes(usuario.modulos); // Preenche as permissões do usuário para edição
  };

  // Prepara a exclusão, mostrando o modal de confirmação
  const handleExcluirClick = (id) => {
    setUserToDeleteId(id);
    setShowConfirmModal(true);
  };

  // Confirma a exclusão e executa a chamada à API
  const handleConfirmDelete = async () => {
    setShowConfirmModal(false); // Fecha o modal
    if (userToDeleteId) {
      try {
        const response = await fetch(`/api/usuarios/${userToDeleteId}`, { method: 'DELETE' });
        if (response.ok) {
          fetchUsuarios();
          setError('');
          // alert('Usuário excluído!'); // Usar um modal ou mensagem na UI
        } else {
          const data = await response.json();
          setError(data.message || 'Erro ao excluir usuário.');
        }
      } catch (err) {
        setError('Erro ao conectar com o servidor. Verifique a conexão com o banco de dados.');
        console.error('Erro ao excluir usuário:', err);
      } finally {
        setUserToDeleteId(null); // Limpa o ID do usuário a ser excluído
      }
    }
  };

  // Cancela a exclusão
  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setUserToDeleteId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Gestão de Usuários</h1>

      {/* Exibição de mensagens de erro */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Erro: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {/* Formulário de Cadastro/Edição de Usuário */}
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">{editando ? 'Editar Usuário' : 'Cadastrar Usuário'}</h2>
          <form onSubmit={cadastrarOuEditarUsuario} className="mt-4">
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">E-mail:</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="E-mail"
                value={novoUsuario.email}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="senha" className="block text-gray-700 text-sm font-bold mb-2">Senha:</label>
              <input
                id="senha"
                type="password"
                name="senha"
                placeholder={editando ? "Deixe em branco para manter a senha atual" : "Senha"}
                value={novoUsuario.senha}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                required={!editando} // Senha é obrigatória apenas para novos cadastros
              />
            </div>
            <div className="mb-4">
              <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">Perfil:</label>
              <select
                id="role"
                name="role"
                value={novoUsuario.role}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              >
                <option value="admin">Admin</option>
                <option value="operador">Operador</option>
                <option value="dentista">Dentista</option>
              </select>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Permissões Personalizadas</h3>
            <p className="text-sm text-gray-600 mb-4">Selecione os módulos que este usuário terá acesso. Se nenhum for selecionado, as permissões padrão do perfil serão aplicadas.</p>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {modulosPorPerfil.admin.map((modulo) => ( // Exibe todos os módulos possíveis para seleção
                <label key={modulo} className="flex items-center text-gray-700 text-sm">
                  <input
                    type="checkbox"
                    checked={permissoes.includes(modulo)}
                    onChange={() => handlePermissoesChange(modulo)}
                    className="form-checkbox h-4 w-4 text-blue-600 rounded mr-2"
                  />
                  {modulo}
                </label>
              ))}
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 w-full"
            >
              {editando ? 'Salvar Alterações' : 'Cadastrar'}
            </button>
            {editando && (
              <button
                type="button"
                onClick={() => {
                  setEditando(null);
                  setNovoUsuario({ email: '', senha: '', role: 'operador' });
                  setPermissoes([]);
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 w-full mt-2"
              >
                Cancelar
              </button>
            )}
          </form>
        </div>

        {/* Tabela de Usuários Cadastrados */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Usuários Cadastrados</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">E-mail</th>
                  <th className="py-3 px-6 text-left">Perfil</th>
                  <th className="py-3 px-6 text-left">Módulos</th>
                  <th className="py-3 px-6 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm font-light">
                {usuarios.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-3 px-6 text-center">Nenhum usuário encontrado.</td>
                  </tr>
                ) : (
                  usuarios.map((usuario) => (
                    <tr key={usuario.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-6 text-left">{usuario.email}</td>
                      <td className="py-3 px-6 text-left">{usuario.role}</td>
                      <td className="py-3 px-6 text-left">{usuario.modulos.join(', ')}</td>
                      <td className="py-3 px-6 text-center">
                        <div className="flex item-center justify-center">
                          <button
                            onClick={() => editarUsuario(usuario)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded-md mr-2 transition duration-300 ease-in-out transform hover:scale-105"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleExcluirClick(usuario.id)} // Usa o novo handler para exclusão
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
            <h2 className="text-xl font-bold mb-4">Confirmar Exclusão</h2>
            <p className="mb-6">Tem certeza que deseja excluir este usuário?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
              >
                Sim, Excluir
              </button>
              <button
                onClick={handleCancelDelete}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestaoUsuarios;
