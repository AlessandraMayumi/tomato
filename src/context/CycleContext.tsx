import { ReactNode, createContext, useEffect, useReducer, useState } from 'react';
import { ActionTypes } from '../reducers/cycles/actions';
import { cycleReducer } from '../reducers/cycles/reducer';

interface CycleContextProviderProps {
  children: ReactNode
}

export interface Cycle {
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
  cycles: Cycle[];
  activeCycle: Cycle | undefined,
  setCycleFinishedDate: () => void,
  activeCycleId: string | null,
  amountSecondsPassed: number;
  updateAmountSecondsPassed: (sec: number) => void,
  createNewCycle: (data: NewCycleType) => void,
  interruptCycle: () => void,
}

interface CyclesState {
  cycles: Cycle[];
  activeCycleId: string | null;
}

/** Context */
export const CycleContext = createContext({} as CycleContextType);

/** Context Provider */
export function CycleContextProvider({ children }: CycleContextProviderProps) {
  // Reducer
  const [cyclesState, dispatch] = useReducer(
    cycleReducer,
    { cycles: [], activeCycleId: null },
    (initArgs) => {
      const storagedStateAsJSON = localStorage.getItem('@tomato:cycles-state');
      if (storagedStateAsJSON) {
        const parsedState = JSON.parse(storagedStateAsJSON) as CyclesState;
        return parsedState;
      }
      return initArgs;
    }
  );
  // State
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);
  // Local
  const { cycles, activeCycleId } = cyclesState;
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  useEffect(() => {
    // updates cycleState in localStorage
    const stateJSON = JSON.stringify(cyclesState);
    localStorage.setItem('@tomato:cycles-state', stateJSON);
  }, [cyclesState]);

  /* Context function */
  function setCycleFinishedDate() {
    dispatch({
      type: ActionTypes.FINISHED_DATE,
    });
  }

  function updateAmountSecondsPassed(sec: number = 0) {
    // works as a proxy, a function calling another function
    setAmountSecondsPassed(sec);
  }

  /* Handle functions */ 
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
      type: ActionTypes.ADD_NEW_CYCLE,
      newCycle,
    });
    setAmountSecondsPassed(0);
  }

  function interruptCycle() {
    dispatch({
      type: ActionTypes.INTERRUPT_DATE,
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