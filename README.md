# comp4021-project

## Fontend Todo

## Backend Todo

### Varaibles

-   `ActivePlayer`: the player in the current turn
-   `topCard`: the top card of the discard pile
-   `userDeck`: a JS object:

```JS
{
    username1: [card1, card2, etc],
    username2: [card1, card2, etc]
}
```

-   `timer`

### Functions

-   matching
    -   if a user is the first one to start game, wait until another user enters
    -   if a user is the second one to start game, start the game
-   start
    -   Initialize a UNO game
-   draw
    -   randomly give a card to the player who draws
-   select_card
-   check
-   cheat:
    -   pressing spacebar will change one card to a +4
-   end:
    -   conditions:
        -   a player loses if he/she has too many cards
        -   end game if timer == 0; player with more cards loses
        -   a player wins if he/she has no more cards

### Data (JSON)

-   user.json
    -   username
    -   score
    -   rank
-   all cards
