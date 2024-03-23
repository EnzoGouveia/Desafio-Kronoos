"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { pageState, limitState } from './atoms';

const ClienteList = () => {
  const [clientes, setClientes] = useState([]);
  const [page, setPage] = useRecoilState(pageState);
  const [limit, setLimit] = useRecoilState(limitState);
  const [filtros, setFiltros] = useState({});
  const [filtrosAplicados, setFiltrosAplicados] = useState({});

  const fetchData = async () => {
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);

      let filtrosAgrupados = '';
      let valoresAgrupados = '';

      for (const [campo, valor] of Object.entries(filtrosAplicados)) {
        filtrosAgrupados += `${campo},`;
        valoresAgrupados += `${valor},`;
      }
      filtrosAgrupados = filtrosAgrupados.slice(0, -1);
      valoresAgrupados = valoresAgrupados.slice(0, -1);

      params.append('filtros', filtrosAgrupados);
      params.append('valores', valoresAgrupados);

      const response = await axios.get(`http://localhost:8080/clientes?${params.toString()}`);
      setClientes(response.data);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, filtrosAplicados]);

  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value);

    if (newLimit >= 1) {
      setLimit(newLimit);
      setPage(1);
    }
  };

  const handleFilterChange = (campo, valor) => {
    setFiltros({ ...filtros, [campo]: valor });
  };

  const handleFilterSubmit = () => {
    setFiltrosAplicados({ ...filtros });
    setPage(1);
  };

  const clearFilters = () => {
    setFiltros({});
    setFiltrosAplicados({});
    setPage(1);
  };

  const camposFiltraveis = [
    { campo: "nrInst", tipo: "texto" },
    { campo: "nrAgencia", tipo: "texto" },
    { campo: "cdClient", tipo: "texto" },
    { campo: "nmClient", tipo: "texto" },
    { campo: "nrCpfCnpj", tipo: "texto" },
    { campo: "nrContrato", tipo: "texto" },
    { campo: "dtContrato", tipo: "data" },
    { campo: "qtPrestacoes", tipo: "texto" },
    { campo: "vlTotal", tipo: "texto" },
    { campo: "cdProduto", tipo: "texto" },
    { campo: "dsProduto", tipo: "texto" },
    { campo: "cdCarteira", tipo: "texto" },
    { campo: "dsCarteira", tipo: "texto" },
    { campo: "nrProposta", tipo: "texto" },
    { campo: "nrPresta", tipo: "texto" },
    { campo: "tpPresta", tipo: "texto" },
    { campo: "nrSeqPre", tipo: "texto" },
    { campo: "dtVctPre", tipo: "data" },
    { campo: "vlPresta", tipo: "texto" },
    { campo: "vlMora", tipo: "texto" },
    { campo: "vlMulta", tipo: "texto" },
    { campo: "vlOutAcr", tipo: "texto" },
    { campo: "vlIof", tipo: "texto" },
    { campo: "vlDescon", tipo: "texto" },
    { campo: "vlAtual", tipo: "texto" },
    { campo: "idSituac", tipo: "texto" },
    { campo: "idSitVen", tipo: "texto" },
    { campo: "isDocumentValid", tipo: "opcao" },
    { campo: "isPaymentValid", tipo: "opcao" }
  ];

  return (
    <div style={{ overflowX: 'auto', marginBottom: '30px'}}>
        <h2>Lista de Clientes</h2>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <label htmlFor="pageInput" style={{ marginRight: '10px' }}>Página:</label>
            <button onClick={() => setPage(page - 1)} disabled={page === 1}>{'<'}</button>
            <div style={{ display: 'flex', alignItems: 'center', margin: '0 10px' }}>
                <input
                    type="number"
                    id="pageInput"
                    value={page}
                    min={1}
                    onChange={(e) => setPage(parseInt(e.target.value))}
                    style={{ marginLeft: '5px', width: '50px', textAlign: 'center' }}
                />
            </div>
            <button onClick={() => setPage(page + 1)} disabled={clientes.length < limit}>{'>'}</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <label htmlFor="limitInput" style={{ marginRight: '10px' }}>Itens por página:</label>
            <button onClick={() => setLimit(limit - 1)} disabled={limit === 1}>{'<'}</button>
            <div style={{ display: 'flex', alignItems: 'center', margin: '0 10px' }}>
                <input
                    type="number"
                    id="limitInput"
                    value={limit}
                    onChange={handleLimitChange}
                    min={1}
                    style={{ marginLeft: '5px', width: '50px', textAlign: 'center' }}
                />
            </div>
            <button onClick={() => setLimit(limit + 1)}>{'>'}</button>
        </div>
        <div>
        <button style={{ marginRight: '10px' }} onClick={handleFilterSubmit}>Filtrar</button>
        <button style={{ marginRight: '10px' }} onClick={clearFilters}>Limpar Filtros</button>
        </div>
        <table style={{ margin: 'auto' }}>
        <thead>
            <tr>
            {camposFiltraveis.map(({ campo }) => (
                <th key={campo}>
                {campo}
                {campo === "isDocumentValid" || campo === "isPaymentValid" ? (
                    <select
                    value={filtros[campo] || ''}
                    onChange={(e) => handleFilterChange(campo, e.target.value)}
                    >
                    <option value="">Selecionar</option>
                    <option value="Sim">Sim</option>
                    <option value="Não">Não</option>
                    </select>
                ) : campo === "dtContrato" || campo === "dtVctPre" ? (
                    <input
                    type="date"
                    value={filtros[campo] || ''}
                    onChange={(e) => handleFilterChange(campo, e.target.value)}
                    />
                ) : (
                    <input
                    type="text"
                    value={filtros[campo] || ''}
                    onChange={(e) => handleFilterChange(campo, e.target.value)}
                    />
                )}
                </th>
            ))}
            </tr>
        </thead>
        <tbody>
            {clientes.map((cliente, index) => (
            <tr key={index}>
                {camposFiltraveis.map(({ campo, tipo }) => (
                <td key={campo} style={{ textAlign: 'center' }}>
                    {
                    tipo === 'opcao' ?
                        cliente.c.properties[campo] ? 'Sim' : 'Não' :
                    tipo === 'data' ?
                        new Date(cliente.c.properties[campo]).toLocaleDateString() :
                        cliente.c.properties[campo]
                    }
                </td>
                ))}
            </tr>
            ))}
        </tbody>
        </table>
    </div>
  );
};

export default ClienteList;