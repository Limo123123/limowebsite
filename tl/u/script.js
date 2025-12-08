// Prüft, ob eine Weiterleitung nötig ist
document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const shortCode = params.get("l");
    if (shortCode) {
        const links = JSON.parse(localStorage.getItem("shortenedLinks")) || {};
        if (links[shortCode]) {
            window.location.href = links[shortCode];
        } else {
            alert("Dieser Kurzlink existiert nicht!");
        }
    }
    loadLinks();
});

function generateShortURL() {
    const urlInput = document.getElementById("urlInput").value;
    let customShort = document.getElementById("customShort").value;

    if (!urlInput.startsWith("http")) {
        alert("Bitte eine gültige URL mit https:// eingeben!");
        return;
    }

    // Lokale URL-Liste abrufen oder erstellen
    let links = JSON.parse(localStorage.getItem("shortenedLinks")) || {};

    // Falls kein custom Shortlink eingegeben wurde, erstelle einen zufälligen
    if (!customShort) {
        customShort = Math.random().toString(36).substring(2, 8);
    }

    // Prüfen, ob der Shortlink schon existiert
    if (links[customShort]) {
        alert("Dieser Shortlink ist bereits vergeben!");
        return;
    }

    // Speichere den neuen Link in LocalStorage
    links[customShort] = urlInput;
    localStorage.setItem("shortenedLinks", JSON.stringify(links));

    loadLinks();
}

// Lädt die gespeicherten Links
function loadLinks() {
    const linkList = document.getElementById("linkList");
    linkList.innerHTML = "";
    const links = JSON.parse(localStorage.getItem("shortenedLinks")) || {};

    for (let key in links) {
        const li = document.createElement("li");
        li.innerHTML = `
            <a href="?l=${key}" target="_blank">${window.location.href}?l=${key}</a>
            <button class="delete-btn" onclick="deleteLink('${key}')">❌</button>
        `;
        linkList.appendChild(li);
    }
}

// Löscht einen gespeicherten Link
function deleteLink(key) {
    let links = JSON.parse(localStorage.getItem("shortenedLinks")) || {};
    delete links[key];
    localStorage.setItem("shortenedLinks", JSON.stringify(links));
    loadLinks();
}
