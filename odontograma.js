import React, { useState } from 'react';
import jsPDF from 'jspdf';

const Odontograma = () => {
  const [dentes, setDentes] = useState(
    Array(32).fill().map((_, i) => ({ id: i + 1, condicao: 'Saudável', notas: '' }))
  );
  const [selectedDente, setSelectedDente] = useState(null);

  const atualizarCondicao = (id, condicao) => {
    setDentes(dentes.map(dente => 
      dente.id === id ? { ...dente, condicao, notas: dente.notas || '' } : dente
    ));
  };

  const atualizarNotas = (id, notas) => {
    setDentes(dentes.map(dente => 
      dente.id === id ? { ...dente, notas } : dente
    ));
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text('Odontograma do Paciente', 10, 10);
    dentes.forEach((dente, index) => {
      doc.text(`Dente ${dente.id}: ${dente.condicao} - ${dente.notas || 'Sem notas'}`, 10, 20 + index * 10);
    });
    doc.save('odontograma.pdf');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold">Odontograma</h1>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="col-span-2 bg-white p-4 rounded shadow">
          <h2 className="text-xl">Mapa Dentário</h2>
          <svg width="600" height="200" className="mt-4">
            {dentes.map(dente => (
              <rect
                key={dente.id}
                x={(dente.id - 1) % 16 * 35 + (dente.id > 16 ? 50 : 0)}
                y={dente.id <= 16 ? 10 : 100}
                width="30"
                height="30"
                fill={dente.condicao === 'Saudável' ? '#fff' : dente.condicao === 'Cárie' ? '#ff0000' : '#ffff00'}
                stroke="#000"
                onClick={() => setSelectedDente(dente.id)}
              />
            ))}
          </svg>
          <button
            onClick={exportarPDF}
            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
          >
            Exportar PDF
          </button>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl">Detalhes do Dente</h2>
          {selectedDente ? (
            <>
              <p>Dente {selectedDente}</p>
              <select
                value={dentes.find(d => d.id === selectedDente).condicao}
                onChange={(e) => atualizarCondicao(selectedDente, e.target.value)}
                className="border p-2 w-full mt-2"
              >
                <option value="Saudável">Saudável</option>
                <option value="Cárie">Cárie</option>
                <option value="Restauração">Restauração</option>
                <option value="Extração">Extração</option>
              </select>
              <textarea
                value={dentes.find(d => d.id === selectedDente).notas}
                onChange={(e) => atualizarNotas(selectedDente, e.target.value)}
                placeholder="Notas"
                className="border p-2 w-full mt-2"
              />
            </>
          ) : (
            <p>Selecione um dente</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Odontograma;