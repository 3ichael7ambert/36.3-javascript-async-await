document.addEventListener("DOMContentLoaded", () => {
    const cardContainer = document.getElementById("cardContainer");
    const dealButton = document.getElementById("dealButton");
    const holdButton = document.getElementById("holdButton");
    const resultText = document.getElementById("resultText");

    const cardValues = {
        "ACE": 1,
        "2": 2,
        "3": 3,
        "4": 4,
        "5": 5,
        "6": 6,
        "7": 7,
        "8": 8,
        "9": 9,
        "10": 10,
        "JACK": 11,
        "QUEEN": 12,
        "KING": 13,
    };

    let cards = [];

    dealButton.addEventListener("click", async () => {
        cardContainer.innerHTML = ""; // Clear previous cards
        cards = [];

        try {
            const response = await fetch("https://deckofcardsapi.com/api/deck/new/draw/?count=5");
            const data = await response.json();
            cards = data.cards;
            let cardSum = 0;

            cards.forEach((card, index) => {
                cardSum += cardValues[card.value] || 0;
                createCardElement(card.image, index + 1);
            });

            const factResponse = await fetch(`http://numbersapi.com/${cardSum}/trivia?json`);
            const factData = await factResponse.json();
            resultText.innerText = factData.text;
        } catch (error) {
            console.error("Error:", error);
        }

        // Enable the "Hold" button after dealing cards
        holdButton.removeAttribute("disabled");
    });

    holdButton.addEventListener("click", async () => {
        // Check if cards are already held
        if (cards.length === 0) {
            resultText.innerText = "You've already held the cards.";
            return;
        }

        try {
            const response = await fetch("https://deckofcardsapi.com/api/deck/new/draw/?count=" + cards.length);
            const data = await response.json();
            cards = data.cards;
            cardContainer.innerHTML = ""; // Clear previous cards

            cards.forEach((card, index) => {
                createCardElement(card.image, index + 1);
            });

            // Disable the "Hold" button after a redraw
            holdButton.setAttribute("disabled", "true");
        } catch (error) {
            console.error("Error:", error);
        }
    });

    cardContainer.addEventListener("click", (event) => {
        // If the "Hold" button is enabled and a card is clicked
        if (!holdButton.hasAttribute("disabled") && event.target.classList.contains("card")) {
            const cardNumber = parseInt(event.target.id.match(/\d+/)[0]);
            toggleCardHeld(cardNumber);
        }
    });

    function toggleCardHeld(cardNumber) {
        const cardElement = document.getElementById(`card${cardNumber}`);
        if (cardElement.classList.contains("held")) {
            cardElement.classList.remove("held");
        } else {
            cardElement.classList.add("held");
        }
    }

    function createCardElement(imageUrl, cardNumber) {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.style.backgroundImage = `url(${imageUrl})`;
        cardElement.setAttribute("id", `card${cardNumber}`);
        cardContainer.appendChild(cardElement);
    }
});
