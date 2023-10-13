document.addEventListener("DOMContentLoaded", () => {
    const numberForm = document.getElementById("number-form");
    const factsContainer = document.getElementById("facts-container"); // Updated to target the new div

    numberForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const favoriteNumber = document.getElementById("favorite-number").value;

        // Function to fetch a fact about a specific number from the Numbers API
        async function fetchNumberFact(number) {
            try {
                const response = await fetch(`http://numbersapi.com/${number}?json`);
                const data = await response.json();
                
                if (data.found) {
                    return data.text;
                } else {
                    throw new Error("Fact not found for the number " + number);
                }
            } catch (error) {
                throw error;
            }
        }

        // Fetch 4 facts about the favorite number
        const promises = [];
        for (let i = 0; i < 4; i++) {
            promises.push(fetchNumberFact(favoriteNumber));
        }

        try {
            const facts = await Promise.all(promises);

            // Clear previous facts
            factsContainer.innerHTML = "";

            // Display the facts
            facts.forEach(fact => {
                const factElement = document.createElement("p");
                factElement.textContent = fact;
                factsContainer.appendChild(factElement);
            });
        } catch (error) {
            console.error(error);
            factsContainer.innerHTML = "Error fetching facts.";
        }
    });
});
