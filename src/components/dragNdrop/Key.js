import React from 'react';
import { useDrag } from 'react-dnd';
import ItemTypes from './ItemTypes';
import styled from 'styled-components';

const KeyDiv = styled.div`
    background-color: var(--ion-color-success);
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
    opacity: ${({ opacity }) => (opacity)};
`;

const Key = ({ name }) => {
    const [{ isDragging }, drag] = useDrag({
        item: { name, type: ItemTypes.BOX },
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult()
            if (item && dropResult) {
                // alert(`You dropped ${item.name} into ${dropResult.name}!`)
            }
        },
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    })
    const opacity = isDragging ? 0.4 : 1
    return (
        <KeyDiv ref={drag} opacity={opacity}>{name}</KeyDiv>
    )
}
export default Key
