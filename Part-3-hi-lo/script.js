const cardDisplay = document.getElementById('cardDisplay');
const drawCardButton = document.getElementById('drawCardButton');
let deckId = null;

// Function to shuffle a new deck and set the deckId
async function shuffleNewDeck() {
    try {
        const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
        const data = await response.json();
        deckId = data.deck_id;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to draw a card from the deck
async function drawCard() {
    if (deckId) {
        try {
            const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
            const data = await response.json();

            if (data.cards.length > 0) {
                const card = data.cards[0];
                const imageUrl = card.image;
                cardDisplay.src = imageUrl;
                cardDisplay.style.setProperty('--rotation', `${getRandomRotation()}deg`);
            } else {
                cardDisplay.src = '';
            }
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        cardDisplay.src = '';
        alert("Please shuffle a new deck first.");
    }
}

function getRandomRotation() {
    return Math.random() * 70 - 35;
}

async function init() {
    await shuffleNewDeck();
    drawCardButton.addEventListener('click', drawCard);
}

init();
