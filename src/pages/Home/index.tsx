import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Play } from 'phosphor-react';
import * as zod from 'zod';
import {
    CountDownContainer,
    FormContainer,
    HomeContainer,
    MinutesAmountInput,
    Separator,
    StartCountDownButton,
    TaskInput,
} from './styles';


const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmont: zod.number().min(5).max(60)
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>


export function Home() {
    const { register, handleSubmit, watch } = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmont: 0,
        }
    });

    function handleCreateNewCycle(data: NewCycleFormData) {
        console.log(data);
    }

    const isSubmitDisabled = !watch('task');

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action=''>
                <FormContainer>
                    <label>Vou trabalhar em</label>
                    <TaskInput
                        id='task'
                        list='task-suggestions'
                        placeholder='Dê um nome para o seu projeto'
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
                        step={5}
                        min={5}
                        max={60}
                        {...register('minutesAmount', { valueAsNumber: true })}
                    />

                    <span>minutes.</span>
                </FormContainer>

                <CountDownContainer>
                    <span>0</span>
                    <span>0</span>
                    <Separator>:</Separator>
                    <span>0</span>
                    <span>0</span>
                </CountDownContainer>

                <StartCountDownButton disabled={isSubmitDisabled} type='submit'>
                    <Play size={24} />
                    Começar
                </StartCountDownButton>
            </form>
        </HomeContainer>
    );
}