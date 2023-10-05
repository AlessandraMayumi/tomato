import { createContext, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HandPalm, Play } from 'phosphor-react';
import * as zod from 'zod';
import {
  HomeContainer,
  StartCountDownButton,
  StoptCountDownButton,
} from './styles';
import { NewCycleForm } from './NewCycleForm';
import { Countdown } from './Countdown';


const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number().min(5).max(60)
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

// Context API
interface CycleContextType {
  activeCycle: Cycle | undefined,
  setCycleFinishedDate: () => void,
  activeCycleId: string | null,
  amountSecondsPassed: number;
  updateAmountSecondsPassed: (sec: number) => void,
}
export const CycleContext = createContext({} as CycleContextType);

/** Home */
export function Home() {
  // State
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

  // React hook form
  const form = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
  });
  const { handleSubmit, watch, reset } = form;

  // Local
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  const task = watch('task');
  const isSubmitDisabled = !task;

  // Handle functions
  function handleCreateNewCycle(data: NewCycleFormData) {
    const { task, minutesAmount } = data;
    const id = String(new Date().getTime());

    const newCycle: Cycle = {
      id,
      task,
      minutesAmount,
      startDate: new Date(),
    };
    setCycles((state) => [...state, newCycle]);
    setActiveCycleId(id);
    setAmountSecondsPassed(0);

    reset();
  }

  function handleInterruptCycle() {
    setActiveCycleId(null);
    setCycles(state => state.map(cycle => {
      if (cycle.id === activeCycleId) return { ...cycle, interruptedDate: new Date() };
      else return cycle;
    }));
  }

  // Context function
  function setCycleFinishedDate() {
    setCycles(state =>
      state.map(cycle => {
        if (cycle.id === activeCycleId) return { ...cycle, finishedDate: new Date() };
        else return cycle;
      })
    );
  }

  function updateAmountSecondsPassed(sec: number = 0) {
    // works as a proxy, a function calling another function
    setAmountSecondsPassed(sec);
  }

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action=''>
        <CycleContext.Provider value={{
          activeCycle,
          setCycleFinishedDate,
          activeCycleId,
          amountSecondsPassed,
          updateAmountSecondsPassed,
        }}>
          <FormProvider {...form}>
            <NewCycleForm />
          </FormProvider>
          <Countdown />
        </CycleContext.Provider>
        {activeCycle ? (
          <StoptCountDownButton onClick={handleInterruptCycle} type='button'>
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
