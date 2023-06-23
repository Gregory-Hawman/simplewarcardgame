import { useRef, useState, useEffect } from 'react';
import './App.css';
import Deck from './deck.js';

function War() {
    const [playerDeck, setPlayerDeck] = useState()
    const [computerDeck, setComputerDeck] = useState()
    const [playerCardSlot, setPlayerCardSlot] = useState(null)
    const [computerCardSlot, setComputerCardSlot] = useState(null)
    const [playerWarTribute, setPlayerWarTribute] = useState([])
    const [computerWarTribute, setComputerWarTribute] = useState([])
    const [inRound, setInRound] = useState(false)
    const [stop, setStop] = useState(false)
    const [startWar, setStartWar] = useState(false)
    const [warRoundCount, setWarRoundCount] = useState(0)
    const [text, setText] = useState('')

    const deck = new Deck

    console.log('CWT', computerWarTribute)

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
        // deck.shuffle()

        const deckMidPoint = Math.ceil(deck.numberOfCards / 2)
        setPlayerDeck(new Deck(deck.cards.slice(0, deckMidPoint)))
        setComputerDeck(new Deck(deck.cards.slice(deckMidPoint, deck.numberOfCards)))
        setInRound(false),
        setStop(false)
        setStartWar(false)

        cleanBeforeRound()
    }

    function cleanBeforeRound() {
        setComputerCardSlot(null)
        setPlayerCardSlot(null)
        if (warRoundCount > 0) {
            setText('War')
        } else {
            setInRound(false)
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
            addCardsToDeck('player', playerCard, computerCard)

        } else if (isRoundWinner(computerCard, playerCard)){
            setText("Lose");
            addCardsToDeck('computer', computerCard, playerCard)

        } else {
            setText('War')
            setStartWar(true)
        }
        
        if (isGameOver(playerDeck)) {
            setText('You Lose!!!')
            setStop(true)

        } else if (isGameOver(computerDeck)) {
            setText('You Won!')
            setStop(true)
        }
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
        setStartWar(false)
        setWarRoundCount(warRoundCount + 1) // number of war boards if there is a need

        let playerTribute
        let computerTribute
        // check they still have one card that is flipable after tribute
        if (computerDeck.cards.length > 3 && playerDeck.cards.length > 3){
            playerTribute = playerDeck.cards.slice(0, 3);
            computerTribute = computerDeck.cards.slice(0, 3);
        } else if (computerDeck.cards.length === 3 && playerDeck.cards.length === 3){
            playerTribute = playerDeck.cards.slice(0, 2);
            computerTribute = computerDeck.cards.slice(0, 2);
        } else if (computerDeck.cards.length === 2 && playerDeck.cards.length === 2){
            playerTribute = playerDeck.cards.slice(0, 1);
            computerTribute = computerDeck.cards.slice(0, 1);
        } else {

        }
        console.log(computerTribute)

        // store the war causing card in the tribute pile face up
        addCardSlotToTribute(playerCardSlot, computerCardSlot)

        // clear the board
        cleanBeforeRound()

            for (let i = 0; i < computerTribute.length; i++){
                addTributeCards('computer', computerTribute[i])
            }
            for (let i = 0; i < playerTribute.length; i++ ){
                addTributeCards('player', playerTribute[i])
            }

        // pull 3 more cards to store in tribute pile // maybe individually 
            // if player doesn't have enough cards, play with the lesser amount
        // update deck count
        // flip cards
        // winner gets all tribute cards and flipped card 
            // clear tribute pile
            // setWar(false)
            // clearBeforeRound
        // if war again recursive call
    }

    function getTributeCards (cards) {
        for (let i=1; i < cards.lenght; i++) {
            return (
                <div className='face-down-tribute'>
                    {cards.value}{cards.suit}
                </div>
            )
        }
    }

    function addCardSlotToTribute (playerCard, computerCard) {
        setPlayerWarTribute((prevWarTribute) => [...prevWarTribute, playerCard])
        setComputerWarTribute((prevWarTribute) => [...prevWarTribute, computerCard])
    }

    function addTributeCards (type, ...cards) {
        if (type === 'player'){
            setPlayerWarTribute((prevWarTribute) => [...prevWarTribute, ...cards])
        } else if (type === 'computer') {
            setComputerWarTribute((prevWarTribute) => [...prevWarTribute, ...cards])
        }
    }

    function facedownTributeCards() {

    }

    return (
        <div>
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
            {warRoundCount > 0 ? 
                <div className='war-tribute-board'>
                    <div className='face-up-tribute tribute-card-slot'>
                        {computerWarTribute[0].value} {computerWarTribute[0].suit}
                    </div>
                    <div>

                    </div>
                </div> : null
            }
         
            <div>
                <div className='text'>{text}</div>
                {startWar ? 
                    <button className='war-button' onClick={startWar ? warRound : null}>Start War!</button> : 
                    <button className='war-button' onClick={stop ? startGame : (inRound ? cleanBeforeRound : flipCards)}>
                        {stop ? 'Start Game' : (inRound ? 'Clear' : 'Flip Cards')}
                    </button>
                }
            </div>

            {warRoundCount > 0 ? 
                <div className='war-tribute-board'>
                    <div className='face-up-tribute tribute-card-slot'>
                        {playerWarTribute[0].value} {playerWarTribute[0].suit}
                    </div>
                    <div>

                    </div>
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