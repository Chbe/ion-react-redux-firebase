import React, { useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import ItemTypes from './ItemTypes';
import './LetterBox.css';
import styled from 'styled-components';

const BoxWrapper = styled.div`
    height: 20vh;
    width: 20vw;
    border-radius: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({ bg }) => bg};
`;

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
    let backgroundColor = 'var(--ion-color-success)'
    if (isActive) {
        backgroundColor = 'var(--ion-color-success-tint)'
    } else if (canDrop) {
        backgroundColor = 'var(--ion-color-success-shade)'
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
        // TODO: Styled copmponent
        <BoxWrapper ref={drop} bg={backgroundColor}>
            <div className={className}>{letter}</div>
            {/* {isActive ? 'Release to drop' : 'Drag a box here'} */}
        </BoxWrapper>
    )
}
export default LetterBox
