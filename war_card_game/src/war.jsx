import { useRef, useState, useEffect } from 'react';
import './App.css';
import Deck from './deck.js';

function War() {
    const [playerDeck, setPlayerDeck] = useState([])
    const [computerDeck, setComputerDeck] = useState([])
    const [inRound, setInRound] = useState(false)
    const [stop, setStop] = useState(false)
    const [war, setWar] = useState(false)
    const [text, setText] = useState('')

    let deck = new Deck
    console.log(deck.cards.slice(0,3))

    useEffect(() => {
        startGame(); // Call startGame function when the component is mounted
    }, []);

    console.log(playerDeck)

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

    const computerCardSlot = useRef(null);
    console.log(computerCardSlot)

    const computerDeckElement = useRef(null);
    const playerCardSlot = useRef(null);
    const playerDeckElement = useRef(null);

    function startGame() {
        const deck = new Deck();
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
        computerCardSlot.innerHTML = ''
        playerCardSlot.innerHTML = ''
        setText('')

        updateDeckCount()
    }

    function flipCards() {
        setInRound(true)

        const updatedPlayerDeck = [...playerDeck];
        const updatedComputerDeck = [...computerDeck];

        const playerCard = playerDeck.pop()
        const computerCard = computerDeck.pop()

        playerCardSlot.current.innerHTML = getCardHTML(playerCard);
        computerCardSlot.current.innerHTML = getCardHTML(computerCard);

        updateDeckCount()

        if (isRoundWinner(playerCard, computerCard)) {
            setText('Win')
            updatedPlayerDeck.push(playerCard, computerCard);
            setPlayerDeck(updatedPlayerDeck);
            setComputerDeck(updatedComputerDeck);
        } else if (isRoundWinner(computerCard, playerCard)){
            setText("Lose");
            updatedComputerDeck.push(computerCard, playerCard);
            setPlayerDeck(updatedPlayerDeck);
            setComputerDeck(updatedComputerDeck);
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

    function updateDeckCount() {
        computerDeckElement.current.innerText = computerDeck.numberOfCards
        playerDeckElement.current.innerText = playerDeck.numberOfCards
    }

    function isRoundWinner(cardOne, cardTwo) {
        return CARD_VALUE_MAP[cardOne.value] > CARD_VALUE_MAP[cardTwo.value]
    }

    function isGameOver(deck) {
        return deck.numberOfCards === 0
    }

    function warRound() {
        const playerTribute = playerDeck.cards.slice(0, 3)
        const computerTribute = computerDeck.cards.slice(0,3)
    }

    const getCardHTML = (card) => {
        return (
        <div className={`card ${card.color}`}>
            {card.suit}
        </div>
        );
    };

    return (
        <>
            <div className='computer-deck deck' ref={computerDeckElement}></div>
            <div className='computer-card-slot card slot' ref={computerCardSlot}></div>
            <div className='text'>{text}</div>
            <div className='player-deck deck' ref={playerDeckElement}></div>
            <div className='player-card-slot card-slot' ref={playerCardSlot}></div>
            <button onClick={stop ? startGame : (inRound ? cleanBeforeRound : flipCards)}>
                {stop ? 'Start Game' : (inRound ? 'Clean Before Round' : 'Flip Cards')}
            </button>
            <div className='box'>hi</div>
        </>
    )
}

export default War