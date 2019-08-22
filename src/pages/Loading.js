import React from 'react';
import styled from 'styled-components';

const Container = styled(FlexboxCenter)`
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
