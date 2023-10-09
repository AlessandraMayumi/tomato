import { Cycle } from '../../context/CycleContext';
import { ActionTypes } from './actions';

interface CyclesState {
  cycles: Cycle[],
  activeCycleId: string | null,
}

export function cycleReducer(state: CyclesState, action: any) {
  switch (action.type) {
  case ActionTypes.ADD_NEW_CYCLE:
    return {
      ...state,
      cycles: [...state.cycles, action.newCycle],
      activeCycleId: action.newCycle.id
    };
  case ActionTypes.FINISHED_DATE:
    return {
      ...state,
      cycles: state.cycles.map(cycle => {
        if (cycle.id === state.activeCycleId) return { ...cycle, finishedDate: new Date() };
        else return cycle;
      })
    };
  case ActionTypes.INTERRUPT_DATE:
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
}
