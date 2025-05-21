import React, { useState } from 'react';
import jsPDF from 'jspdf';

const Treinamento = () => {
  const [treinamentos, setTreinamentos] = useState([
    { id: 1, modulo: 'Agendamento', tipo: 'Vídeo', progresso: 50, concluido: false, pontos: 0 },
    { id: 2, modulo: 'Odontograma', tipo: 'PDF', progresso: 80, concluido: false, pontos: 0 },
  ]);
  const [quiz, setQuiz] = useState({ modulo: '', respostas: [] });

  const atualizarProgresso = (id, progresso) => {
    const pontos = progresso === 100 ? 100 : Math.round(progresso * 0.5);
    setTreinamentos(treinamentos.map(t => 
      t.id === id ? { ...t, progresso, concluido: progresso === 100, pontos } : t
    ));
  };

  const gerarCertificado = (modulo) => {
    const doc = new jsPDF();
    doc.text(`Certificado de Conclusão - ${modulo}`, 10, 10);
    doc.text('Parabéns por concluir o treinamento!', 10, 20);
    doc.save(`certificado_${modulo}.pdf`);
  };

  const iniciarQuiz = () => {
    if (!quiz.modulo) {
      alert('Selecione um módulo para o quiz!');
      return;
    }
    alert(`Iniciando quiz para ${quiz.modulo}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold">Treinamento</h1>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="col-span-2 bg-white p-4 rounded shadow">
          <h2 className="text-xl">Módulos de Treinamento</h2>
          <table className="w-full mt-4 border">
            <thead>
              <tr>
                <th>Módulo</th>
                <th>Tipo</th>
                <th>Progresso</th>
                <th>Pontos</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {treinamentos.map((t) => (
                <tr key={t.id}>
                  <td>{t.modulo}</td>
                  <td>{t.tipo}</td>
                  <td>{t.progresso}%</td>
                  <td>{t.pontos}</td>
                  <td>
                    <button
                      onClick={() => atualizarProgresso(t.id, Math.min(t.progresso + 10, 100))}
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Avançar
                    </button>
                    {t.concluido && (
                      <button
                        onClick={() => gerarCertificado(t.modulo)}
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        Certificado
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl">Quiz</h2>
          <select
            value={quiz.modulo}
            onChange={(e) => setQuiz({ ...quiz, modulo: e.target.value })}
            className="border p-2 w-full mt-2"
          >
            <option value="">Selecione Módulo</option>
            <option value="Agendamento">Agendamento</option>
            <option value="Odontograma">Odontograma</option>
          </select>
          <button
            onClick={iniciarQuiz}
            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
          >
            Iniciar Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default Treinamento;
