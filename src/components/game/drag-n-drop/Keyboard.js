import React from 'react';
import Key from './Key';
import styled from 'styled-components';
import { FlexboxCenter } from '../../UI/DivUI';

const KeyboardWrapper = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    margin-bottom: 1em;
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
                return <FlexboxCenter key={i}>
                    {row.map(key => {
                        return <Key key={key} name={key} />
                    })}
                </FlexboxCenter>
            })}
        </KeyboardWrapper>
    )
}

export default Keyboard
