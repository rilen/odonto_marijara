// client/src/components/Anamnese.jsx

import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import SignatureCanvas from 'react-signature-canvas';
import { useParams, Link } from 'react-router-dom'; // Importa useParams e Link

const Anamnese = () => {
  const { pacienteId } = useParams(); // Obtém o pacienteId da URL (ex: /anamnese/123)

  // Estado para os campos do formulário de anamnese
  const [form, setForm] = useState({
    alergias: '',
    doencas: '',
    exames: '',
    assinatura: '',
  });

  // Estado para os detalhes do paciente selecionado
  const [paciente, setPaciente] = useState(null); // Armazena os detalhes completos do paciente
  const [loadingPaciente, setLoadingPaciente] = useState(true); // Estado de carregamento
  const [error, setError] = useState(''); // Estado para mensagens de erro

  // Referências para o canvas de assinatura
  const signatureRef = useRef(null);

  // Efeito para buscar os detalhes do paciente quando o componente é montado ou pacienteId muda
  useEffect(() => {
    const fetchPacienteDetails = async () => {
      if (pacienteId) {
        setLoadingPaciente(true);
        try {
          // Busca os detalhes do paciente usando o ID da URL
          const response = await fetch(`/api/contatos/${pacienteId}`);
          const data = await response.json();

          if (response.ok) {
            setPaciente(data); // Define os detalhes do paciente
            setError(''); // Limpa erros anteriores
          } else {
            setError(data.message || 'Erro ao carregar detalhes do paciente.');
            setPaciente(null); // Limpa paciente se houver erro
          }
        } catch (err) {
          setError('Erro ao conectar com o servidor para carregar detalhes do paciente.');
          console.error('Erro ao carregar detalhes do paciente:', err);
          setPaciente(null);
        } finally {
          setLoadingPaciente(false);
        }
      } else {
        setLoadingPaciente(false); // Não há pacienteId, então não está carregando
      }
    };

    fetchPacienteDetails();
  }, [pacienteId]); // O efeito é re-executado se o pacienteId na URL mudar

  // Handler para mudanças nos campos de input do formulário
  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Salvar a assinatura do canvas
  const salvarAssinatura = () => {
    if (signatureRef.current.isEmpty()) {
      setError('Por favor, forneça uma assinatura!');
      return;
    }
    setForm({ ...form, assinatura: signatureRef.current.toDataURL() });
    setError(''); // Limpa erro se a assinatura for salva com sucesso
  };

  // Limpar a assinatura do canvas
  const limparAssinatura = () => {
    signatureRef.current.clear();
    setForm({ ...form, assinatura: '' });
  };

  // Exportar o formulário preenchido como PDF
  const exportarPDF = () => {
    // Validação dos campos obrigatórios e se um paciente foi carregado
    if (!paciente || !form.alergias || !form.doencas || !form.assinatura) {
      setError('Por favor, certifique-se de que um paciente foi carregado, preencha todos os campos obrigatórios e assine!');
      return;
    }
    setError(''); // Limpa erro se a validação passar

    const doc = new jsPDF();
    let yPos = 10; // Posição Y inicial para o texto

    // Título do documento
    doc.setFontSize(18);
    doc.text('Anamnese do Paciente', 10, yPos);
    yPos += 15;

    // Detalhes do Paciente
    doc.setFontSize(12);
    doc.text(`Nome do Paciente: ${paciente.nome}`, 10, yPos);
    yPos += 7;
    doc.text(`CPF: ${paciente.cpf}`, 10, yPos);
    yPos += 7;
    doc.text(`E-mail: ${paciente.email}`, 10, yPos);
    yPos += 7;
    doc.text(`Telefone: ${paciente.telefone}`, 10, yPos);
    yPos += 7;
    doc.text(`Endereço: ${paciente.endereco}`, 10, yPos);
    yPos += 15;

    // Campos da Anamnese
    doc.setFontSize(14);
    doc.text('Detalhes da Anamnese:', 10, yPos);
    yPos += 10;
    doc.setFontSize(12);
    doc.text(`Alergias: ${form.alergias}`, 10, yPos);
    yPos += 10;
    doc.text(`Doenças Crônicas/Histórico Médico: ${form.doencas}`, 10, yPos);
    yPos += 10;
    doc.text(`Exames Anexados: ${form.exames || 'Nenhum'}`, 10, yPos);
    yPos += 15;

    // Assinatura
    doc.setFontSize(14);
    doc.text('Assinatura do Paciente:', 10, yPos);
    yPos += 5;
    if (form.assinatura) {
      doc.addImage(form.assinatura, 'PNG', 10, yPos, 80, 40); // Ajuste o tamanho da imagem conforme necessário
    }

    // Salva o PDF com o nome do paciente
    doc.save(`anamnese_${paciente.nome.replace(/\s/g, '_')}.pdf`);
  };

  // Exibe mensagem de carregamento enquanto busca os detalhes do paciente
  if (loadingPaciente) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <p className="text-gray-700 text-lg">Carregando detalhes do paciente...</p>
      </div>
    );
  }

  // Exibe mensagem se nenhum paciente for encontrado ou se não houver pacienteId na URL
  if (!paciente && pacienteId) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center justify-center">
        <p className="text-red-500 text-lg mb-4">Paciente não encontrado ou erro ao carregar. Verifique o ID.</p>
        <Link to="/contatos" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out">
          Ir para Contatos
        </Link>
      </div>
    );
  }

  if (!pacienteId) {
    return (
        <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center justify-center">
            <p className="text-gray-700 text-lg mb-4">Por favor, selecione um paciente na tela de Contatos para preencher a anamnese.</p>
            <Link to="/contatos" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out">
                Ir para Contatos
            </Link>
        </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Anamnese do Paciente</h1>

      {/* Exibição de mensagens de erro */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Erro: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-lg">
        {/* Detalhes do Paciente Carregado */}
        {paciente && (
          <div className="bg-blue-50 p-4 rounded-md mb-6 border border-blue-200">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">Paciente Selecionado:</h2>
            <div className="flex items-center space-x-4">
              {paciente.fotoUrl ? (
                <img src={paciente.fotoUrl} alt="Foto do Paciente" className="w-20 h-20 rounded-full object-cover border-2 border-blue-300" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-blue-200 flex items-center justify-center text-blue-500">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                </div>
              )}
              <div>
                <p className="text-blue-700 text-lg font-medium">Nome: {paciente.nome}</p>
                <p className="text-blue-700 text-sm">CPF: {paciente.cpf}</p>
                <p className="text-blue-700 text-sm">E-mail: {paciente.email}</p>
                <p className="text-blue-700 text-sm">Telefone: {paciente.telefone}</p>
                <p className="text-blue-700 text-sm">Endereço: {paciente.endereco}</p>
              </div>
            </div>
          </div>
        )}

        {/* Formulário de Saúde */}
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 mt-6">Formulário de Saúde</h2>
        <div className="mb-4">
          <label htmlFor="alergias" className="block text-gray-700 text-sm font-bold mb-2">
            Alergias:
          </label>
          <textarea
            id="alergias"
            name="alergias"
            placeholder="Liste todas as alergias conhecidas (medicamentos, alimentos, etc.)"
            value={form.alergias}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 h-24 resize-y"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="doencas" className="block text-gray-700 text-sm font-bold mb-2">
            Doenças Crônicas / Histórico Médico:
          </label>
          <textarea
            id="doencas"
            name="doencas"
            placeholder="Descreva doenças crônicas, cirurgias anteriores, condições médicas relevantes."
            value={form.doencas}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 h-24 resize-y"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="exames" className="block text-gray-700 text-sm font-bold mb-2">
            Anexar Exames (Opcional):
          </label>
          <input
            id="exames"
            type="file"
            name="exames"
            accept=".pdf,.jpg,.png"
            onChange={(e) => setForm({ ...form, exames: e.target.files[0]?.name })}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          />
          {form.exames && <p className="text-gray-600 text-sm mt-1">Arquivo selecionado: {form.exames}</p>}
        </div>

        <h3 className="text-xl font-semibold text-gray-700 mb-4 mt-6">Assinatura do Paciente</h3>
        <div className="border border-gray-300 rounded-md overflow-hidden mb-4">
          <SignatureCanvas
            ref={signatureRef}
            canvasProps={{ className: 'w-full h-48 bg-white' }}
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={salvarAssinatura}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Salvar Assinatura
          </button>
          <button
            onClick={limparAssinatura}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Limpar Assinatura
          </button>
          <button
            onClick={exportarPDF}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Exportar PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Anamnese;
