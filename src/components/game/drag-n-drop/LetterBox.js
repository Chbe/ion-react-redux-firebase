import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { useDrop } from 'react-dnd';
import ItemTypes from './ItemTypes';
import styled from 'styled-components';
import { FlexboxCenter } from '../../UI/DivUI';

const BoxWrapper = styled(FlexboxCenter)`
    height: 10em;
    width: 10em;
    border-radius: 1.5rem;
    // background-color: ${({ bg }) => bg};
    border-width: 5px;
    border-style: solid;
    border-color: ${({ bg }) => bg};
    transition: border-color .2s ease-in;
`;

const LetterDiv = styled.div`
    color: ${({ color }) => color};
    font-size: 8rem;
    opacity: 1;
    transition: opacity 0.4s ease;
    &.puffer {
        opacity: 0;
        transform: scale(1.6, 1.6);
        transition: all 0.4s ease-out;
    }
`;

const LetterBox = ({ lettersArray, enablePlay }) => {
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
    let backgroundColor = enablePlay ?
        'var(--ion-color-success)' :
        'var(--ion-color-light-shade)';
    let letterColor = enablePlay ?
        'var(--ion-color-success)' :
        'var(--ion-color-primary)';
    if (isActive) {
        backgroundColor = 'var(--ion-color-success-tint)'
    } else if (canDrop) {
        backgroundColor = 'var(--ion-color-success-shade)'
    }

    const animateLetters = (time) => {
        return setTimeout(() => {
            if (letterIndex < lettersArray.length) {
                setTimeout(() => {
                    updateClassState('letterCountdown puffer');
                }, 600);
                updateClassState('letterCountdown');
                updateLetterState(lettersArray[letterIndex]);
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
        isCancelled = false;
        if (lettersArray && !!lettersArray.length) {
            var timer = animateLetters(500);
        }

        return () => {
            isCancelled = true;
            if (timer)
                clearTimeout(timer);
        }
    }, []);

    return (
        <BoxWrapper ref={drop} bg={backgroundColor}>
            <LetterDiv color={letterColor} className={className}>{letter}</LetterDiv>
            {/* {isActive ? 'Release to drop' : 'Drag a box here'} */}
        </BoxWrapper>
    )
}
const mapStateToProps = ({ gameReducer }) => ({
    enablePlay: gameReducer.enablePlay,
    lettersArray: gameReducer.lettersArray
});

const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LetterBox)
