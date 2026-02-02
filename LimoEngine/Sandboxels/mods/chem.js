// Element: Blaue Flamme (Kürzer)
elements.blue_flame = {
    color: ["#6495ED", "#4169E1", "#8080FF", "#A7C7E7", "#B0E0E6"],
    behavior: behaviors.FLUID,
    category: "gases",
    temp: 2000,
    density: 0.1,
    conduct: 0.05,
    ignore: ["blue_flame"],
    state: "gas",
    givenName: "Blaue Flamme",
    hidden: true,
    tick: function(pixel) {
        // Reduziere die Temperatur und somit die Lebensdauer der Flamme
        pixel.temp -= 45; // <-- HÖHERER WERT FÜR KÜRZERE FLAMME
        
        if (pixel.temp <= 0) {
            deletePixel(pixel.x, pixel.y);
            return;
        }

        // Standard-Offset ist 0 (gerade nach oben)
        let x_offset = 0; 
        
        // Nur eine kleine Chance (15%) pro Tick, um seitlich zu flackern
        if (Math.random() < 0.15) { 
            x_offset = Math.floor(Math.random() * 3) - 1; // -1, 0, oder 1
        }
        
        // Versuche, sich mit dem berechneten Offset nach oben zu bewegen
        if (!tryMove(pixel, pixel.x + x_offset, pixel.y - 1)) {
            // Wenn der Weg blockiert ist, versuche einfach gerade nach oben
            tryMove(pixel, pixel.x, pixel.y - 1);
        }
    }
};

// Element: Gasbrenner (Stabiler)
elements.gas_burner = {
    color: "#a9a9a9",
    name: "Gasbrenner",
    behavior: behaviors.WALL,
    category: "machines",
    conduct: 1,
    temp: 150, // Der Brenner selbst ist heiß

    tick: function(pixel) {
        if (pixel.charge > 0) {
            let x = pixel.x;
            let y = pixel.y - 1;

            if (y < 0) return;

            // WICHTIG: Entferne Math.random(), um eine konstante Flamme zu erzeugen
            if (isEmpty(x, y, true)) {
                // Erzeuge eine blaue Flamme
                createPixel("blue_flame", x, y);
                // Stelle sicher, dass die neue Flamme die volle Temperatur hat
                if (pixelMap[x][y]) {
                    pixelMap[x][y].temp = 2000;
                }
            }
        }
    }
};

// Andere Elemente und Mod-Code hier...

// Element: Jod (Fest)
elements.jod = {
    // Hinzugefügte helle/silberne Farben für den Glitzer-Effekt
    color: ["#3d003d", "#2e002e", "#4b004b", "#c0c0c0", "#e0e0e0", "#9370db"],
    behavior: behaviors.POWDER,
    category: "powders",
    name: "Jod",
    density: 2000,
    state: "solid",
    
    // Simuliert die Sublimation (fest zu gasförmig)
    stateHigh: "jod_gas",
    tempHigh: 101, // Wird zu Gas, wenn es heißer als Wasser ist
};

// Element: Jod Gas
elements.jod_gas = {
    color: ["#a020f0", "#8a2be2", "#9370db", "#b19cd9"], // Sichtbares lila Gas
    behavior: behaviors.GAS,
    category: "gases",
    name: "Jod Gas",
    density: 1.0, // Steigt auf
    temp: 102, // Startet heiß
    state: "gas",

    // Simuliert die Resublimation (gasförmig zu fest)
    stateLow: "jod",
    tempLow: 5, // Wird fest, wenn es sehr kalt wird (wie am Eisdeckel)

    // Simuliert die "giftige" Eigenschaft
    // Reagiert mit "human" und "body" Pixeln
    reactions: {
        "human": { elem: "ash", chance: 0.1 },
        "body": { elem: "ash", chance: 0.1 }
    }
};

// Element: Jodsalz
elements.jodsalz = {
    color: ["#f7f7f7", "#f2f2f2", "#ffffff"], // Sieht aus wie normales Salz
    behavior: behaviors.POWDER,
    category: "powders",
    name: "Jodsalz",
    density: 2160, // Dichte von Salz
    state: "solid",
    // Ist stabil und reagiert nicht (wie echtes Salz)
};

// Element: Kühler (für Destillation)
elements.kuehler = {
    color: ["#e0f0ff", "#b0d0e0", "#ffffff"], // Helles, bläuliches Glas
    name: "Kühler",
    behavior: behaviors.WALL,
    category: "machines",
    density: 1000,
    temp: -10, // Ist permanent sehr kalt
    conduct: 0.2, // Leitet Wärme/Kälte
    
    tick: function(pixel) {
        // Prüfe alle 8 umliegenden Pixel
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue; // Sich selbst überspringen
                
                let x = pixel.x + i;
                let y = pixel.y + j;
                
                if (isEmpty(x, y, true)) continue; // Leere Pixel überspringen
                
                let neighbor = pixelMap[x][y];
                
                // Wenn der Nachbar "steam" (Dampf) ist
                if (neighbor.element === "steam") {
                    // Verwandle den Dampf sofort in Wasser
                    changePixel(neighbor, "water");
                }
            }
        }
    }
};

// Element: Thermometer (Finale stabile Version 6)
elements.thermometer = {
    color: "#c0c0c0",
    name: "Thermometer",
    behavior: behaviors.WALL,
    category: "machines",
    density: 4000,
    conduct: 0.9, 
    
    tick: function(pixel) {
        
        // --- START KORREKTUR ---
        if (pixel.life === undefined) { 
            pixel.life = 0; 
            pixel.hasBuiltGlass = false;
            // Zufällige Verzögerung (15-24 Ticks)
            pixel.buildDelay = 15 + Math.floor(Math.random() * 10); 
        }
        
        if (!pixel.hasBuiltGlass) {
            pixel.life++;
        }

        // Warte auf die zufällige Verzögerung
        if (pixel.life > pixel.buildDelay && !pixel.hasBuiltGlass) {
            
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    
                    if (i === 0 && j === 0) continue;
                    
                    let x = pixel.x + i;
                    let y = pixel.y + j;
                    
                    // KORREKTUR:
                    // 1. Prüfe, ob (x,y) IM SPIELFELD ist.
                    if (!outOfBounds(x, y)) {
                        
                        // 2. Prüfe, ob das Feld "air" ist.
                        // (isEmpty OHNE 'true' prüft nur auf "air")
                        if (isEmpty(x, y)) {
                            
                            // 3. ERSTELLE das Pixel.
                            // Das war der "colorPatternPick"-Absturz,
                            // der aber durch buildDelay verhindert werden sollte.
                            createPixel("glass", x, y);
                        }
                    }
                }
            }
            // Setze die "Flagge", damit es nie wieder baut
            pixel.hasBuiltGlass = true; 
        }
        // --- ENDE KORREKTUR ---


        let roomTemp = 20;
        // Faktor verkleinert: 0.01 = langsam, 0.005 = sehr träge
        let tempSpeed = 0.01; 

        if (pixel.temp > roomTemp) {
            pixel.temp -= (pixel.temp - roomTemp) * tempSpeed;
        } else if (pixel.temp < roomTemp) {
            pixel.temp += (roomTemp - pixel.temp) * tempSpeed;
        }
        
        let hue;
        let lightness = 50;
        let t = pixel.temp;

        if (t < 0) {
            // --- KÄLTE (Unter 0°C) ---
            // Geht von Blau (240) ins Violette (300)
            let cold = Math.max(t, -100); 
            hue = 240 + (Math.abs(cold) / 100) * 60;
            
        } else if (t <= 30) {
            // --- NORMAL (0°C bis 30°C) ---
            // Übergang: Blau (240) -> Grün (120)
            // Damit ist 20°C (Zimmer) ein angenehmes Türkis/Grün
            hue = 240 - (t / 30) * 120;
            
        } else if (t <= 100) {
            // --- HITZE (30°C bis 100°C) ---
            // Übergang: Grün (120) -> Rot (0)
            // Hier passiert der Farbwechsel zu "Heiß" viel schneller
            hue = 120 - ((t - 30) / 70) * 120;
            
        } else {
            // --- EXTREM (> 100°C) ---
            hue = 0; // Bleibt Rot
            
            // Ab 500°C fängt es an weiß zu glühen (Helligkeit hoch)
            if (t > 500) {
                lightness = 50 + ((t - 500) * 0.2);
                if (lightness > 100) lightness = 100;
            }
        }

        pixel.color = "hsl(" + Math.floor(hue) + ", 100%, " + Math.floor(lightness) + "%)";
    }
};

elements.aluminium_powder = {
    color: ["#848484", "#a9a9a9", "#c0c0c0"],
    behavior: behaviors.POWDER,
    category: "powders",
    name: "Alu-Pulver",
    density: 2700,
    state: "solid",
    conduct: 0.8,
    tempHigh: 660,
    stateHigh: "molten_aluminum",

    reactions: {
        // Trockenes Jod: Passiert fast nie (Chance extrem niedrig)
        "jod": {
            elem1: "fire",
            elem2: "jod_gas",
            chance: 0.001, 
            func: function(pixel1, pixel2) { pixel1.temp += 200; }
        },
        
        // Wasser: Reagiert NUR, wenn Jod in der Nähe ist
        "water": {
            // KEIN automatisches elem2 (Wasser bleibt, wenn kein Jod da ist)
            func: function(pixel1, pixel2) {
                
                let catalystFound = false;

                // Suche im Umkreis von 1 Pixel nach Jod
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        let nx = pixel1.x + i;
                        let ny = pixel1.y + j;
                        if (!outOfBounds(nx, ny) && pixelMap[nx][ny]) {
                            if (pixelMap[nx][ny].element === "jod") {
                                catalystFound = true;
                                break;
                            }
                        }
                    }
                    if (catalystFound) break;
                }

                // Wenn Jod gefunden wurde -> EXPLOSION
                if (catalystFound) {
                    pixel1.temp += 1500; // Extreme Hitze
                    changePixel(pixel1, "fire"); // Alu verbrennt
                    changePixel(pixel2, "steam"); // Wasser verdampft
                    explodeAt(pixel1.x, pixel1.y, 5, "jod_gas"); // Lila Rauchwolke
                }
                // Wenn kein Jod da ist -> Passiert nichts (Wasser macht Alu nur nass)
            }
        }
    }
};

elements.magnet_ruehrer = {
    color: "#222222",
    name: "Magnetrührer",
    behavior: behaviors.WALL,
    category: "machines",
    state: "solid",
    density: 5000,
    conduct: 1, // Leitet Strom
    
    tick: function(pixel) {
        // 1. BRAUCHT STROM
        if (pixel.charge) {

            // KONFIGURATION
            let rangeHeight = 40; // Wie weit nach oben er wirkt
            let rangeWidth = 6;   // Wie breit der Strudel ist (Radius)

            // Wir scannen den Bereich über dem Rührer
            for (let y = -1; y >= -rangeHeight; y--) {
                for (let xOffset = -rangeWidth; xOffset <= rangeWidth; xOffset++) {
                    
                    let targetX = pixel.x + xOffset;
                    let targetY = pixel.y + y;

                    if (outOfBounds(targetX, targetY)) continue;

                    let p = pixelMap[targetX][targetY];

                    // Wir bewegen nur: Flüssigkeiten, Pulver, Gase (und Teig!)
                    if (p && p.element !== "wall" && p.element !== "glass" && p.element !== "magnet_ruehrer") {
                        
                        // --- STRUDEL LOGIK ---
                        
                        // A. MITTE: Sog nach unten (Saugt Mehl von der Oberfläche)
                        // Wenn wir nah an der Mitte sind (xOffset ist klein)
                        if (Math.abs(xOffset) <= 2) {
                            if (Math.random() < 0.3) { // 30% Chance zu sinken
                                tryMove(p, p.x, p.y + 1);
                            }
                        } 
                        // B. AUSSEN: Druck nach oben (Drückt Wasser am Rand hoch)
                        else {
                            if (Math.random() < 0.2) { // 20% Chance zu steigen
                                tryMove(p, p.x, p.y - 1);
                            }
                        }

                        // C. MIXER: Aggressives Hin- und Herwerfen
                        // Je weiter unten, desto stärker der Effekt (nahe am Magnetfisch)
                        let depthFactor = 1 - (Math.abs(y) / rangeHeight); // 1.0 unten, 0.0 oben
                        
                        if (Math.random() < 0.5 * depthFactor) {
                            // Zufällige Richtung + Strudel-Drall
                            // (Drückt unten eher nach außen)
                            let dir = 0;
                            if (y > -5) {
                                // Ganz unten: Nach außen drücken
                                dir = (xOffset > 0) ? 1 : -1;
                            } else {
                                // Weiter oben: Zufälliges Chaos
                                dir = Math.random() < 0.5 ? 1 : -1;
                            }
                            
                            tryMove(p, p.x + dir, p.y);
                        }
                    }
                }
            }
        }
    }
};