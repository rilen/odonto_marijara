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
    }
  };

  // Módulos disponíveis por perfil
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
    e.preventDefault();
    if (!novoUsuario.email || !novoUsuario.senha) {
      alert('Preencha e-mail e senha!');
      return;
    }

    const usuarioData = {
      email: novoUsuario.email,
      senha: novoUsuario.senha,
      role: novoUsuario.role,
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
        fetchUsuarios();
        setNovoUsuario({ email: '', senha: '', role: 'operador' });
        setPermissoes([]);
        setEditando(null);
        setError('');
        alert(editando ? 'Usuário atualizado!' : 'Usuário cadastrado!');
      } else {
        setError(data.message || 'Erro ao salvar usuário.');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor. Verifique a conexão com o banco de dados.');
    }
  };

  const editarUsuario = (usuario) => {
    setEditando(usuario);
    setNovoUsuario({ email: usuario.email, senha: '', role: usuario.role });
    setPermissoes(usuario.modulos);
  };

  const excluirUsuario = async (id) => {
    if (window.confirm('Excluir usuário?')) {
      try {
        const response = await fetch(`/api/usuarios/${id}`, { method: 'DELETE' });
        if (response.ok) {
          fetchUsuarios();
          setError('');
          alert('Usuário excluído!');
        } else {
          const data = await response.json();
          setError(data.message || 'Erro ao excluir usuário.');
        }
      } catch (err) {
        setError('Erro ao conectar com o servidor. Verifique a conexão com o banco de dados.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold">Gestão de Usuários</h1>
      <div className="bg-white p-4 rounded shadow mt-4">
        <h2 className="text-xl">{editando ? 'Editar Usuário' : 'Cadastrar Usuário'}</h2>
        <form onSubmit={cadastrarOuEditarUsuario} className="mt-4">
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={novoUsuario.email}
            onChange={handleInputChange}
            className="border p-2 w-full mb-2"
            required
          />
          <input
            type="password"
            name="senha"
            placeholder="Senha"
            value={novoUsuario.senha}
            onChange={handleInputChange}
            className="border p-2 w-full mb-2"
            required
          />
          <select
            name="role"
            value={novoUsuario.role}
            onChange={handleInputChange}
            className="border p-2 w-full mb-2"
          >
            <option value="admin">Admin</option>
            <option value="operador">Operador</option>
            <option value="dentista">Dentista</option>
          </select>
          <h3 className="mt-4">Permissões Personalizadas</h3>
          <div className="grid grid-cols-2 gap-2">
            {modulosPorPerfil.admin.map((modulo) => (
              <label key={modulo} className="flex items-center">
                <input
                  type="checkbox"
                  checked={permissoes.includes(modulo)}
                  onChange={() => handlePermissoesChange(modulo)}
                  className="mr-2"
                />
                {modulo}
              </label>
            ))}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
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
              className="bg-gray-500 text-white px-4 py-2 mt-4 ml-2 rounded"
            >
              Cancelar
            </button>
          )}
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      </div>
      <div className="bg-white p-4 rounded shadow mt-4">
        <h2 className="text-xl">Usuários Cadastrados</h2>
        <table className="w-full mt-4 border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">E-mail</th>
              <th className="border p-2">Perfil</th>
              <th className="border p-2">Módulos</th>
              <th className="border p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id} className="border-b">
                <td className="border p-2">{usuario.email}</td>
                <td className="border p-2">{usuario.role}</td>
                <td className="border p-2">{usuario.modulos.join(', ')}</td>
                <td className="border p-2">
                  <button
                    onClick={() => editarUsuario(usuario)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => excluirUsuario(usuario.id)}
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
    </div>
  );
};

export default GestaoUsuarios;
