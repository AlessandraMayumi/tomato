import { ReactNode, createContext, useReducer, useState } from 'react';

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

interface CyclesState {
  cycles: Cycle[],
  activeCycleId: string | null,
}

interface CycleContextType {
  cycles: Cycle[];
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
  // Reducer Cycle
  const [cyclesState, dispatch] = useReducer((state: CyclesState, action: any) => {
    switch (action.type) {
    case 'ADD_NEW_CYCLE':
      return {
        ...state,
        cycles: [...state.cycles, action.newCycle],
        activeCycleId: action.newCycle.id
      };
    case 'FINISHED_DATE':
      return {
        ...state,
        cycles: state.cycles.map(cycle => {
          if (cycle.id === state.activeCycleId) return { ...cycle, finishedDate: new Date() };
          else return cycle;
        })
      };
    case 'INTERRUPT_DATE':
      return {
        ...state,
        cycles: state.cycles.map(cycle => {
          if (cycle.id === state.activeCycleId) return { ...cycle, interruptedDate: new Date() };
          else return cycle;
        }),
        activeCycleId: null,
      };
    default:
      return state;
    }
  }, {
    cycles: [],
    activeCycleId: null,
  });
  // State
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);
  // Local
  const {cycles, activeCycleId} = cyclesState;
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  // Context function
  function setCycleFinishedDate() {
    dispatch({
      type: 'FINISHED_DATE',
    });
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
    dispatch({
      type: 'ADD_NEW_CYCLE',
      newCycle,
    });
    setAmountSecondsPassed(0);
  }

  function interruptCycle() {
    dispatch({
      type: 'INTERRUPT_DATE',
    });
  }

  return (
    <CycleContext.Provider value={{
      cycles,
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