```
import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import SignatureCanvas from 'react-signature-canvas';

const Anamnese = () => {
  const [form, setForm] = useState({
    alergias: '',
    doencas: '',
    exames: '',
    assinatura: '',
  });
  const signatureRef = useRef(null);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const salvarAssinatura = () => {
    if (signatureRef.current.isEmpty()) {
      alert('Por favor, forneça uma assinatura!');
      return;
    }
    setForm({ ...form, assinatura: signatureRef.current.toDataURL() });
  };

  const limparAssinatura = () => {
    signatureRef.current.clear();
    setForm({ ...form, assinatura: '' });
  };

  const exportarPDF = () => {
    if (!form.alergias || !form.doencas || !form.assinatura) {
      alert('Preencha todos os campos obrigatórios e assine!');
      return;
    }
    const doc = new jsPDF();
    doc.text('Anamnese do Paciente', 10, 10);
    doc.text(`Alergias: ${form.alergias}`, 10, 20);
    doc.text(`Doenças: ${form.doencas}`, 10, 30);
    doc.text(`Exames: ${form.exames || 'Nenhum'}`, 10, 40);
    if (form.assinatura) doc.addImage(form.assinatura, 'PNG', 10, 50, 50, 30);
    doc.save('anamnese.pdf');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold">Anamnese</h1>
      <div className="bg-white p-4 rounded shadow mt-4">
        <h2 className="text-xl">Formulário de Saúde</h2>
        <textarea
          name="alergias"
          placeholder="Alergias"
          value={form.alergias}
          onChange={handleInputChange}
          className="border p-2 w-full mt-2"
        />
        <textarea
          name="doencas"
          placeholder="Doenças Crônicas"
          value={form.doencas}
          onChange={handleInputChange}
          className="border p-2 w-full mt-2"
        />
        <input
          type="file"
          name="exames"
          accept=".pdf,.jpg,.png"
          onChange={(e) => setForm({ ...form, exames: e.target.files[0]?.name })}
          className="border p-2 w-full mt-2"
        />
        <h3 className="mt-4">Assinatura</h3>
        <SignatureCanvas
          ref={signatureRef}
          canvasProps={{ className: 'border border-gray-300 w-full h-32' }}
        />
        <button
          onClick={salvarAssinatura}
          className="bg-blue-500 text-white px-4 py-2 mt-2 rounded mr-2"
        >
          Salvar Assinatura
        </button>
        <button
          onClick={limparAssinatura}
          className="bg-gray-500 text-white px-4 py-2 mt-2 rounded mr-2"
        >
          Limpar Assinatura
        </button>
        <button
          onClick={exportarPDF}
          className="bg-green-500 text-white px-4 py-2 mt-2 rounded"
        >
          Exportar PDF
        </button>
      </div>
    </div>
  );
};

export default Anamnese;
```
