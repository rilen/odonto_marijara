```
import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';

const Dashboard = () => {
  const [kpis, setKpis] = useState({
    consultasHoje: 5,
    faturamentoMes: 15000,
    estoqueBaixo: 2,
    fluxoCaixa: 10000,
    satisfacaoMedia: 4.5,
  });
  const [alertas, setAlertas] = useState([
    { id: 1, mensagem: 'Consulta com João em 30 min', data: '2025-05-20 10:00' },
    { id: 2, mensagem: 'Estoque de luvas abaixo do mínimo', data: '2025-05-20 09:00' },
  ]);

  useEffect(() => {
    const ctx = document.getElementById('faturamentoChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
        datasets: [{
          label: 'Faturamento (R$)',
          data: [10000, 12000, 11000, 14000, 15000],
          borderColor: '#3b82f6',
          fill: false,
        }],
      },
      options: { scales: { y: { beginAtZero: true } } },
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-4 gap-4 mt-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg">Consultas Hoje</h2>
          <p className="text-2xl">{kpis.consultasHoje}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg">Faturamento Mês</h2>
          <p className="text-2xl">R${kpis.faturamentoMes}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg">Estoque Baixo</h2>
          <p className="text-2xl">{kpis.estoqueBaixo}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg">Satisfação Média</h2>
          <p className="text-2xl">{kpis.satisfacaoMedia}/5</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl">Faturamento Mensal</h2>
          <canvas id="faturamentoChart" className="mt-4"></canvas>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl">Alertas</h2>
          <ul className="mt-4">
            {alertas.map((alerta) => (
              <li key={alerta.id} className="border-b py-2">
                {alerta.mensagem} - {alerta.data}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
```
