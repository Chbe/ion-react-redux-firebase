import React, { useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import ItemTypes from './ItemTypes';
import './LetterBox.css';

const style = {
    height: '20vh',
    width: '20vw',
    borderRadius: '1.5rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
}
let letterIndex = 0;

const LetterBox = ({ lettersArr = [] }) => {
    const [letter, setLetter] = useState('');
    const [className, setClassName] = useState('letterCountdown');

    const [{ canDrop, isOver }, drop] = useDrop({
        accept: ItemTypes.BOX,
        drop: (value) => {
            setLetter(value.name);
            return ({ name: 'LetterBox' });
        },
        collect: monitor => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    })
    const isActive = canDrop && isOver
    let backgroundColor = 'grey'
    if (isActive) {
        backgroundColor = 'pink'
    } else if (canDrop) {
        backgroundColor = 'red'
    }

    const animateLetters = (time) => {
        setTimeout(() => {
            if (letterIndex < lettersArr.length) {
                setTimeout(() => {
                    setClassName('letterCountdown puffer');
                }, 600);
                setClassName('letterCountdown');
                setLetter(lettersArr[letterIndex]);
                animateLetters(1200);
            }
            else {
                setClassName('letterCountdown');
                setLetter('');
            }
            letterIndex++;
        }, time)
    };

    useEffect(() => {
        console.log('useEffect - LetterRevealer');
        animateLetters(500);
    }, []);
    return (
        <div ref={drop} style={{ ...style, backgroundColor }}>
            <div className={className}>{letter}</div>
            {/* {isActive ? 'Release to drop' : 'Drag a box here'} */}
        </div>
    )
}
export default LetterBox
