import React from 'react';
import Key from './Key';

const lettersArr = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

const Keyboard = () => {
    return (
        <div style={keyboardStyle}>
            {lettersArr.map((row, i) => {
                return <div key={i} style={rowStyle}>
                    {row.map(key => {
                        return <Key key={key} name={key} />
                    })}
                </div>
            })}
        </div>
    )
}

const keyboardStyle = {
    position: 'fixed',
    bottom: '0',
    left: '0',
    width: '100%'
}

const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}

export default Keyboard
