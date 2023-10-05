import { useContext, useEffect } from 'react';
import { differenceInSeconds } from 'date-fns';
import { CycleContext } from '../../../context/CycleContext';
import {
  CountDownContainer,
  Separator,
} from './styles';


export function Countdown() {
  // Context
  const {
    activeCycle,
    setCycleFinishedDate,
    activeCycleId,
    amountSecondsPassed,
    updateAmountSecondsPassed,
  } = useContext(CycleContext);
  // Local
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;

  const minutesAmount = Math.floor(currentSeconds / 60);
  const secondsAmount = Math.floor(currentSeconds % 60);

  const minutes = String(minutesAmount).padStart(2, '0');
  const seconds = String(secondsAmount).padStart(2, '0');

  // functions

  useEffect(() => {
    // This code runs when the component mounts
    let interval: number;
    if (activeCycle) {
      interval = setInterval(() => {
        const currentSeconds = differenceInSeconds(new Date(), activeCycle.startDate);

        if (currentSeconds < totalSeconds) updateAmountSecondsPassed(currentSeconds);
        else {
          setCycleFinishedDate();
          clearInterval(interval);
          updateAmountSecondsPassed(0);
        }
      }, 1000);
    }
    // Return a cleanup function
    return () => {
      // This code runs when the component unmounts or when dependencies change
      clearInterval(interval);
    };
  }, [activeCycle, totalSeconds, activeCycleId, setCycleFinishedDate, updateAmountSecondsPassed]);

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`;
    }
  }, [minutes, seconds, activeCycle]);

  return (
    <CountDownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountDownContainer>
  );
}
