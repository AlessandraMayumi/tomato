import { Play } from 'phosphor-react';
import { CountDownContainer, FormContainer, HomeContainer, Separator } from './styles';

export function Home() {
    return (
        <HomeContainer>
            <form>
                <FormContainer>
                    <label>Vou trabalhar em</label>
                    <input id='task' />

                    <label>durante</label>
                    <input type='number' id='minutesAmount' />

                    <span>minutes.</span>
                </FormContainer>

                <CountDownContainer>
                    <span>0</span>
                    <span>0</span>
                    <Separator>:</Separator>
                    <span>0</span>
                    <span>0</span>
                </CountDownContainer>

                <button type='submit'>
                    <Play size={24} />
                    Começar
                </button>
            </form>
        </HomeContainer>
    );
}