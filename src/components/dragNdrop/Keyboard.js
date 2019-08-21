import React from 'react';
import Key from './Key';
import styled from 'styled-components';

const KeyboardWrapper = styled.div`
    position: fixed;
    bottom: 0;
    left: 0:
    width: 100%;
`;

const KeyboardRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const lettersArr = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

const Keyboard = () => {
    return (
        <KeyboardWrapper>
            {lettersArr.map((row, i) => {
                return <KeyboardRow key={i}>
                    {row.map(key => {
                        return <Key key={key} name={key} />
                    })}
                </KeyboardRow>
            })}
        </KeyboardWrapper>
    )
}

export default Keyboard
