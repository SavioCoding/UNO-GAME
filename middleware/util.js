const draw = (deck) => {
    // select a card
    selectedIndex = Math.floor(Math.random() * deck.length)
    selectedCard = deck[selectedIndex];

    //remove from deck
    deck.splice(selectedIndex,1);

    return selectedCard
}

const filterById = (cards, id) => {
    newCards = []
    for (let i=0;i<cards.length;i++){
        if(cards[i]["id"] !== id){
            newCards.push(cards[i])
        }
    }
    return newCards
}

const getCardById = (cards, id) => {
    for (let i=0;i<cards.length;i++){
        if(cards[i]["id"] === id){
            return cards[i]
        }
    }
    return null
}


module.exports = {
    drawCard: draw,
    filterById : filterById,
    getCardById : getCardById
}