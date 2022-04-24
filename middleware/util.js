const draw = (deck) => {
    // select a card
    selectedIndex = Math.floor(Math.random() * deck.length)
    selectedCard = deck[selectedIndex];

    //remove from deck
    deck.splice(selectedIndex,1);

    return selectedCard
}

module.exports = {
    drawCard: draw
}