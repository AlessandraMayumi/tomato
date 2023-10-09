import { Cycle } from '../../context/CycleContext';

export enum ActionTypes {
  ADD_NEW_CYCLE = 'ADD_NEW_CYCLE',
  FINISHED_DATE = 'FINISHED_DATE',
  INTERRUPT_DATE = 'INTERRUPT_DATE',
}

export function addNewCycleAction(newCycle: Cycle) {
  return {
    type: ActionTypes.ADD_NEW_CYCLE,
    newCycle,
  };
}

export function finishedInterruptAction() {
  return {
    type: ActionTypes.FINISHED_DATE,
  };
}

export function interruptedDateAction() {
  return {
    type: ActionTypes.INTERRUPT_DATE,
  };
}
