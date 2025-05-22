import React, { useState } from 'react';

const Configuracoes = () => {
  const [config, setConfig] = useState({
    logo: '',
    tema: 'Claro',
    fusoHorario: 'GMT-3',
    idiomaAnamnese: 'Português',
  });

  const handleInputChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const exportarConfig = () => {
    const json = JSON.stringify(config);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'configuracoes.json';
    a.click();
  };

  const importarConfig = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        setConfig(json);
        alert('Configurações importadas com sucesso!');
      } catch {
        alert('Erro ao importar configurações!');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold">Configurações</h1>
      <div className="bg-white p-4 rounded shadow mt-4">
        <h2 className="text-xl">Personalização</h2>
        <input
          type="file"
          name="logo"
          accept="image/*"
          onChange={(e) => setConfig({ ...config, logo: e.target.files[0]?.name })}
          className="border p-2 w-full mt-2"
        />
        <select
          name="tema"
          value={config.tema}
          onChange={handleInputChange}
          className="border p-2 w-full mt-2"
        >
          <option value="Claro">Claro</option>
          <option value="Escuro">Escuro</option>
        </select>
        <select
          name="fusoHorario"
          value={config.fusoHorario}
          onChange={handleInputChange}
          className="border p-2 w-full mt-2"
        >
          <option value="GMT-3">GMT-3 (Brasil)</option>
          <option value="GMT">GMT</option>
        </select>
        <select
          name="idiomaAnamnese"
          value={config.idiomaAnamnese}
          onChange={handleInputChange}
          className="border p-2 w-full mt-2"
        >
          <option value="Português">Português</option>
          <option value="Inglês">Inglês</option>
          <option value="Espanhol">Espanhol</option>
        </select>
        <button
          onClick={exportarConfig}
          className="bg-blue-500 text-white px-4 py-2 mt-4 rounded mr-2"
        >
          Exportar Configurações
        </button>
        <input
          type="file"
          accept=".json"
          onChange={importarConfig}
          className="border p-2 w-full mt-2"
        />
      </div>
    </div>
  );
};

export default Configuracoes;
