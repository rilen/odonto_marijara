import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import jsPDF from 'jspdf';

const Relatorios = () => {
  const [relatorio, setRelatorio] = useState({
    tipo: 'Consultas',
    periodo: 'Mensal',
    dados: [
      { dentista: 'Dr. Ana', consultas: 20, faturamento: 5000 },
      { dentista: 'Dr. Carlos', consultas: 15, faturamento: 3750 },
    ],
  });

  const handleInputChange = (e) => {
    setRelatorio({ ...relatorio, [e.target.name]: e.target.value });
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text('Relatório de Consultas', 10, 10);
    relatorio.dados.forEach((item, index) => {
      doc.text(`${item.dentista}: ${item.consultas} consultas, R$${item.faturamento}`, 10, 20 + index * 10);
    });
    doc.save('relatorio_consultas.pdf');
  };

  useEffect(() => {
    const ctx = document.getElementById('relatorioChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: relatorio.dados.map(item => item.dentista),
        datasets: [{
          label: 'Consultas',
          data: relatorio.dados.map(item => item.consultas),
          backgroundColor: '#3b82f6',
        }, {
          label: 'Faturamento (R$)',
          data: relatorio.dados.map(item => item.faturamento),
          backgroundColor: '#10b981',
        }],
      },
      options: { scales: { y: { beginAtZero: true } } },
    });
  }, [relatorio]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold">Relatórios</h1>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="col-span-2 bg-white p-4 rounded shadow">
          <h2 className="text-xl">Relatório de Consultas</h2>
          <canvas id="relatorioChart" className="mt-4"></canvas>
          <table className="w-full mt-4 border">
            <thead>
              <tr>
                <th>Dentista</th>
                <th>Consultas</th>
                <th>Faturamento (R$)</th>
              </tr>
            </thead>
            <tbody>
              {relatorio.dados.map((item, index) => (
                <tr key={index}>
                  <td>{item.dentista}</td>
                  <td>{item.consultas}</td>
                  <td>{item.faturamento}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl">Filtros</h2>
          <select
            name="tipo"
            value={relatorio.tipo}
            onChange={handleInputChange}
            className="border p-2 w-full mt-2"
          >
            <option value="Consultas">Consultas</option>
            <option value="Financeiro">Financeiro</option>
            <option value="Estoque">Estoque</option>
          </select>
          <select
            name="periodo"
            value={relatorio.periodo}
            onChange={handleInputChange}
            className="border p-2 w-full mt-2"
          >
            <option value="Diário">Diário</option>
            <option value="Mensal">Mensal</option>
            <option value="Anual">Anual</option>
          </select>
          <button
            onClick={exportarPDF}
            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
          >
            Exportar PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Relatorios;