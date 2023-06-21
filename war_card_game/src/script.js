import Deck from './deck.js';

let deck = new Deck
console.log(deck.cards.slice(0,3))

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

const computerCardSlot = document.querySelector('.computer-card-slot');
const computerDeckElement = document.querySelector('.computer-deck')
const playerCardSlot = document.querySelector('.player-card-slot');
const playerDeckElement = document.querySelector('.player-deck')
const text = document.querySelector('.text')

let playerDeck, computerDeck, inRound, stop, war

document.addEventListener('click', () => {
    if (stop) {
        startGame()
        return
    }

    if (inRound) {
        cleanBeforeRound()
    } else {
        flipCards()
    }
})

startGame()
function startGame() {
    const deck = new Deck();
    deck.shuffle()


    const deckMidPoint = Math.ceil(deck.numberOfCards / 2)
    playerDeck = new Deck(deck.cards.slice(0, deckMidPoint))
    computerDeck = new Deck(deck.cards.slice(deckMidPoint, deck.numberOfCards))
    inRound = false,
    stop = false
    war = false

    cleanBeforeRound()
}

function cleanBeforeRound() {
    inRound = false
    computerCardSlot.innerHTML = ''
    playerCardSlot.innerHTML = ''
    text.innerHTML = ''

    updateDeckCount()
}

function flipCards() {
    inRound = true

    const playerCard = playerDeck.pop()
    const computerCard = computerDeck.pop()

    playerCardSlot.appendChild(playerCard.getHTML())
    computerCardSlot.appendChild(computerCard.getHTML())

    updateDeckCount()

    if (isRoundWinner(playerCard, computerCard)) {
        text.innerText = 'Win'
        playerDeck.push(playerCard)
        playerDeck.push(computerCard)
    } else if (isRoundWinner(computerCard, playerCard)){
        text.innerText = 'Lose'
        computerDeck.push(computerCard)
        computerDeck.push(playerCard)
    } else {
        text.innerText = 'War'
        warRound()
        
    }

    if (isGameOver(playerDeck)) {
        text.innerText = 'You Lose!!!'
        stop = true
    } else if (isGameOver(computerDeck)) {
        text.innerText = 'You Won!'
        stop = true
    }
}

function updateDeckCount() {
    computerDeckElement.innerText = computerDeck.numberOfCards
    playerDeckElement.innerText = playerDeck.numberOfCards
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