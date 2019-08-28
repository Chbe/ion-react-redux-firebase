import React from 'react';
import Key from './Key';
import { FlexboxCenter } from '../../UI/DivUI';

const lettersArr = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

const Keyboard = () => {
    return (
        <div>
            {lettersArr.map((row, i) => {
                return <FlexboxCenter key={i}>
                    {row.map(key => {
                        return <Key key={key} name={key} />
                    })}
                </FlexboxCenter>
            })}
        </div>
    )
}

export default Keyboard
