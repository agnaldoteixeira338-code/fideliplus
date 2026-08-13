import { useToast } from '../../../contexto/ContextoNotificacoes.jsx';
import { api } from '../../../api/requisicoes.js';

const STATUS_LABEL = {
  pendente: { label: 'Pendente', cls: 'badge-gray' },
  confirmado: { label: 'Confirmado', cls: 'badge-green' },
  concluido: { label: 'Concluído', cls: 'badge-green' },
  cancelado: { label: 'Cancelado', cls: 'badge-red' },
};

export default function StatusSolicitacao({ solicitacoes, onAtualizado }) {
  const { showToast } = useToast();

  async function avancar(id) {
    try {
      await api.put(`/health/requests/${id}/advance`);
      showToast('Status da solicitação atualizado!', 'success');
      onAtualizado?.();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async function cancelar(id) {
    try {
      await api.put(`/health/requests/${id}/cancel`);
      showToast('Solicitação cancelada.', 'success');
      onAtualizado?.();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  return (
    <div className="card">
      <h3>Minhas solicitações</h3>
      {solicitacoes.length === 0 && <div className="empty-state">Nenhuma solicitação feita ainda.</div>}
      <table className="table">
        <thead>
          <tr>
            <th>Especialidade</th>
            <th>Data/Horário</th>
            <th>Médico</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {solicitacoes.map((s) => (
            <tr key={s.id}>
              <td>{s.especialidade}</td>
              <td>
                {new Date(s.data_preferencial).toLocaleDateString('pt-BR')} {s.horario_preferencial}
              </td>
              <td>{s.medico_nome}</td>
              <td>
                <span className={`badge ${STATUS_LABEL[s.status].cls}`}>{STATUS_LABEL[s.status].label}</span>
              </td>
              <td style={{ display: 'flex', gap: 6 }}>
                {['pendente', 'confirmado'].includes(s.status) && (
                  <>
                    <button className="btn btn-secondary" onClick={() => avancar(s.id)}>
                      Simular avanço
                    </button>
                    <button className="btn btn-ghost" onClick={() => cancelar(s.id)}>
                      Cancelar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
