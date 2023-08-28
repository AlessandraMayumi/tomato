import { Play } from 'phosphor-react';
import { CountDownContainer, FormContainer, HomeContainer, MinutesAmountInput, Separator, StartCountDownButton, TaskInput } from './styles';

export function Home() {
    return (
        <HomeContainer>
            <form>
                <FormContainer>
                    <label>Vou trabalhar em</label>
                    <TaskInput
                        id='task'
                        placeholder='Dê um nome para o seu projeto' />

                    <label>durante</label>
                    <MinutesAmountInput
                        type='number'
                        id='minutesAmount'
                        placeholder='00' />

                    <span>minutes.</span>
                </FormContainer>

                <CountDownContainer>
                    <span>0</span>
                    <span>0</span>
                    <Separator>:</Separator>
                    <span>0</span>
                    <span>0</span>
                </CountDownContainer>

                <StartCountDownButton type='submit'>
                    <Play size={24} />
                    Começar
                </StartCountDownButton>
            </form>
        </HomeContainer>
    );
}