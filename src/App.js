import { useEffect, useState } from 'react';
import './App.css';
import SingleCard from './components/SingleCard';

const cardImages = [
    { "src": "/img/helmet-1.png", matched: false },
    { "src": "/img/potion-1.png", matched: false },
    { "src": "/img/ring-1.png", matched: false },
    { "src": "/img/scroll-1.png", matched: false },
    { "src": "/img/shield-1.png", matched: false },
    { "src": "/img/sword-1.png", matched: false }
]

function App() {
    const [cards, setCards] = useState([]);
    const [turns, setTurns] = useState(0);
    const [score, setScore] = useState(0);
    const [choiceOne, setChoiceOne] = useState(null);
    const [choiceTwo, setChoiceTwo] = useState(null);
    const [disabled, setDisabled] = useState(false);
    const [newGame, setNewGame] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    //shuffle cards
    const shuffleCards = () => {
        const shuffledCards = [...cardImages, ...cardImages]
        .sort(() => Math.random() - 0.5)
        .map((card) => ({...card, id: Math.random()}));

        setChoiceOne(null);
        setChoiceTwo(null);
        setCards(shuffledCards);
        setNewGame(false);
        setTimeout(() => setNewGame(true), 200);
        setTimeout(() => setNewGame(false), 2000);
        if(turns >= 6) {
            if(score === 0) setScore(turns);
            else setScore(Math.min(score, turns));
        }
        setTurns(0);
    }

    // handle a choice
    const handleChoice = (card) => {
        choiceOne ? setChoiceTwo(card) : setChoiceOne(card);

    }

    // reset choices and increase turn 
    const resetTurn = () => {
        setChoiceOne(null);
        setChoiceTwo(null);
        setTurns(prevTurns => prevTurns + 1);
        setDisabled(false);
    }

    // compare 2 selected cards
    useEffect(() => {
        if(choiceOne && choiceTwo) {
            setDisabled(true);

            if(choiceOne.src === choiceTwo.src) {
                setCards(prevCards => {
                    return prevCards.map(card => {
                        if(card.src === choiceOne.src) {
                            return {...card, matched: true};
                        }
                        else {
                            return card;
                        }
                    })
                })
                resetTurn();
            }
            else {
                setTimeout(() => resetTurn(), 1000);
            }
        }
    }, [choiceOne, choiceTwo])

    // start a new game automagically 
    useEffect(() => {
        setTimeout(() => setIsLoading(false), 3000);
        shuffleCards();
        setTimeout(() => setNewGame(true), 3100);
        setTimeout(() => setNewGame(false), 5600);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="App">
        <h1>Magic Memory</h1>
        <button onClick={shuffleCards}>New Game</button>

            <div className="score">
                <p>Turns: {turns} </p>
                <p>Best: {score} </p>
            </div>

            {isLoading && <div className="lds-ripple"><div></div><div></div></div>}

            {!isLoading && <div className="card-grid">
                {cards.map(card => (
                    <SingleCard 
                        key={card.id} 
                        card={card}
                        handleChoice={handleChoice}
                        flipped={card === choiceOne || card === choiceTwo || card.matched || newGame} 
                        disabled={disabled}
                    />
                ))}
            </div>
            }
        </div>
    );
}

export default App;
