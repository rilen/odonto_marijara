import React, { useState, useRef } from 'react';

const Contatos = () => {
  const [paciente, setPaciente] = useState({ nome: '', email: '', telefone: '' });
  const [historico, setHistorico] = useState([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleInputChange = (e) => {
    setPaciente({ ...paciente, [e.target.name]: e.target.value });
  };

  const startWebcam = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  const capturePhoto = () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, 320, 240);
    const image = canvasRef.current.toDataURL('image/png');
    setHistorico([...historico, { data: new Date().toLocaleDateString(), imagem: image }]);
  };

  const addHistorico = () => {
    setHistorico([...historico, { data: new Date().toLocaleDateString(), tipo: 'Consulta', anexo: '' }]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold">Gestão de Contatos</h1>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl">Cadastro de Paciente</h2>
          <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={paciente.nome}
            onChange={handleInputChange}
            className="border p-2 w-full mt-2"
          />
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={paciente.email}
            onChange={handleInputChange}
            className="border p-2 w-full mt-2"
          />
          <input
            type="text"
            name="telefone"
            placeholder="Telefone"
            value={paciente.telefone}
            onChange={handleInputChange}
            className="border p-2 w-full mt-2"
          />
          <button className="bg-blue-500 text-white px-4 py-2 mt-4 rounded">Salvar</button>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl">Webcam</h2>
          <video ref={videoRef} autoPlay className="w-full" />
          <canvas ref={canvasRef} width="320" height="240" className="hidden" />
          <button
            onClick={startលstartWebcam}
            className="bg-green-500 text-white px-4 py-2 mt-2 rounded"
          >
            Iniciar Webcam
          </button>
          <button
            onClick={capturePhoto}
            className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
          >
            Capturar Foto
          </button>
        </div>
      </div>
      <div className="bg-white p-4 rounded shadow mt-4">
        <h2 className="text-xl">Histórico</h2>
        <button
          onClick={addHistorico}
          className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
        >
          Adicionar Registro
        </button>
        <table className="w-full mt-4 border">
          <thead>
            <tr>
              <th>Data</th>
              <th>Tipo</th>
              <th>Anexo</th>
            </tr>
          </thead>
          <tbody>
            {historico.map((item, index) => (
              <tr key={index}>
                <td>{item.data}</td>
                <td>{item.tipo}</td>
                <td>{item.imagem ? <img src={item.imagem} alt="anexo" className="w-16" /> : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Contatos;