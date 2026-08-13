import { useEffect, useState } from 'react';
import { api } from '../../api/requisicoes.js';
import Indicador from '../../componentes/Indicador.jsx';

export default function PainelDono() {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    api
      .get('/dashboard/owner')
      .then(setDados)
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) return <div className="page">Carregando...</div>;

  return (
    <div className="page">
      <h1>Painel Gerencial</h1>
      <p className="subtitle">Indicadores-chave do seu estabelecimento.</p>

      <div className="grid cols-4">
        <Indicador value={dados.totalClientes} label="Clientes cadastrados" />
        <Indicador value={dados.clientesFieis} label="Clientes fiéis (>10 visitas)" />
        <Indicador value={dados.descontosHoje} label="Descontos hoje" />
        <Indicador value={dados.descontosMes} label="Descontos no mês" />
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3>Faturamento estimado do mês</h3>
        <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--red-600)' }}>
          {dados.faturamentoEstimadoMes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </div>
        <p className="subtitle">{dados.observacao}</p>
      </div>
    </div>
  );
}
