import { ReactNode, createContext, useState } from 'react';

interface CycleContextProviderProps {
  children: ReactNode
}

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

interface NewCycleType {
  task: string,
  minutesAmount: number,
}

interface CycleContextType {
  activeCycle: Cycle | undefined,
  setCycleFinishedDate: () => void,
  activeCycleId: string | null,
  amountSecondsPassed: number;
  updateAmountSecondsPassed: (sec: number) => void,
  createNewCycle: (data: NewCycleType) => void,
  interruptCycle: () => void,
}

/** Context */
export const CycleContext = createContext({} as CycleContextType);

/** Context Provider */
export function CycleContextProvider({ children }: CycleContextProviderProps) {
  // State
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);
  // Local
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  // Context function
  function setCycleFinishedDate() {
    setCycles(state => state.map(cycle => {
      if (cycle.id === activeCycleId) return { ...cycle, finishedDate: new Date() };
      else return cycle;
    })
    );
  }

  function updateAmountSecondsPassed(sec: number = 0) {
    // works as a proxy, a function calling another function
    setAmountSecondsPassed(sec);
  }

  // Handle functions
  function createNewCycle(data: NewCycleType) {
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

    // reset();
  }

  function interruptCycle() {
    setActiveCycleId(null);
    setCycles(state => state.map(cycle => {
      if (cycle.id === activeCycleId) return { ...cycle, interruptedDate: new Date() };
      else return cycle;
    }));
  }

  return (
    <CycleContext.Provider value={{
      activeCycle,
      setCycleFinishedDate,
      activeCycleId,
      amountSecondsPassed,
      updateAmountSecondsPassed,
      createNewCycle,
      interruptCycle,
    }}>
      {children}
    </CycleContext.Provider>
  );
}