```
import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';

const Avaliacao = () => {
  const [avaliacoes, setAvaliacoes] = useState([
    { id: 1, paciente: 'João Silva', dentista: 'Dr. Ana', nota: 5, comentario: 'Excelente atendimento', data: '2025-05-20' },
    { id: 2, paciente: 'Maria Santos', dentista: 'Dr. Carlos', nota: 3, comentario: 'Demora no atendimento', data: '2025-05-19' },
  ]);
  const [novaAvaliacao, setNovaAvaliacao] = useState({ paciente: '', dentista: '', nota: 5, comentario: '' });

  const handleInputChange = (e) => {
    setNovaAvaliacao({ ...novaAvaliacao, [e.target.name]: e.target.value });
  };

  const adicionarAvaliacao = () => {
    if (!novaAvaliacao.paciente || !novaAvaliacao.dentista || !novaAvaliacao.comentario) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }
    setAvaliacoes([...avaliacoes, { id: avaliacoes.length + 1, ...novaAvaliacao, data: new Date().toISOString().split('T')[0] }]);
    if (novaAvaliacao.nota <= 3) {
      alert('Notificação: Avaliação negativa registrada!');
    }
    setNovaAvaliacao({ paciente: '', dentista: '', nota: 5, comentario: '' });
  };

  useEffect(() => {
    const ctx = document.getElementById('satisfacaoChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Dr. Ana', 'Dr. Carlos'],
        datasets: [{
          label: 'Média de Satisfação',
          data: [4.8, 3.5],
          backgroundColor: '#3b82f6',
        }],
      },
      options: { scales: { y: { beginAtZero: true, max: 5 } } },
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold">Avaliação de Pacientes</h1>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="col-span-2 bg-white p-4 rounded shadow">
          <h2 className="text-xl">Avaliações</h2>
          <canvas id="satisfacaoChart" className="mt-4"></canvas>
          <table className="w-full mt-4 border">
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Dentista</th>
                <th>Nota</th>
                <th>Comentário</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {avaliacoes.map((avaliacao) => (
                <tr key={avaliacao.id} className={avaliacao.nota <= 3 ? 'bg-red-100' : ''}>
                  <td>{avaliacao.paciente}</td>
                  <td>{avaliacao.dentista}</td>
                  <td>{avaliacao.nota}</td>
                  <td>{avaliacao.comentario}</td>
                  <td>{avaliacao.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl">Nova Avaliação</h2>
          <input
            type="text"
            name="paciente"
            placeholder="Nome do Paciente"
            value={novaAvaliacao.paciente}
            onChange={handleInputChange}
            className="border p-2 w-full mt-2"
          />
          <select
            name="dentista"
            value={novaAvaliacao.dentista}
            onChange={handleInputChange}
            className="border p-2 w-full mt-2"
          >
            <option value="">Selecione Dentista</option>
            <option value="Dr. Ana">Dr. Ana</option>
            <option value="Dr. Carlos">Dr. Carlos</option>
          </select>
          <select
            name="nota"
            value={novaAvaliacao.nota}
            onChange={handleInputChange}
            className="border p-2 w-full mt-2"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <textarea
            name="comentario"
            placeholder="Comentário"
            value={novaAvaliacao.comentario}
            onChange={handleInputChange}
            className="border p-2 w-full mt-2"
          />
          <button
            onClick={adicionarAvaliacao}
            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
          >
            Enviar Avaliação
          </button>
        </div>
      </div>
    </div>
  );
};

export default Avaliacao;
```
