import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import SignatureCanvas from 'react-signature-canvas';

const Anamnese = () => {
  // State for the anamnesis form fields
  const [form, setForm] = useState({
    alergias: '',
    doencas: '',
    exames: '',
    assinatura: '',
  });

  // State for managing patients
  const [pacientes, setPacientes] = useState([]);
  const [selectedPacienteId, setSelectedPacienteId] = useState(''); // Stores the ID of the selected patient
  const [selectedPacienteDetails, setSelectedPacienteDetails] = useState(null); // Stores full details of the selected patient

  // Ref for the signature canvas
  const signatureRef = useRef(null);

  // Error state for displaying messages to the user
  const [error, setError] = useState('');

  // Effect to fetch patient data when the component mounts
  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        // Fetch contacts from the API
        const response = await fetch('/api/contatos');
        const data = await response.json();

        if (response.ok) {
          // Filter contacts to only include those with 'Paciente' type
          const pacientesData = data.filter(contact => contact.tipo === 'Paciente');
          setPacientes(pacientesData);
          setError(''); // Clear any previous errors
        } else {
          setError(data.message || 'Erro ao carregar pacientes.');
        }
      } catch (err) {
        setError('Erro ao conectar com o servidor para carregar pacientes.');
        console.error('Erro ao carregar pacientes:', err);
      }
    };

    fetchPacientes();
  }, []); // Empty dependency array means this effect runs once on mount

  // Handler for form input changes
  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handler for patient selection dropdown change
  const handlePacienteSelectChange = (e) => {
    const id = e.target.value;
    setSelectedPacienteId(id);
    // Find the selected patient's full details from the 'pacientes' array
    const paciente = pacientes.find(p => p.id === parseInt(id));
    setSelectedPacienteDetails(paciente);
  };

  // Function to save the signature from the canvas
  const salvarAssinatura = () => {
    if (signatureRef.current.isEmpty()) {
      setError('Por favor, forneça uma assinatura!');
      return;
    }
    setForm({ ...form, assinatura: signatureRef.current.toDataURL() });
    setError(''); // Clear error on successful signature save
  };

  // Function to clear the signature canvas
  const limparAssinatura = () => {
    signatureRef.current.clear();
    setForm({ ...form, assinatura: '' });
  };

  // Function to export the form data as a PDF
  const exportarPDF = () => {
    // Validate required fields and patient selection
    if (!selectedPacienteId || !form.alergias || !form.doencas || !form.assinatura) {
      setError('Por favor, selecione um paciente e preencha todos os campos obrigatórios e assine!');
      return;
    }
    setError(''); // Clear error if validation passes

    const doc = new jsPDF();
    let yPos = 10; // Initial Y position for text

    // Add patient details to the PDF
    doc.text('Anamnese do Paciente', 10, yPos);
    yPos += 10;
    if (selectedPacienteDetails) {
      doc.text(`Paciente: ${selectedPacienteDetails.nome}`, 10, yPos);
      yPos += 7;
      doc.text(`CPF: ${selectedPacienteDetails.cpf}`, 10, yPos);
      yPos += 7;
      doc.text(`Telefone: ${selectedPacienteDetails.telefone}`, 10, yPos);
      yPos += 10;
    }

    // Add form details to the PDF
    doc.text(`Alergias: ${form.alergias}`, 10, yPos);
    yPos += 10;
    doc.text(`Doenças: ${form.doencas}`, 10, yPos);
    yPos += 10;
    doc.text(`Exames: ${form.exames || 'Nenhum'}`, 10, yPos);
    yPos += 10;

    // Add signature image if available
    if (form.assinatura) {
      doc.addImage(form.assinatura, 'PNG', 10, yPos, 50, 30);
    }

    doc.save(`anamnese_${selectedPacienteDetails?.nome.replace(/\s/g, '_') || 'paciente'}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Anamnese do Paciente</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Erro: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Seleção do Paciente</h2>
        <div className="mb-4">
          <label htmlFor="paciente-select" className="block text-gray-700 text-sm font-bold mb-2">
            Selecione o Paciente:
          </label>
          <select
            id="paciente-select"
            value={selectedPacienteId}
            onChange={handlePacienteSelectChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
          >
            <option value="">-- Selecione um paciente --</option>
            {pacientes.map((paciente) => (
              <option key={paciente.id} value={paciente.id}>
                {paciente.nome} (CPF: {paciente.cpf})
              </option>
            ))}
          </select>
        </div>

        {selectedPacienteDetails && (
          <div className="bg-blue-50 p-4 rounded-md mb-6">
            <h3 className="text-lg font-medium text-blue-800">Paciente Selecionado:</h3>
            <p className="text-blue-700">Nome: {selectedPacienteDetails.nome}</p>
            <p className="text-blue-700">CPF: {selectedPacienteDetails.cpf}</p>
            <p className="text-blue-700">Telefone: {selectedPacienteDetails.telefone}</p>
          </div>
        )}

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
