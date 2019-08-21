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
    let isCancelled = false;
    const [letter, setLetter] = useState('');
    const [className, setClassName] = useState('letterCountdown');

    const updateLetterState = (val) => {
        if (!isCancelled)
            setLetter(val);
    }
    const updateClassState = (val) => {
        if (!isCancelled)
            setClassName(val);
    }

    const [{ canDrop, isOver }, drop] = useDrop({
        accept: ItemTypes.BOX,
        drop: (value) => {
            updateLetterState(value.name);
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
        return setTimeout(() => {
            if (letterIndex < lettersArr.length) {
                setTimeout(() => {
                    updateClassState('letterCountdown puffer');
                }, 600);
                updateClassState('letterCountdown');
                updateLetterState(lettersArr[letterIndex]);
                animateLetters(1200);
            }
            else {
                updateClassState('letterCountdown');
                updateLetterState('');
            }
            letterIndex++;
        }, time)
    };

    useEffect(() => {
        console.log('useEffect - LetterRevealer', lettersArr);
        let timer = animateLetters(500);

        return () => {
            isCancelled = true;
            setClassName('letterCountDown');
            setLetter('');
            clearTimeout(timer);
        }
    }, []);
    return (
        <div ref={drop} style={{ ...style, backgroundColor }}>
            <div className={className}>{letter}</div>
            {/* {isActive ? 'Release to drop' : 'Drag a box here'} */}
        </div>
    )
}
export default LetterBox
