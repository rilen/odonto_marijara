import React, { useState } from 'react';
import jsPDF from 'jspdf';
import SignaturePad from 'react-signature-pad-wrapper';

const Anamnese = () => {
  const [form, setForm] = useState({
    alergias: '',
    doencas: '',
    assinatura: '',
  });
  const signatureRef = React.useRef(null);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const salvarAssinatura = () => {
    setForm({ ...form, assinatura: signatureRef.current.toDataURL() });
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text('Anamnese do Paciente', 10, 10);
    doc.text(`Alergias: ${form.alergias}`, 10, 20);
    doc.text(`Doenças: ${form.doencas}`, 10, 30);
    if (form.assinatura) doc.addImage(form.assinatura, 'PNG', 10, 40, 50, 30);
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
        <h3 className="mt-4">Assinatura</h3>
        <SignaturePad ref={signatureRef} />
        <button
          onClick={salvarAssinatura}
          className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
        >
          Salvar Assinatura
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