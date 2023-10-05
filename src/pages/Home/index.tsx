import { useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HandPalm, Play } from 'phosphor-react';
import * as zod from 'zod';
import { CycleContext } from '../../context/CycleContext';
import { NewCycleForm } from './NewCycleForm';
import { Countdown } from './Countdown';
import {
  HomeContainer,
  StartCountDownButton,
  StoptCountDownButton,
} from './styles';

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number().min(5).max(60)
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

/** Home */
export function Home() {
  // Context
  const {
    activeCycle,
    createNewCycle,
    interruptCycle,
  } = useContext(CycleContext);
  // React hook form
  const form = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
  });
  const { reset, handleSubmit, watch } = form;

  const task = watch('task');
  const isSubmitDisabled = !task;

  // Handle functions
  function handleCreateNewCycle(data: NewCycleFormData) {
    createNewCycle(data);
    reset();
  }

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action=''>
        <FormProvider {...form}>
          <NewCycleForm />
        </FormProvider>
        <Countdown />
        {activeCycle ? (
          <StoptCountDownButton onClick={interruptCycle} type='button'>
            <HandPalm size={24} />
            Interromper
          </StoptCountDownButton>
        ) : (
          <StartCountDownButton disabled={isSubmitDisabled} type='submit'>
            <Play size={24} />
            Começar
          </StartCountDownButton>
        )}
      </form>
    </HomeContainer>
  );
}
