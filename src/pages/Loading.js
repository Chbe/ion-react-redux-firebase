import React from 'react';
import { IonContent } from '@ionic/react';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;

const H1 = styled.h1`
    color: var(--ion-color-primary);
`;

const Loading = () => {
    return (
        <Container>
            <H1>Logging in...</H1>
        </Container>
    )
}

export default Loading
