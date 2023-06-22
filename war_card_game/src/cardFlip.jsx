import { useRef, useState, useEffect } from 'react';
import Deck from './deck';

function CardFlip () {
    const [topCard, setTopCard] = useState(null)
    const [deck, setDeck] = useState(null);
    const [reset, setReset] = useState(false)

    useEffect(() => {
        const newDeck = new Deck();
        newDeck.shuffle();
        setDeck(newDeck);
        setTopCard(null)
    }, [reset]);

    function flipTopDeckCard() {
        setTopCard(deck.pop())
    }
    
    console.log(topCard)

    return (
        <>
           <div>
            {deck && deck.numberOfCards === 0 ? 
                <div>
                    <div>Out of Cards</div>
                    <button onClick={() => setReset(!reset)}>Reset</button>
                </div> 
                :  
                <div className="flip-board">
                    <div>
                        <div className="deck" onClick={() => flipTopDeckCard()}>Deck</div>
                        <div>{deck && deck.numberOfCards}</div>
                    </div>
                    {topCard === null ? 
                        <div className='card-slot'></div> 
                        : 
                        <div className={`card-slot ${topCard.color}`}>
                            {topCard === null ? null : topCard.value}
                            {topCard === null ? null : topCard.suit}
                        </div>
                    }
            </div>}
           </div>
        </>
    )
}

export default CardFlip