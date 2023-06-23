import { useRef, useState, useEffect } from 'react';
import './App.css';
import Deck from './deck.js';

function War() {
    const [playerDeck, setPlayerDeck] = useState()
    const [playerCardSlot, setPlayerCardSlot] = useState(null)
    const [computerDeck, setComputerDeck] = useState()
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
        if (war) {
            setText('War')
        } else {
            setText('')
        }

        updateDeckCount()
    }

    function flipCards() {
        setInRound(true)
        
        const playerCard = playerDeck.pop()
        const computerCard = computerDeck.pop()

        setPlayerCardSlot(playerCard);
        setComputerCardSlot(computerCard);

        updateDeckCount()
        
        if (isRoundWinner(playerCard, computerCard)) {
            setText('Win')
            setPlayerDeck((prevDeck) => {
                const newCards = [...prevDeck.cards, playerCard, computerCard]
                const updatedDeck = new Deck(newCards)
                return updatedDeck;
            });
        } else if (isRoundWinner(computerCard, playerCard)){
            setText("Lose");
            setComputerDeck((prevDeck) => {
                const newCards = [...prevDeck.cards, computerCard, playerCard]
                const updatedDeck = new Deck(newCards)
                return updatedDeck;
            });
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
        if (computerDeck !== undefined && playerDeck !== undefined) {
            computerDeck.numberOfCards
            playerDeck.numberOfCards
        }
    }

    function isRoundWinner(cardOne, cardTwo) {
        return CARD_VALUE_MAP[cardOne.value] > CARD_VALUE_MAP[cardTwo.value]
    }

    function isGameOver(deck) {
        return deck.numberOfCards === 0
    }

    function warRound() {
        setWar(true)
        // store the war causing card in the tribute pile
        // clear the board
        // pull 3 more cards to store in tribute pile // maybe individually 
            // check they still have one card that is flipable after tribute
            // if player doesn't have enough cards, play with the lesser amount
        // update deck count
        // flip cards
        // winner gets all tribute cards and flipped card 
            // clear tribute pile
        // if war again recursive call
    }

    return (
        <div className='war-board'>
            <div>
                <div>Computer</div>
                {computerDeck === undefined ? <div className='computer-deck deck'></div> : <div className='computer-deck deck'>{computerDeck.numberOfCards}</div>}
                {computerCardSlot === null ? 
                    <div className='computer-card-slot card-slot'></div> : 
                    <div className='computer-card-slot card-slot'>{computerCardSlot.value}{computerCardSlot.suit}</div>
                }
            </div>
            <div>
                <div className='text'>{text}</div>
                <button className='war-button' onClick={stop ? startGame : war ? warRound : (inRound ? cleanBeforeRound : flipCards)}>
                    {stop ? 'Start Game' : war ? 'War!' : (inRound ? 'Clear' : 'Flip Cards')}
                </button>
            </div>
            <div>
                <div>Player</div>
                {playerCardSlot === null ? 
                    <div className='player-card-slot card-slot'></div> : 
                    <div className='player-card-slot card-slot'>{playerCardSlot.value}{playerCardSlot.suit}</div>
                }
                {playerDeck === undefined ? <div className='player-deck deck'></div> : <div className='player-deck deck'>{playerDeck.numberOfCards}</div>}
            </div>
        </div>
    )
}

export default War