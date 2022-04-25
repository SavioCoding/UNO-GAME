## script to generate cards.json
import json
decks = []
id = 0
for i in range(8):
    color = "red"
    if i%4 == 0:
        color = "red"
    elif i%4 == 1:
        color = "yellow"
    elif i%4 == 2:
        color = "green"
    elif i%4 == 3:
        color = "blue"
    for j in range(14):
        if j==0 and i>3:
            continue
        card = {}
        card['id'] = id
        if j<10:
            card['number'] = j
            card['special'] = None
            card['color'] = color
        elif j==10:
            card['number'] = None
            card['special'] = "Ban"
            card['color'] = color
        elif j==11:
            card['number'] = None
            card['special'] = "Swap"
            card['color'] = color
        elif j==12:
            card['number'] = None
            card['special'] = "Add two"
            card['color'] = color
        elif j==13:
            card['color'] = None
            card['number'] = None
            if i<4:
                card['special'] = "Change color"
            else:
                card['special'] = "Add 4"
        decks.append(card)
        id += 1

with open("./data/cards.json", "w") as outfile:
    json.dump(decks,outfile)