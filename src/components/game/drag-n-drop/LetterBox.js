import React, { useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import ItemTypes from './ItemTypes';
import styled from 'styled-components';
import { FlexboxCenter } from '../../UI/DivUI';

const BoxWrapper = styled(FlexboxCenter)`
    height: 10em;
    width: 10em;
    border-radius: 1.5rem;
    background-color: ${({ bg }) => bg};
`;

const LetterDiv = styled.div`
    color: white;
    font-size: 8rem;
    opacity: 1;
    transition: opacity 0.4s ease;
    &.puffer {
        opacity: 0;
        transform: scale(1.6, 1.6);
        transition: all 0.4s ease-out;
    }
`;

const LetterBox = ({ lettersArr = [] }) => {
    let isCancelled = false;
    let letterIndex = 0;
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
        let timer = animateLetters(500);

        return () => {
            isCancelled = true;
            clearTimeout(timer);
        }
    }, []);

    return (
        <BoxWrapper ref={drop} bg={backgroundColor}>
            <LetterDiv className={className}>{letter}</LetterDiv>
            {/* {isActive ? 'Release to drop' : 'Drag a box here'} */}
        </BoxWrapper>
    )
}
export default LetterBox
