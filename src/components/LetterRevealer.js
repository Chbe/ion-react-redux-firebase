import React, { useState, useEffect } from 'react';
import './LetterRevealer.css';

let letterIndex = 0;
const lettersArr = ['a', 'b', 'd'];


const LetterRevealer = () => {
    const [letter, setLetter] = useState('');
    const [className, setClassName] = useState('letterCountdown');

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
        <div>
            <div className={className}>{letter}</div>
        </div>
    )
}

export default LetterRevealer
