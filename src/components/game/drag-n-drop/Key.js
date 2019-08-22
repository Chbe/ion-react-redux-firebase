import React from 'react';
import { connect } from 'react-redux'
import { useDrag } from 'react-dnd';
import ItemTypes from './ItemTypes';
import styled from 'styled-components';
import { setLetter } from '../../../store/actions';

const KeyDiv = styled.div`
    color: white;
    margin: 1px;
    cursor: move;
    float: left;
    border-radius: 5px;
    height: 6vh;
    line-height: 6vh;
    text-align: center;
    font-size: 30px;
    width: 9vw;
    transition: background-color .2s ease-in;
    opacity: ${({ opacity }) => (opacity)};
    background-color: ${({ background }) => (
        background ? 'var(--ion-color-success);' : 'var(--ion-color-light-shade);')}
`;

const Key = ({ name, setLetterAction, enablePlay }) => {
    const [{ isDragging }, drag] = useDrag({
        canDrag: enablePlay,
        item: { name, type: ItemTypes.BOX },
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult()
            if (item && dropResult) {
                // Dropped ${item.name} into ${dropResult.name}!`)
                setLetterAction(item.name);
            }
        },
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    })
    const opacity = isDragging ? 0.4 : 1
    return (
        <KeyDiv ref={drag} background={enablePlay} opacity={opacity}>{name}</KeyDiv>
    )
}
const mapStateToProps = ({ gameReducer }) => ({
    chosenLetter: gameReducer.letter,
    enablePlay: gameReducer.enablePlay
});

const mapDispatchToProps = {
    setLetterAction: setLetter
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Key)
