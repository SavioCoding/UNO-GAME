## UNO GAME

run node app on directory uno-game and call localhost:3000 if running on local
### Game instructions
Your goal is to get rid of all your cards as soon as possible
You can only play cards that have the same color or number as the top card in the discard pile, unless you want to play a black card. Then, you can play it any time you like
You can draw a card during your turn if you cannot or don't want to play your cards
Each player has one and a half minutes to use. The timer starts when it is your turn, and stops when it is your opponent's turn
You lose if your timer runs out first. So, think fast!
After you play your second-to-last card, a red and yellow UNO button appears for you; and
a black and white "U,NO!" button appears for your opponent
If you click your button first, you are save. If your opponent clicked his/her button first, you will get two more cards!
You win if you get rid of all your cards first
You can also cheat by pressing <kbd>Space</kbd>. It makes your opponent's timer go faster😈
You get 0 points if you lose. If you win, the points you get is the number of cards left in your opponent's hand


This is a two-player UNO Game using HTML, CSS, Javascript to build the frontend and Node.js to build the backend. Technologies like web socket is used here to have interactive communication between server and client.

There is a user authenication system at the beginning. Session cookies are used to keep track of the sessions of the users
<img width="1247" alt="Screenshot 2022-09-07 at 11 39 08 PM" src="https://user-images.githubusercontent.com/42139114/188995879-805a9b7a-78f5-4e08-ae00-0cdf34a46ce7.png">

Each player can only see its own card and number of cards with their components, there is a timer for each of the player. If time runs out, you lose! If cards used up, you win!
<img width="1368" alt="Screenshot 2022-09-08 at 12 13 27 AM" src="https://user-images.githubusercontent.com/42139114/188999139-11784e7d-1a33-42e4-8f68-dab4ec3f7b06.png">

User can change the theme of the color if they draw a change color card
<img width="1368" alt="Screenshot 2022-09-08 at 12 15 56 AM" src="https://user-images.githubusercontent.com/42139114/188999524-1bb8b96c-772c-4594-aba8-b8c935ded2ce.png">

If one player has a UNO card left, a UNO button will poped up for both users, if the player that has one card left press the button faster than the other player, nothing will happen. If he press slower than the other player, he will get two more cards
<img width="1368" alt="Screenshot 2022-09-08 at 12 16 05 AM" src="https://user-images.githubusercontent.com/42139114/189000488-ce1fe05f-4df1-4e8f-8e09-54bab5d41426.png">

A scoreboard will be poped after the game ends
<img width="1368" alt="Screenshot 2022-09-08 at 12 15 23 AM" src="https://user-images.githubusercontent.com/42139114/189000796-740c4992-f6e8-4fbc-becb-ad00187564b0.png">









