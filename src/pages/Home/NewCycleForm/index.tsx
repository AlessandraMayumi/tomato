import {
  FormContainer,
  MinutesAmountInput,
  TaskInput,
} from './styles';

export function NewCycleForm() {
  return (
    <FormContainer>
      <label>Vou trabalhar em</label>
      <TaskInput
        id='task'
        list='task-suggestions'
        placeholder='Dê um nome para o seu projeto'
        disabled={!!activeCycle}
        {...register('task')}
      />

      <datalist id="task-suggestions">
        <option value="Projeto 1" />
        <option value="Projeto 2" />
        <option value="Projeto 3" />
      </datalist>

      <label>durante</label>
      <MinutesAmountInput
        type='number'
        id='minutesAmount'
        placeholder='00'
        disabled={!!activeCycle}
        step={5}
        min={5}
        max={60}
        {...register('minutesAmount', { valueAsNumber: true })}
      />

      <span>minutes.</span>
    </FormContainer>
  );
}
