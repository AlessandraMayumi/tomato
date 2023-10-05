import { useContext } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CycleContext } from '../../context/CycleContext';
import { HistoryContainer, HistoryList, Status } from './style';

export function History() {
  const { cycles } = useContext(CycleContext);

  const HistoryItem = cycles.map(cycle => {
    return (
      <tr key={cycle.id}>
        <td>{cycle.task}</td>
        <td>{cycle.minutesAmount}</td>
        <td>{formatDistanceToNow(cycle.startDate, { addSuffix: true, locale: ptBR })}</td>
        <td>
          {cycle.finishedDate &&
            <Status statusColor="green">Concluído</Status>}
          {!cycle.finishedDate && !cycle.interruptedDate &&
            <Status statusColor="yellow">Em Andamento</Status>}
          {!cycle.finishedDate && cycle.interruptedDate &&
            <Status statusColor="red">Interrompido</Status>}
        </td>
      </tr>
    );
  });

  return (
    <HistoryContainer>
      <h1>Meu histórico</h1>

      <HistoryList>
        <table>
          <thead>
            <tr>
              <th>Tarefa</th>
              <th>Duração</th>
              <th>Início</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {HistoryItem}
          </tbody>
        </table>
      </HistoryList>
    </HistoryContainer>
  );
}