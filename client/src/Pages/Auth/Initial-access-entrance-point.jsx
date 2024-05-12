import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import './Auth.css';
import Confetti from 'react-confetti';


const Initialaccessentrancepoint = () => {
    const phrases = [
        "Welcome to our community!",
        "1. Be respectful to others. ",
        "2. Ask admins for help if needed. ",
        "3. Connect with like-minded people. ",
        "Spread positivity! ",
    ];  
    const [showConfetti, setShowConfetti] = useState(false);

    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(50);
    const [isCompleted, setIsCompleted] = useState(false);

    const handleSuccess = () => {
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
        }, 6000);
      };

      useEffect(()=>{
        handleSuccess();
      }, []);


    useEffect(() => {
        const handleTyping = () => {
            const currentPhrase = phrases[currentPhraseIndex];
            const currentTextLength = currentText.length;

            if (!isDeleting) {
                setTypingSpeed(78); 
                setCurrentText(currentPhrase.substring(0, currentTextLength + 1));
            } else {
                setCurrentText(currentPhrase.substring(0, currentTextLength - 1));
            }

            if (!isDeleting && currentText === currentPhrase) {
                // Finish typing current phrase, then start deleting
                setTimeout(() => {
                    setIsDeleting(true);
                    setTypingSpeed(78); 
                }, 2000); // Pause for 2.5 seconds before deleting
            } else if(isDeleting && currentText !== ''){
                setTypingSpeed(78); 
            } else if (isDeleting && currentText === '') {
                // Finished deleting, move to next phrase
                if (currentPhraseIndex === phrases.length - 1) {
                    setIsCompleted(true); // All phrases are completed
                } else {
                    setCurrentPhraseIndex((prevIndex) =>
                        (prevIndex + 1) % phrases.length
                    );
                    setIsDeleting(false);
                    setTypingSpeed(78); 
                }
            }
        };

        const typingTimer = setTimeout(handleTyping, typingSpeed);

        return () => clearTimeout(typingTimer);
    }, [currentPhraseIndex, currentText, isDeleting, phrases, typingSpeed]);

    const navigate = useNavigate();


    return (
        <div className='EPIA'>
            {showConfetti && <Confetti />}
            <div className="divContainer">
                <span className='textOn'>{currentText}</span>
                {
                    !isCompleted && <span className="cursor" />
                }
            </div>
            <br />
            {isCompleted && (
                <button
                    onClick={()=>{
                        navigate("/");
                        navigate(0);
                    }} 
                    className="completionButton">Continue&nbsp;&nbsp;<i className='fa-solid fa-arrow-right'></i></button>
            )}
        </div>
    );
};

export default Initialaccessentrancepoint;
