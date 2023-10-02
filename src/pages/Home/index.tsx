import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HandPalm, Play } from 'phosphor-react';
import { differenceInSeconds } from 'date-fns';
import * as zod from 'zod';
import {
    CountDownContainer,
    FormContainer,
    HomeContainer,
    MinutesAmountInput,
    Separator,
    StartCountDownButton,
    StoptCountDownButton,
    TaskInput,
} from './styles';


const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod.number().min(5).max(60)
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
    startData: Date;
    interruptedDate?: Date;
}

export function Home() {
    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

    const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        }
    });

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;

    const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;

    const minutesAmount = Math.floor(currentSeconds / 60);
    const secondsAmount = Math.floor(currentSeconds % 60);

    const minutes = String(minutesAmount).padStart(2, '0');
    const seconds = String(secondsAmount).padStart(2, '0');

    const task = watch('task');
    const isSubmitDisabled = !task;

    useEffect(() => {
        // This code runs when the component mounts
        let interval: number;
        if (activeCycle) {
            interval = setInterval(() => {
                setAmountSecondsPassed(differenceInSeconds(new Date(), activeCycle.startData));
            }, 1000);
        }

        // Return a cleanup function
        return () => {
            // This code runs when the component unmounts or when dependencies change
            clearInterval(interval);
        };
    }, [activeCycle]);

    useEffect(() => {
        if (activeCycle) {
            document.title = `${minutes}:${seconds}`;
        }
    }, [minutes, seconds, activeCycle]);

    function handleCreateNewCycle(data: NewCycleFormData) {
        const { task, minutesAmount } = data;
        const id = String(new Date().getTime());

        const newCycle: Cycle = {
            id,
            task,
            minutesAmount,
            startData: new Date(),
        };
        setCycles((state) => [...state, newCycle]);
        setActiveCycleId(id);
        setAmountSecondsPassed(0);

        reset();
    }

    function handleInterruptCycle() {
        setActiveCycleId(null);
        setCycles(cycles.map(cycle => {
            if (cycle.id === activeCycleId) {
                return { ...cycle, interruptedDate: new Date() };
            } else {
                return cycle;
            }
        }));
    }

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action=''>
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

                <CountDownContainer>
                    <span>{minutes[0]}</span>
                    <span>{minutes[1]}</span>
                    <Separator>:</Separator>
                    <span>{seconds[0]}</span>
                    <span>{seconds[1]}</span>
                </CountDownContainer>

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