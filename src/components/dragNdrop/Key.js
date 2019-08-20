import React from 'react'
import { useDrag } from 'react-dnd'
import ItemTypes from './ItemTypes'
const style = {
    border: '1px dashed gray',
    backgroundColor: 'grey',
    color: 'white',
    margin: '1px',
    cursor: 'move',
    float: 'left',
    borderRadius: '5px',
    height: '6vh',
    lineHeight: '6vh',
    textAlign: 'center',
    fontSize: '30px',
    width: '9vw' // flex-grow: 1;
}
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
        <div ref={drag} style={{ ...style, opacity }}>
            {name}
        </div>
    )
}
export default Key
