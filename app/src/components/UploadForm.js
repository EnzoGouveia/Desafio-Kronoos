"use client";
import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleCreateNodes = async () => {
    if (!selectedFile) {
      console.error('Nenhum arquivo selecionado.');
      return;
    }

    const formData = new FormData();
    formData.append('data.csv', selectedFile);

    try {
      const response = await axios.post('http://localhost:8080/clientes/createNodesFromCsv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Resposta do servidor:', response.data);
    } catch (error) {
      console.error('Erro ao criar nós a partir do CSV:', error);
    }
  };

  return (
    <div>
      <div>
        <h2>Upload de Arquivo CSV</h2>
        <input type="file" accept=".csv" onChange={handleFileChange} />
      </div>
      <div>
        <button onClick={handleCreateNodes}>Enviar</button>
      </div>
    </div>
  );
};

export default UploadForm;