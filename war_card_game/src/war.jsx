import { useRef, useState, useEffect } from 'react';
import './App.css';
import Deck from './deck.js';

function War() {
    const [playerDeck, setPlayerDeck] = useState(null)
    const [playerCardSlot, setPlayerCardSlot] = useState(null)
    const [computerDeck, setComputerDeck] = useState(null)
    const [computerCardSlot, setComputerCardSlot] = useState(null)
    const [inRound, setInRound] = useState(false)
    const [stop, setStop] = useState(false)
    const [war, setWar] = useState(false)
    const [text, setText] = useState('')

    const deck = new Deck

    const CARD_VALUE_MAP = {
        "2" : 2,
        "3" : 3,
        "4" : 4,
        "5" : 5,
        "6" : 6,
        "7" : 7,
        "8" : 8,
        "9" : 9,
        "10" : 10,
        "J" : 11,
        "Q" : 12,
        "K" : 13,
        "A" : 14,
    }

    useEffect(() => {
        startGame(); // Call startGame function when the component is mounted
    }, []);



    function startGame() {
        deck.shuffle()

        const deckMidPoint = Math.ceil(deck.numberOfCards / 2)
        setPlayerDeck(new Deck(deck.cards.slice(0, deckMidPoint)))
        setComputerDeck(new Deck(deck.cards.slice(deckMidPoint, deck.numberOfCards)))
        setInRound(false),
        setStop(false)
        setWar(false)

        cleanBeforeRound()
    }

    function cleanBeforeRound() {
        setInRound(false)
        setComputerCardSlot(null)
        setPlayerCardSlot(null)
        setText('')

        updateDeckCount()
    }

    function flipCards() {
        setInRound(true)

        const playerCard = playerDeck.pop()
        const computerCard = computerDeck.pop()
        console.log(playerCard)

        setPlayerCardSlot(playerCard);
        setComputerCardSlot(computerCard);

        updateDeckCount()
        
        if (isRoundWinner(playerCard, computerCard)) {
            setText('Win')
            addCardsToPlayerDeck(playerCard, computerCard)

        } else if (isRoundWinner(computerCard, playerCard)){
            setText("Lose");
            addCardsToComputerDeck(computerCard, playerCard)
        } else {
            setText('War')
            warRound()
        }
        
        if (isGameOver(playerDeck)) {
            setText('You Lose!!!')
            setStop(true)
        } else if (isGameOver(computerDeck)) {
            setText('You Won!')
            setStop(true)
        }
    }

    function addCardsToPlayerDeck(cardOne, cardTwo){
        setPlayerDeck((oldDeck) => (oldDeck === null ? [cardOne, cardTwo] : [...oldDeck, cardOne, cardTwo]));
    }
    function addCardsToComputerDeck(cardOne, cardTwo){
        setComputerDeck((oldDeck) => (oldDeck === null ? [cardOne, cardTwo] : [...oldDeck, cardOne, cardTwo]));
    }

    function updateDeckCount() {
        if (computerDeck !== null && playerDeck !== null) {
            computerDeck.numberOfCards
            playerDeck.numberOfCards
        }
    }

    function isRoundWinner(cardOne, cardTwo) {
        console.log(cardOne, cardTwo)
        return CARD_VALUE_MAP[cardOne.value] > CARD_VALUE_MAP[cardTwo.value]
    }

    function isGameOver(deck) {
        return deck.numberOfCards === 0
    }

    function warRound() {
        const playerTribute = playerDeck.cards.slice(0, 3)
        const computerTribute = computerDeck.cards.slice(0,3)
    }

    return (
        <div className='war-board'>
            <div>
                <div>Computer</div>
                {computerDeck === null ? <div className='computer-deck deck'></div> : <div className='computer-deck deck'>{computerDeck.numberOfCards}</div>}
                {computerCardSlot === null ? 
                    <div className='computer-card-slot card-slot'></div> : 
                    <div className='computer-card-slot card-slot'>{computerCardSlot.value}{computerCardSlot.suit}</div>
                }
            </div>
            <div>
                <div className='text'>{text}</div>
                <button className='war-button' onClick={stop ? startGame : (inRound ? cleanBeforeRound : flipCards)}>
                    {stop ? 'Start Game' : (inRound ? 'Clear' : 'Flip Cards')}
                </button>
            </div>
            <div>
                <div>Player</div>
                {playerCardSlot === null ? 
                    <div className='player-card-slot card-slot'></div> : 
                    <div className='player-card-slot card-slot'>{playerCardSlot.value}{playerCardSlot.suit}</div>
                }
                {playerDeck === null ? <div className='player-deck deck'></div> : <div className='player-deck deck'>{playerDeck.numberOfCards}</div>}
            </div>
        </div>
    )
}

export default War