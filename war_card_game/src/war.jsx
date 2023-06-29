import { useRef, useState, useEffect } from 'react';
import './App.css';
import Deck from './deck.js';

function War() {
    const [playerDeck, setPlayerDeck] = useState()
    const [playerCardSlot, setPlayerCardSlot] = useState(null)
    const [playerWarTribute, setPlayerWarTribute] = useState(new Deck([]))

    const [computerDeck, setComputerDeck] = useState()
    const [computerCardSlot, setComputerCardSlot] = useState(null)
    const [computerWarTribute, setComputerWarTribute] = useState(new Deck([]))

    const [inRound, setInRound] = useState(false)
    const [stopGame, setStopGame] = useState(false)

    const [startWar, setStartWar] = useState(false)
    const [warRoundCount, setWarRoundCount] = useState(0)
    const [tributeSize, setTributeSize] = useState(3)

    const [text, setText] = useState('')

    const deck = new Deck()

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
        setStopGame(false)
        setStartWar(false)

        cleanBeforeRound()
    }

    function cleanBeforeRound() {
        setComputerCardSlot(null)
        setPlayerCardSlot(null)
        if (warRoundCount > 0) {
            setText('War')
        } else if (warRoundCount > 0 && startWar === false) {
            setPlayerWarTribute(new Deck([]))
            setComputerWarTribute(new Deck([]))
            setWarRoundCount(0)
        } else {
            setInRound(false)
            setText('')
        }

        updateDeckCount()
    }

    function updateDeckCount() {
        if (computerDeck !== undefined && playerDeck !== undefined) {
            computerDeck.numberOfCards
            playerDeck.numberOfCards
        }
    }

    function isGameOver(deck) {
        return deck.numberOfCards === 0
    }

    function flipCards() {
        setInRound(true)
        
        const playerCard = playerDeck.pop()
        const computerCard = computerDeck.pop()

        setPlayerCardSlot(playerCard);
        setComputerCardSlot(computerCard);

        updateDeckCount()

        if (warRoundCount > 0) {
            if (isRoundWinner(playerCard, computerCard)) {
                setText('You Win the War')
                addCardsToDeck('player', playerCard, computerCard, playerWarTribute, computerWarTribute)
            } else if (isRoundWinner(computerCard, playerCard)){
                setText("You Lose the War");
                addCardsToDeck('computer', computerCard, playerCard, computerWarTribute, playerWarTribute)
            } else {
                setText('War Again')
                setStartWar(true)
            }
        } else {
            if (isRoundWinner(playerCard, computerCard)) {
                setText('You Win')
                addCardsToDeck('player', playerCard, computerCard)
    
            } else if (isRoundWinner(computerCard, playerCard)){
                setText("You Lose");
                addCardsToDeck('computer', computerCard, playerCard)
    
            } else {
                setText('War')
                setStartWar(true)
            }
        }
        
        
        if (isGameOver(playerDeck)) {
            setText('You Lose!!!')
            setStopGame(true)

        } else if (isGameOver(computerDeck)) {
            setText('You Won!')
            setStopGame(true)
        }
    }

    function isRoundWinner(cardOne, cardTwo) {
        return CARD_VALUE_MAP[cardOne.value] > CARD_VALUE_MAP[cardTwo.value]
    }

    function addCardsToDeck (deckType, ...cards) {
        if (deckType === 'player') {
            setPlayerDeck((prevDeck) => {
                const newCards = [...prevDeck.cards, ...cards]
                const updatedDeck = new Deck(newCards)
                return updatedDeck;
            });
        } else if (deckType === 'computer') {
            setComputerDeck((prevDeck) => {
                const newCards = [...prevDeck.cards, ...cards]
                const updatedDeck = new Deck(newCards)
                return updatedDeck;
            });
        } else if (deckType === 'playerTribute') {
            setPlayerWarTribute((prevDeck) => {
                const newCards = [...prevDeck.cards, ...cards]
                const updatedDeck = new Deck(newCards)
                return updatedDeck;
            })
        } else if (deckType === 'computerTribute') {
            setComputerWarTribute((prevDeck) => {
                const newCards = [...prevDeck.cards, ...cards]
                const updatedDeck = new Deck(newCards)
                return updatedDeck;
            })
        }
    }

    function warRound() {
        setInRound(true)
        setStartWar(false)
        setWarRoundCount(warRoundCount + 1)

        // store the war causing card in the tribute pile face up
        addCardsToDeck('playerTribute', playerCardSlot)
        addCardsToDeck('computerTribute', computerCardSlot)

        // check they still have one card that is flipable after tribute
        if (computerDeck.numberOfCards > 3 && playerDeck.numberOfCards > 3) {
            setTributeSize(3)
        } else if (computerDeck.numberOfCards === 3 || playerDeck.numberOfCards === 3) {
            setTributeSize(2)
        } else if (computerDeck.numberOfCards === 2 || playerDeck.numberOfCards === 2) {
            setTributeSize(1)
        } else {
            setTributeSize(0)
        }

        for (let i = 0; i < tributeSize; i++){
            const playerCard = playerDeck.pop()
            const computerCard = computerDeck.pop()
            addCardsToDeck('playerTribute', playerCard)
            addCardsToDeck('computerTribute', computerCard)
            updateDeckCount()
        }

        // clear the board
        cleanBeforeRound()
        updateDeckCount()
    }

    return (
        <div>
            {/* Computer Deck and Drawn Card */}
            <div  className='flex'>
                <div>
                    <div>Computer</div>
                    {computerDeck === undefined ? <div className='computer-deck deck'></div> : <div className='computer-deck deck'>{computerDeck.numberOfCards}</div>}
                </div> 
                {computerCardSlot === null ? 
                    <div className='computer-card-slot card-slot'></div> : 
                    <div className='computer-card-slot card-slot'>{computerCardSlot.value}{computerCardSlot.suit}</div>
                }
            </div>
            
            {/* Computer card that started the war and tribute cards */}
            {warRoundCount > 0 && computerWarTribute !== undefined? 
                <div className='war-tribute-board'>
                    {computerWarTribute.cards.map((card, i) => {
                        return (
                            <div className='face-up-tribute tribute-card-slot' key={i}>
                                {card.value} {card.suit}
                            </div>
                        )
                    })}
                </div> : null
            }
         
            {/* Text and Button */}
            <div>
                <div className='text'>{text}</div>
                {startWar ? 
                    <button className='war-button' onClick={warRound}>Start War!</button> : 
                    <button className='war-button' onClick={inRound ? cleanBeforeRound : flipCards}>
                        {inRound ? 'Clear' : 'Flip Cards'}
                    </button>
                }
            </div>

            {warRoundCount > 0 && playerWarTribute !== undefined? 
                <div className='war-tribute-board'>
                    {playerWarTribute.cards.map((card, i) => {
                        return (
                            <div className='face-up-tribute tribute-card-slot' key={i}>
                                {card.value} {card.suit}
                            </div>
                        )
                    })}
                </div> : null
            }

            <div className='flex'>
                <div>
                    <div>Player</div>
                    {playerDeck === undefined ? <div className='player-deck deck'></div> : <div className='player-deck deck'>{playerDeck.numberOfCards}</div>}
                </div>
                {playerCardSlot === null ? 
                    <div className='player-card-slot card-slot'></div> : 
                    <div className='player-card-slot card-slot'>{playerCardSlot.value}{playerCardSlot.suit}</div>
                }
            </div>
        </div>
    )
}

export default War