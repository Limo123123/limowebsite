let currentUser  = null;
let currentPokeCoins = 0; // Variable für PokeCoins
let serverUrl = 'https://poke.slimo.v6.rocks/'; // Erster Server
const fallbackUrl = 'http://lock-signing.gl.at.ply.gg:5578/'; // Zweiter Server

document.getElementById('startBattleBtn').addEventListener('click', startBattle);

// Funktion zur Überprüfung der Serververfügbarkeit
async function checkServer(url) {
    try {
        const response = await fetch(`${url}cards/all`, { method: 'GET' });
        return response.ok || response.status === 404; // Server ist online, auch bei 404
    } catch (error) {
        return false;
    }
}

// Funktion zur Festlegung der Server-URL
async function setServerUrl() {
    if (await checkServer(serverUrl)) {
        console.log(`Verwende Server: ${serverUrl}`);
        return serverUrl;
    } else if (await checkServer(fallbackUrl)) {
        console.log(`Verwende Fallback-Server: ${fallbackUrl}`);
        return fallbackUrl;
    } else {
        alert("Beide Server sind nicht verfügbar. Bitte überprüfen Sie Ihre Internetverbindung oder versuchen Sie es später erneut.");
        throw new Error("Kein Server verfügbar");
    }
}

// Initialisiere die Server-URL
setServerUrl().then(url => {
    serverUrl = url;
});

// Funktion zum Anzeigen der gewählten Kategorie
function showSection(sectionId) {
    const sections = ['loginSection', 'registerSection', 'cards', 'myCards', 'store', 'battle'];
    sections.forEach(section => {
        document.getElementById(section).style.display = section === sectionId ? 'block' : 'none';
    });
}

// Event Listener für das Login-Formular
document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;

    const response = await fetch(`${serverUrl}login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
    });

    const data = await response.json();
    if (response.ok) {
        currentUser  = username;
        currentPokeCoins = data.user.pokeCoins; // Setze die PokeCoins
        document.getElementById('currentUser ').innerText = `Willkommen, ${currentUser }`;
        displayPokeCoins(); // Zeige die PokeCoins an
        document.getElementById('userInfo').style.display = 'block'; // Zeige die Benutzerinfo an
        showSection('cards'); // Zeige die Karten an
        document.getElementById('cardsLink').style.display = 'inline';
        document.getElementById('myCardsLink').style.display = 'inline';
        document.getElementById('storeLink').style.display = 'inline';
        document.getElementById('battleLink').style.display = 'inline';
        document.getElementById('logoutBtn').style.display = 'inline';
        fetchMyCards();
        fetchAllCards();
    } else {
        alert(data.message);
    }
});

// Event Listener für das Registrierungsformular
document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('registerUsername').value;

    const response = await fetch(`${serverUrl}register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
    });

    const data = await response.json();
    if (response.ok) {
        alert(data.message);
        document.getElementById('registerSection').style.display = 'none';
        document.getElementById('loginSection').style.display = 'block'; // Zeige das Login-Formular an
    } else {
        alert(data.message);
    }
});

// Logout-Event Listener
document.getElementById('logoutBtn').addEventListener('click', () => {
    currentUser   = null;
    currentPokeCoins = 0; // Setze PokeCoins zurück
    document.getElementById('userInfo').style.display = 'none'; // Verstecke die Benutzerinfo
    showSection('loginSection'); // Zeige das Login-Formular an
    document.getElementById('cardsLink').style.display = 'none';
    document.getElementById('myCardsLink').style.display = 'none';
    document.getElementById('storeLink').style.display = 'none';
    document.getElementById('battleLink').style.display = 'none';
    document.getElementById('cards').style.display = 'none';
    document.getElementById('myCards').style.display = 'none';
    document.getElementById('store').style.display = 'none';
    document.getElementById('battle').style.display = 'none';
});

// Funktion zum Abrufen aller Karten
async function fetchAllCards() {
    const response = await fetch(`${serverUrl}cards/all`);
    const data = await response.json();
    const allCardsDiv = document.getElementById('allCards');
    allCardsDiv.innerHTML = '';
    data.cards.forEach(card => {
        allCardsDiv.innerHTML += `<div class="card">
            <img src="${card.packImage}" alt="${card.name}" />
            <h3>${card.name}</h3>
            <p>Angriff: ${card.attack}</p>
            <p>Leben: ${card.health}</p>
            <p>Seltenheit: ${card.rarity}</p>
        </div>`;
    });
}

// Funktion zum Abrufen der eigenen Karten
async function fetchMyCards() {
    const response = await fetch(`${serverUrl}cards/${currentUser}`);
    const data = await response.json();
    const myCardsListDiv = document.getElementById('myCardsList');
    myCardsListDiv.innerHTML = '';
    console.log("API Response:", data);

    // Prüfen, ob `data.cards` existiert
    if (!data.cards || data.cards.length === 0) {
        myCardsListDiv.innerHTML = '<p>Du hast keine Karten.</p>';
        return;
    }

    // Null-Werte herausfiltern
    const validCards = data.cards.filter(card => card !== null);

    if (validCards.length === 0) {
        myCardsListDiv.innerHTML = '<p>Keine gültigen Karten gefunden.</p>';
        return;
    }

    validCards.forEach(card => {
        console.log("Verarbeite Karte:", card);

        // Überprüfen, ob `packImage` existiert, sonst Platzhalter setzen
        const imageSrc = card.packImage ?? 'default_image.png';

        myCardsListDiv.innerHTML += `
            <div class="card">
                <img src="${imageSrc}" alt="${card.name}" />
                <h3>${card.name}</h3>
                <p>Angriff: ${card.attack}</p>
                <p>Leben: ${card.health}</p>
                <p>Seltenheit: ${card.rarity}</p>
            </div>
        `;
    });
}


// Funktion zum Verkaufen einer Karte
async function sellCard() {
    const cardName = prompt("Geben Sie den Namen der zu verkaufenden Karte ein:");
    const response = await fetch(`${serverUrl}sell-card`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: currentUser , cardName })
    });

    const data = await response.json();
    alert(data.message); // Zeige die Nachricht an, die vom Server zurückgegeben wird
    fetchMyCards(); // Aktualisiere die Liste der eigenen Karten
}

async function buyBooster(packType) {
    const prices = {
        common: 50,
        rare: 100,
        epic: 200,
        legendary: 500
    };

    // Überprüfen, ob genügend PokeCoins vorhanden sind
    if (currentPokeCoins < prices[packType]) {
        alert("Nicht genügend PokeCoins!");
        return;
    }

    // Versuche, die PokeCoins auf dem Server zu aktualisieren
    const response = await fetch(`${serverUrl}update-pokecoins`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: currentUser, amount: -prices[packType] }) // Negativer Betrag, um die Coins abzuziehen
    });

    if (!response.ok) {
        alert("Fehler beim Aktualisieren der PokeCoins auf dem Server.");
        return;
    }

    // Booster-Pack kaufen, nachdem die Coins erfolgreich aktualisiert wurden
    const boosterResponse = await fetch(`${serverUrl}buy-booster`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: currentUser, packType })
    });

    const data = await boosterResponse.json();

    if (!boosterResponse.ok) {
        alert(`Fehler beim Kauf des Boosters: ${data.message}`);
        return;
    }

    // Falls alles geklappt hat, die Coins lokal aktualisieren
    currentPokeCoins -= prices[packType];
    displayPokeCoins();

    alert(data.message); // Zeige die erhaltenen Karten an
    fetchMyCards(); // Aktualisiere die angezeigten Karten
}

// Funktion zum Anzeigen der PokeCoins
function displayPokeCoins() {
    const pokeCoinsElement = document.getElementById('pokeCoins');
    pokeCoinsElement.innerText = `PokeCoins: ${currentPokeCoins}`; // Zeige die PokeCoins an
}

// Funktion zum Starten eines Einzelspieler-Kampfs
async function startBattle() {
    try {
        const playerCard = selectRandomCard(); // Wähle eine zufällige Karte des Spielers
        const aiCard = selectRandomCard(); // Wähle eine zufällige Karte der KI

        // Überprüfen, ob die Karten gültig sind
        if (!playerCard || !aiCard) {
            throw new Error('Eine der Karten ist ungültig');
        }

        // Setze die Pokémon-Bilder und -Namen
        document.getElementById('playerPokemonImage').src = playerCard.packImage || 'default_image.png'; // Fallback-Bild
        document.getElementById('playerPokemonName').innerText = playerCard.name;
        document.getElementById('playerPokemonHealth').innerText = `Leben: ${playerCard.health}`;
        document.getElementById('aiPokemonImage').src = aiCard.packImage || 'default_image.png'; // Fallback-Bild
        document.getElementById('aiPokemonName').innerText = aiCard.name;
        document.getElementById('aiPokemonHealth').innerText = `Leben: ${aiCard.health}`;

        let battleResult = document.getElementById('battleResult');
        battleResult.style.display = 'block';
        battleResult.innerHTML = `Du kämpfst mit ${playerCard.name} gegen ${aiCard.name}.`;

        // Animation der Pokémon
        document.getElementById('playerPokemon').style.animation = 'ram 0.5s forwards';
        document.getElementById('aiPokemon').style.animation = 'ram 0.5s forwards';

        // Kampf-Logik
        while (playerCard.health > 0 && aiCard.health > 0) {
            // Spieler greift an
            const damageToAI = Math.max(0, playerCard.attack + Math.floor(Math.random() * 11) - 5); // Schaden zwischen attack-5 und attack+5
            aiCard.health -= damageToAI;
            aiCard.health = Math.max(0, aiCard.health); // Verhindere, dass die Gesundheit ins Minus geht
            battleResult.innerHTML += `<br>${playerCard.name} verursacht ${damageToAI} Schaden. ${aiCard.name} hat jetzt ${aiCard.health} Leben.`;
            document.getElementById('aiPokemonHealth').innerText = `Leben: ${aiCard.health}`; // Aktualisiere die Anzeige der Lebenspunkte

            // Überprüfen, ob die KI besiegt ist
            if (aiCard.health <= 0) {
                battleResult.innerHTML += `<br>${aiCard.name} ist besiegt! Du hast gewonnen!`;
                const reward = 10; // Belohnung in PokeCoins
                currentPokeCoins += reward; // Aktualisiere die lokale PokeCoins-Zahl
                displayPokeCoins(); // Aktualisiere die Anzeige der PokeCoins

                // Aktualisiere die PokeCoins auf dem Server
                await fetch(`${serverUrl}update-pokecoins`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username: currentUser , amount: reward }) // Positiver Betrag, um die Coins hinzuzufügen
                });

                break;
            }

            // KI greift an
            const damageToPlayer = Math.max(0, aiCard.attack + Math.floor(Math.random() * 11) - 5); // Schaden zwischen attack-5 und attack+5
            playerCard.health -= damageToPlayer;
            playerCard.health = Math.max(0, playerCard.health); // Verhindere, dass die Gesundheit ins Minus geht
            battleResult.innerHTML += `<br>${aiCard.name} verursacht ${damageToPlayer} Schaden. ${playerCard.name} hat jetzt ${playerCard.health} Leben.`;
            document.getElementById('playerPokemonHealth').innerText = `Leben: ${playerCard.health}`; // Aktualisiere die Anzeige der Lebenspunkte

            // Überprüfen, ob der Spieler besiegt ist
            if (playerCard.health <= 0) {
                battleResult.innerHTML += `<br>${playerCard.name} ist besiegt! Du hast verloren!`;
                break;
            }
        }
    } catch (error) {
        console.error(error);
        alert('Ein Fehler ist aufgetreten: ' + error.message);
    }
}

// Funktion zum Auswählen einer zufälligen Karte
function selectRandomCard() {
    if (cards.length === 0) {
        throw new Error('Keine Karten verfügbar');
    }
    const randomIndex = Math.floor(Math.random() * cards.length);
    return cards[randomIndex];
}

// Funktion zum Starten eines Online-Kampfs
async function startOnlineBattle() {
    alert("Online-Kampf gestartet! Diese Funktion wird in einer zukünftigen Version implementiert.");
}

// Funktion zum Filtern der Karten
function filterCards() {
    const searchInput = document.getElementById('searchCards').value.toLowerCase();
    const cards = document.querySelectorAll('#allCards .card');
    cards.forEach(card => {
        const cardName = card.querySelector('h3').innerText.toLowerCase();
        card.style.display = cardName.includes(searchInput) ? 'block' : 'none';
    });
}

// Funktion zum Umschalten der Sichtbarkeit von Abschnitten
function toggleSections(sectionId) {
    const sections = ['loginSection', 'registerSection', 'cards', 'myCards', 'store', 'battle'];
    sections.forEach(section => {
        document.getElementById(section).style.display = section === sectionId ? 'block' : 'none';
    });
}