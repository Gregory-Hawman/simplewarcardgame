import { useRef, useState, useEffect } from 'react';
import './App.css';
import Deck from './deck.js';
import { ACE_HIGH_CARD_VALUE_MAP } from './vars';

function War() {
    // player displayed states
    const [playerDeck, setPlayerDeck] = useState()
    const [playerCardSlot, setPlayerCardSlot] = useState(null)
    const [playerWarTribute, setPlayerWarTribute] = useState(new Deck([]))

    // computer displayed states
    const [computerDeck, setComputerDeck] = useState()
    const [computerCardSlot, setComputerCardSlot] = useState(null)
    const [computerWarTribute, setComputerWarTribute] = useState(new Deck([]))

    //other displayed states
    const [text, setText] = useState('')

    // condition states
    const [inRound, setInRound] = useState(false)
    const [stopGame, setStopGame] = useState(false)
    const [tributeSize, setTributeSize] = useState(null)

    //trigger states
    const [startNewWar, setStartNewWar] = useState(false)
    const [warCount, setWarCount] = useState(0)
    const [warSwitch, setWarSwitch] = useState(false)
    const [checkingWinner, setCheckingWinner] = useState(false)


    const deck = new Deck()

    useEffect(() => {
        startGame(); // Call startGame function when the component is mounted
    }, []);

    useEffect(() => {
        // only add cards to the tribute decks once the tribute size has been set
        if(warCount > 0){
            for (let i = 0; i < tributeSize; i++){
                const playerCard = playerDeck.pop()
                const computerCard = computerDeck.pop()
                addCardsToDeck('playerTribute', playerCard)
                addCardsToDeck('computerTribute', computerCard)

                // changing the amount of cards in the main decks so update the count
                updateDeckCount()
            }
        }
    // warSwitch instead of tribute size because war may be called twice in a row with the same tribute size, so gettting the tribute size will just always flip the warSwitch as well, thus triggering here
    }, [warSwitch])

    useEffect(() => {
        if (warCount > 0) {
            if (playerCardSlot !== null && computerCardSlot !== null){
                if (isRoundWinner(playerCardSlot, computerCardSlot)) {
                    setText('You Win the War')
                    addCardsToDeck('player', playerCardSlot, computerCardSlot, ...playerWarTribute.cards, ...computerWarTribute.cards)
                } else if (isRoundWinner(computerCardSlot, playerCardSlot)){
                    setText("You Lose the War");
                    addCardsToDeck('computer', computerCardSlot, playerCardSlot, ...computerWarTribute.cards, ...playerWarTribute.cards)
                } else {
                    setText('War Again')
                    setStartNewWar(true)
                }
            }
        } else {
            if (playerCardSlot !== null && computerCardSlot !== null){
                if (isRoundWinner(playerCardSlot, computerCardSlot)) {
                    setText('You Win')
                    addCardsToDeck('player', playerCardSlot, computerCardSlot)
        
                } else if (isRoundWinner(computerCardSlot, playerCardSlot)){
                    setText("You Lose");
                    addCardsToDeck('computer', computerCardSlot, playerCardSlot)
        
                } else {
                    setText('War')
                    setStartNewWar(true)
                }
            }
        }
    }, [checkingWinner])

    function startGame() {
        // shuffle the cards
        deck.shuffle()

        // split the deck in half and give one to each player
        const deckMidPoint = Math.ceil(deck.numberOfCards / 2)
        setPlayerDeck(new Deck(deck.cards.slice(0, deckMidPoint)))
        setComputerDeck(new Deck(deck.cards.slice(deckMidPoint, deck.numberOfCards)))

        // set the game to default status. mostly for playing again once the last game is over.
        setInRound(false),
        setStopGame(false)
        setStartNewWar(false)
        cleanBeforeRound()
    }

    function cleanBeforeRound() {
        // clear the last flipped cards out
        setComputerCardSlot(null)
        setPlayerCardSlot(null)

        // if we are in a war warCount will be > 0, if we don't get a second war, war count will still be > 0 but will have to be reset
        if (warCount > 0 && startNewWar === false) {
            setPlayerWarTribute(new Deck([]))
            setComputerWarTribute(new Deck([]))
            setWarCount(0)
            setInRound(false)
            setText('')
            setTributeSize(null)
        } else {
            setInRound(false)
            setText('')
        }
    }

    function updateDeckCount() {
        // as long as both the players deck and the computers deck have been delt cards, count the cards
        if (computerDeck !== undefined && playerDeck !== undefined) {
            computerDeck.numberOfCards
            playerDeck.numberOfCards
        }
    }

    function isGameOver(deck) {
        return deck.numberOfCards === 0
    }

    function flipCards() {
        // fliping the top deck card into the respective card slot

        let playerCard
        let computerCard

        // if we have gotten here and the player has no cards left in their deck, it should mean there is an ongoing warPhase and the player needs to keep playing with the last card flipped
        if (playerDeck.numberOfCards === 0 && startNewWar === true){
            playerCard = playerCardSlot
        } else if (computerDeck.numberOfCards === 0 && startNewWar === true) {
            computerCard = computerCardSlot
        } else {
            playerCard = playerDeck.pop()
            computerCard = computerDeck.pop()
        }
        
        setPlayerCardSlot(playerCard);
        setComputerCardSlot(computerCard);
        updateDeckCount()
    }

    function isRoundWinner(cardOne, cardTwo) {
        return ACE_HIGH_CARD_VALUE_MAP[cardOne.value] > ACE_HIGH_CARD_VALUE_MAP[cardTwo.value]
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

    // war phase is just adding the extra cards up for grabs
    function warPhase() {
        // War has started already.
        setStartNewWar(false)

        // store the war causing card in the tribute deck
        if (playerDeck.numberOfCards === 0){
            // if the players deck is empty after the flip and it caused a war phase only move the computer card to their tribute
            addCardsToDeck('computerTribute', computerCardSlot)
        } else if (computerDeck.numberOfCards === 0){
            addCardsToDeck('playerTribute', playerCardSlot)
        } else {
            addCardsToDeck('playerTribute', playerCardSlot)
            addCardsToDeck('computerTribute', computerCardSlot)
        }

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
        
        // The warSwitch state change triggers the useEffect for loop at the top to add cards to the to the respective warTributeDecks.
        setWarSwitch(!warSwitch)
    }


    function fullRound() {
        // we are now in a round
        setInRound(true)

        // can we keep playing
        // do the players deck and computer deck both have cards left? then do nothing.
        if(playerDeck && computerDeck){
            // if we are not currently in a war phase
            if (warCount === 0){
                // check if the player has lost
                if (isGameOver(playerDeck)) {
                    setText('You Lose!!!')
                    setStopGame(true)
                // check if the computer has lost
                } else if (isGameOver(computerDeck)) {
                    setText('You Won!')
                    setStopGame(true)    
                }
            }
        }

        // extra phase if we have a war happening, get all the tribute cards set up
        if (warCount > 0){
            warPhase()
        }

        // happens everyround 
        flipCards()

        // find the winner of the Round, triggers a state change that should let the state for card slots update before checking the winner, which uses a state to decide
        setCheckingWinner(!checkingWinner)
    }

    // start game
    // start a round
        // clear the board before a round
        // check if each player has enough to deck cards to play
        // is a war happening?
            // yes? 
            // war round
        // check round winner
        // add cards to deck
        // update deck count
        // end round

    return (
        <div>
            {/* Is the game over? display this */}
            {stopGame ? 
                <div>
                    {text}
                    <button onClick={startGame}>Play Again?</button> 
                </div> : 
                <div>
                {/* Is the game still going ? display this */}

                    {/* Computer Deck and Flipped Card */}
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
                    
                    {/* Computer Tribute cards as long as we are in a war phase and we've added cards to the tribute decks */}
                    {warCount > 0 && computerWarTribute !== undefined? 
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
                        {startNewWar ? 
                            <button 
                                className='war-button' 
                                onClick={fullRound}
                            > 
                                Start War!
                            </button> : 
                            <button 
                                className='war-button' 
                                onClick={warCount > 1 ? 
                                    fullRound : 
                                    inRound ? 
                                        cleanBeforeRound : 
                                        fullRound
                                }
                            >
                                {warCount > 1 ? 'Flip Cards' : inRound ? 'Clear' : 'Flip Cards'}
                            </button>
                        }
                    </div>

                    {/* Player War Tribute Deck */}
                    {warCount > 0 && playerWarTribute !== undefined? 
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
            }
        </div>
    )
}

export default War