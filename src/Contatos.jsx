import React, { useState, useEffect, useRef } from 'react';

const Contatos = () => {
  const [contatos, setContatos] = useState([]);
  const [novoContato, setNovoContato] = useState({
    nome: '',
    cpf: '',
    tipo: 'Paciente',
    telefone: '',
    email: '',    // Novo campo: Email
    endereco: '', // Novo campo: Endereço
    fotoUrl: '',  // Novo campo: URL da foto capturada
    statusFinanceiro: 'N/A' // Novo campo: Status financeiro
  });
  const [search, setSearch] = useState('');
  const [editando, setEditando] = useState(null);
  const [error, setError] = useState('');
  const [showWebcamModal, setShowWebcamModal] = useState(false); // Estado para controlar a visibilidade do modal da webcam
  const videoRef = useRef(null); // Referência para o elemento de vídeo da webcam
  const canvasRef = useRef(null); // Referência para o elemento canvas para capturar a foto
  const streamRef = useRef(null); // Referência para o stream da webcam

  // Carregar contatos ao montar o componente
  useEffect(() => {
    fetchContatos();
  }, []);

  // Função para buscar contatos da API
  const fetchContatos = async () => {
    try {
      const response = await fetch('/api/contatos');
      const data = await response.json();
      if (response.ok) {
        // Para cada contato, buscar o status financeiro
        const contatosComStatus = await Promise.all(data.map(async (contato) => {
          if (contato.tipo === 'Paciente') {
            const status = await fetchPatientFinancialStatus(contato.id);
            return { ...contato, statusFinanceiro: status };
          }
          return { ...contato, statusFinanceiro: 'N/A' };
        }));
        setContatos(contatosComStatus);
        setError('');
      } else {
        setError(data.message || 'Erro ao carregar contatos.');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor.');
      console.error('Erro ao carregar contatos:', err);
    }
  };

  // Função para buscar o status financeiro de um paciente
  // (Esta é uma função mock. Em uma aplicação real, você faria uma chamada à sua API de financeiro)
  const fetchPatientFinancialStatus = async (pacienteId) => {
    try {
      // Exemplo de chamada mock para a API de financeiro
      // Em um cenário real, você teria um endpoint como /api/financeiro/status/paciente/:id
      const response = await fetch(`/api/financeiro/status?pacienteId=${pacienteId}`);
      const data = await response.json();

      if (response.ok && data.status) {
        return data.status; // Retorna 'Pago', 'Atrasado', 'Nao Pago'
      } else {
        return 'N/A'; // Se não encontrar ou houver erro, retorna N/A
      }
    } catch (err) {
      console.error(`Erro ao buscar status financeiro para o paciente ${pacienteId}:`, err);
      return 'N/A';
    }
  };

  // Função auxiliar para determinar a cor do status financeiro
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Pago':
        return 'bg-green-500';
      case 'Atrasado':
        return 'bg-yellow-500';
      case 'Nao Pago':
        return 'bg-red-500';
      default:
        return 'bg-gray-400'; // N/A or unknown
    }
  };

  // Handler para mudanças nos campos de input
  const handleInputChange = (e) => {
    setNovoContato({ ...novoContato, [e.target.name]: e.target.value });
  };

  // Função para adicionar ou editar um contato
  const adicionarOuEditarContato = async () => {
    if (!novoContato.nome || !novoContato.cpf || !novoContato.telefone || !novoContato.email || !novoContato.endereco) {
      setError('Preencha todos os campos obrigatórios: Nome, CPF, Telefone, E-mail e Endereço!');
      return;
    }
    setError(''); // Limpa erro se a validação passar

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
        fetchContatos(); // Recarrega a lista de contatos
        setNovoContato({ nome: '', cpf: '', tipo: 'Paciente', telefone: '', email: '', endereco: '', fotoUrl: '', statusFinanceiro: 'N/A' });
        setEditando(null);
        setError('');
      } else {
        setError(data.message || 'Erro ao salvar contato.');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor.');
      console.error('Erro ao salvar contato:', err);
    }
  };

  // Função para preencher o formulário para edição
  const editarContato = (contato) => {
    setEditando(contato);
    setNovoContato({
      nome: contato.nome,
      cpf: contato.cpf,
      tipo: contato.tipo,
      telefone: contato.telefone,
      email: contato.email || '',
      endereco: contato.endereco || '',
      fotoUrl: contato.fotoUrl || '',
      statusFinanceiro: contato.statusFinanceiro || 'N/A'
    });
  };

  // Função para excluir um contato
  const excluirContato = async (id) => {
    // Substituindo window.confirm por um modal customizado ou lógica de confirmação
    const confirmDelete = window.confirm('Tem certeza que deseja excluir este contato?'); // Usar modal customizado em produção
    if (confirmDelete) {
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
        console.error('Erro ao excluir contato:', err);
      }
    }
  };

  // Iniciar a webcam
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      streamRef.current = stream; // Armazena o stream para poder pará-lo depois
      setShowWebcamModal(true);
    } catch (err) {
      setError('Erro ao acessar a webcam. Verifique as permissões do navegador.');
      console.error('Erro ao acessar a webcam:', err);
    }
  };

  // Capturar foto da webcam
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const imageUrl = canvasRef.current.toDataURL('image/png');
      setNovoContato({ ...novoContato, fotoUrl: imageUrl });
      stopWebcam(); // Parar a webcam após capturar a foto
      setShowWebcamModal(false);
    }
  };

  // Parar a webcam
  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowWebcamModal(false);
  };

  // Filtra contatos com base na busca
  const filteredContatos = contatos.filter(
    (c) =>
      c.nome.toLowerCase().includes(search.toLowerCase()) ||
      c.cpf.includes(search) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Gestão de Contatos</h1>

      {/* Exibição de mensagens de erro */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Erro: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {/* Seção de listagem e busca de contatos */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-lg">
          <input
            type="text"
            placeholder="Buscar por Nome, CPF ou E-mail"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 mb-4"
          />
          <div className="overflow-x-auto"> {/* Adicionado para rolagem horizontal em telas pequenas */}
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Foto</th>
                  <th className="py-3 px-6 text-left">Nome</th>
                  <th className="py-3 px-6 text-left">CPF</th>
                  <th className="py-3 px-6 text-left">Tipo</th>
                  <th className="py-3 px-6 text-left">Telefone</th>
                  <th className="py-3 px-6 text-left">E-mail</th>
                  <th className="py-3 px-6 text-left">Status Financeiro</th>
                  <th className="py-3 px-6 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm font-light">
                {filteredContatos.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-3 px-6 text-center">Nenhum contato encontrado.</td>
                  </tr>
                ) : (
                  filteredContatos.map((contato) => (
                    <tr key={contato.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-6 text-left">
                        {contato.fotoUrl ? (
                          <img src={contato.fotoUrl} alt="Foto do Paciente" className="w-12 h-12 rounded-full object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-6 text-left">{contato.nome}</td>
                      <td className="py-3 px-6 text-left">{contato.cpf}</td>
                      <td className="py-3 px-6 text-left">{contato.tipo}</td>
                      <td className="py-3 px-6 text-left">{contato.telefone}</td>
                      <td className="py-3 px-6 text-left">{contato.email}</td>
                      <td className="py-3 px-6 text-left">
                        {contato.tipo === 'Paciente' ? (
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${getPaymentStatusColor(contato.statusFinanceiro)}`}>
                            {contato.statusFinanceiro}
                          </span>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td className="py-3 px-6 text-center">
                        <div className="flex item-center justify-center">
                          <button
                            onClick={() => editarContato(contato)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded-md mr-2 transition duration-300 ease-in-out transform hover:scale-105"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => excluirContato(contato.id)}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
                          >
                            Excluir
                          </button>
                          {contato.tipo === 'Paciente' && (
                            <a
                              href={`/anamnese/${contato.id}`} // Link para o formulário de Anamnese com o ID do paciente
                              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-1 px-3 rounded-md ml-2 transition duration-300 ease-in-out transform hover:scale-105"
                            >
                              Anamnese
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Seção de cadastro/edição de contato */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">{editando ? 'Editar Contato' : 'Novo Contato'}</h2>
          <div className="mb-4">
            <label htmlFor="nome" className="block text-gray-700 text-sm font-bold mb-2">Nome:</label>
            <input
              id="nome"
              type="text"
              name="nome"
              placeholder="Nome Completo"
              value={novoContato.nome}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="cpf" className="block text-gray-700 text-sm font-bold mb-2">CPF:</label>
            <input
              id="cpf"
              type="text"
              name="cpf"
              placeholder="CPF"
              value={novoContato.cpf}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">E-mail:</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="E-mail"
              value={novoContato.email}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="endereco" className="block text-gray-700 text-sm font-bold mb-2">Endereço:</label>
            <input
              id="endereco"
              type="text"
              name="endereco"
              placeholder="Endereço Completo"
              value={novoContato.endereco}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="telefone" className="block text-gray-700 text-sm font-bold mb-2">Telefone:</label>
            <input
              id="telefone"
              type="text"
              name="telefone"
              placeholder="Telefone"
              value={novoContato.telefone}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="tipo" className="block text-gray-700 text-sm font-bold mb-2">Tipo:</label>
            <select
              id="tipo"
              name="tipo"
              value={novoContato.tipo}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            >
              <option value="Paciente">Paciente</option>
              <option value="Dentista">Dentista</option>
              <option value="Fornecedor">Fornecedor</option>
            </select>
          </div>

          {/* Seção de Captura de Foto (Webcam) */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Foto do Rosto:</label>
            {novoContato.fotoUrl ? (
              <div className="flex items-center space-x-4">
                <img src={novoContato.fotoUrl} alt="Foto Capturada" className="w-24 h-24 rounded-full object-cover border-2 border-gray-300" />
                <button
                  onClick={() => setNovoContato({ ...novoContato, fotoUrl: '' })}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
                >
                  Remover Foto
                </button>
              </div>
            ) : (
              <button
                onClick={startWebcam}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
              >
                Capturar Foto
              </button>
            )}
          </div>

          {/* Botões de Ação */}
          <button
            onClick={adicionarOuEditarContato}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 w-full"
          >
            {editando ? 'Salvar Alterações' : 'Adicionar Contato'}
          </button>
          {editando && (
            <button
              onClick={() => {
                setEditando(null);
                setNovoContato({ nome: '', cpf: '', tipo: 'Paciente', telefone: '', email: '', endereco: '', fotoUrl: '', statusFinanceiro: 'N/A' });
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 w-full mt-2"
            >
              Cancelar Edição
            </button>
          )}
        </div>
      </div>

      {/* Modal da Webcam */}
      {showWebcamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4">Capturar Foto do Rosto</h2>
            <video ref={videoRef} autoPlay playsInline className="w-full h-auto rounded-md mb-4"></video>
            <canvas ref={canvasRef} className="hidden"></canvas> {/* Canvas oculto para captura */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={capturePhoto}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
              >
                Tirar Foto
              </button>
              <button
                onClick={stopWebcam}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
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

export default Contatos;
