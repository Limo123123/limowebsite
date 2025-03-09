// ===========================
// Existing Elements (for context)
// ===========================

elements.goo = {
    name: "goo",
    color: "#00FF00",
    behavior: behaviors.LIQUID,
    category: "New Elements",
    viscosity: 1.2,
    interactions: {
        eatThrough: ["wood", "leaves"],
        ignite: { result: "toxicGasCloud", effect: "creates toxic gas" }
    },
    tick: function(pixel) {
        if (Math.random() < 0.1) {
            let adjacentCoords = [[1, 0], [-1, 0], [0, 1], [0, -1]];
            for (let i = 0; i < adjacentCoords.length; i++) {
                let x = pixel.x + adjacentCoords[i][0];
                let y = pixel.y + adjacentCoords[i][1];
                if (isEmpty(x, y) || outOfBounds(x, y)) continue;
                let adjacentPixel = pixelMap[x][y];
                if (this.interactions.eatThrough.includes(adjacentPixel.element)) {
                    changePixel(adjacentPixel, "water");
                }
            }
        }
    }
};

elements.electricLiquid = {
    name: "electricLiquid",
    color: "#FFFF00",
    behavior: behaviors.LIQUID,
    category: "New Elements",
    conductivity: true,
    interactions: {
        powerMachines: true,
        shortCircuit: true
    },
    tick: function(pixel) {
        if (outOfBounds(pixel.x, pixel.y + 1)) return;
        const belowPixel = pixelMap[pixel.x][pixel.y + 1];
        if (belowPixel && belowPixel.element === "power_source") {
            createPixel("electric_spark", pixel.x, pixel.y);
        }
    }
};

elements.lavaMist = {
    name: "lavaMist",
    color: "#FF4500",
    behavior: behaviors.GAS,
    category: "New Elements",
    heatEffect: "damageOverTime",
    interactions: {
        turnWaterToSteam: true,
        freezeUnderCold: true
    },
    tick: function(pixel) {
        if (Math.random() < 0.05) {
            let adjacentCoords = [[1, 0], [-1, 0], [0, 1], [0, -1]];
            for (let i = 0; i < adjacentCoords.length; i++) {
                let x = pixel.x + adjacentCoords[i][0];
                let y = pixel.y + adjacentCoords[i][1];
                if (isEmpty(x, y) || outOfBounds(x, y)) continue;
                let adjacentPixel = pixelMap[x][y];
                if (adjacentPixel.element === "water") {
                    changePixel(adjacentPixel, "steam");
                }
            }
        }
    }
};

elements.magneticSand = {
    name: "magneticSand",
    color: "#C0C0C0",
    behavior: behaviors.SOLID,
    category: "New Elements",
    magnetic: true,
    interactions: {
        attractMetals: true,
        buildBridges: true
    },
    tick: function(pixel) {
        let adjacentCoords = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1]];
        for (let i = 0; i < adjacentCoords.length; i++) {
            let x = pixel.x + adjacentCoords[i][0];
            let y = pixel.y + adjacentCoords[i][1];
            if (isEmpty(x, y) || outOfBounds(x, y)) continue;
            let adjacentPixel = pixelMap[x][y];
            if (adjacentPixel.element === "iron" || adjacentPixel.element === "metal") {
                movePixel(adjacentPixel, pixel.x, pixel.y);
            }
        }
    }
};

elements.cryoDust = {
    name: "cryoDust",
    color: "#00FFFF",
    behavior: behaviors.PARTICLE,
    category: "New Elements",
    interactions: { freeze: true },
    tick: function(pixel) {
        // Freezes water in adjacent cells—even diagonally
        let adjacentCoords = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1]];
        for (let i = 0; i < adjacentCoords.length; i++) {
            let x = pixel.x + adjacentCoords[i][0];
            let y = pixel.y + adjacentCoords[i][1];
            if (isEmpty(x, y) || outOfBounds(x, y)) continue;
            let adjacentPixel = pixelMap[x][y];
            if (adjacentPixel.element === "water") {
                changePixel(adjacentPixel, "ice");
            }
        }
    }
};

elements.acidicFoam = {
    name: "acidicFoam",
    color: "#ADFF2F",
    behavior: behaviors.LIQUID,
    category: "New Elements",
    interactions: { burnThrough: ["wood", "stone", "metal"] },
    tick: function(pixel) {
        let adjacentCoords = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1]];
        for (let i = 0; i < adjacentCoords.length; i++) {
            let x = pixel.x + adjacentCoords[i][0];
            let y = pixel.y + adjacentCoords[i][1];
            if (isEmpty(x, y) || outOfBounds(x, y)) continue;
            let adjacentPixel = pixelMap[x][y];
            if (this.interactions.burnThrough.includes(adjacentPixel.element)) {
                changePixel(adjacentPixel, "acidicGas");
            }
        }
    }
};

elements.antigravityCrystal = {
    name: "antigravityCrystal",
    color: "#9400D3",
    behavior: behaviors.SOLID,
    category: "New Elements",
    interactions: {
        levitate: true,
        repelNearbySolids: true
    },
    tick: function(pixel) {
        let adjacentCoords = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1]];
        for (let i = 0; i < adjacentCoords.length; i++) {
            let x = pixel.x + adjacentCoords[i][0];
            let y = pixel.y + adjacentCoords[i][1];
            if (isEmpty(x, y) || outOfBounds(x, y)) continue;
            let adjacentPixel = pixelMap[x][y];
            if (adjacentPixel.element !== "air" && adjacentPixel.element !== "water") {
                movePixel(adjacentPixel, x, y - 1);
            }
        }
    }
};

elements.solarFlare = {
    name: "solarFlare",
    color: "#FF6347",
    behavior: behaviors.GAS,
    category: "New Elements",
    interactions: {
        ignite: { result: "fire", effect: "spreads fire" },
        burnThrough: ["metal"]
    },
    tick: function(pixel) {
        let adjacentCoords = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1]];
        for (let i = 0; i < adjacentCoords.length; i++) {
            let x = pixel.x + adjacentCoords[i][0];
            let y = pixel.y + adjacentCoords[i][1];
            if (isEmpty(x, y) || outOfBounds(x, y)) continue;
            let adjacentPixel = pixelMap[x][y];
            if (adjacentPixel.element === "wood" || adjacentPixel.element === "grass") {
                changePixel(adjacentPixel, "fire");
            }
            if (adjacentPixel.element === "metal") {
                changePixel(adjacentPixel, "meltedMetal");
            }
        }
    }
};

elements.shockwave = {
    name: "shockwave",
    color: "#800080",
    behavior: behaviors.SOLID,
    category: "New Elements",
    interactions: { impact: true },
    tick: function(pixel) {
        let adjacentCoords = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1]];
        for (let i = 0; i < adjacentCoords.length; i++) {
            let x = pixel.x + adjacentCoords[i][0];
            let y = pixel.y + adjacentCoords[i][1];
            if (isEmpty(x, y) || outOfBounds(x, y)) continue;
            let adjacentPixel = pixelMap[x][y];
            if (adjacentPixel.element === "rock" || adjacentPixel.element === "metal") {
                changePixel(adjacentPixel, "dust");
            }
        }
    }
};

elements.jellySlime = {
    name: "jellySlime",
    color: "#ADFF2F",
    behavior: behaviors.LIQUID,
    category: "New Elements",
    interactions: { absorb: ["water", "oil"] },
    tick: function(pixel) {
        let adjacentCoords = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1]];
        for (let i = 0; i < adjacentCoords.length; i++) {
            let x = pixel.x + adjacentCoords[i][0];
            let y = pixel.y + adjacentCoords[i][1];
            if (isEmpty(x, y) || outOfBounds(x, y)) continue;
            let adjacentPixel = pixelMap[x][y];
            if (this.interactions.absorb.includes(adjacentPixel.element)) {
                changePixel(adjacentPixel, "jellySlime");
            }
        }
    }
};

// ===========================
// 10 Additional New Elements
// ===========================

// Plasma Blob, which transforms into Plasma Gas after a while
elements.plasmaBlob = {
    color: "#FF6347", // Bright orange-red for plasma
    behavior: behaviors.LIQUID,
    category: "New Elements",
    interactions: {
        turnIntoPlasmaGas: { result: "plasmaGas", effect: "transforms into plasma gas after time" }
    },
    tick: function(pixel) {
        // After a certain time or random chance, turn into plasma gas
        if (Math.random() < 0.1) {
            changePixel(pixel, "plasmaGas");
        }
    }
};

elements.plasmaGas = {
    color: "#FF4500", // Bright red for gas
    behavior: behaviors.GAS,
    category: "New Elements",
    interactions: {
        causeFire: true, // Plasma gas can start fires
        disappearInCold: true // Plasma gas disappears in cold environments
    },
};

// 2. Terraformer Plant: Transforms nearby dirt into fertile soil (grass).
elements.terraformerPlant = {
    name: "terraformerPlant",
    color: "#228B22",
    behavior: behaviors.PLANT,
    category: "New Elements",
    interactions: { transform: ["dirt"] },
    tick: function(pixel) {
        let adjacentCoords = [[1, 0], [-1, 0], [0, 1], [0, -1],
                              [1, 1], [-1, -1], [1, -1], [-1, 1]];
        for (let i = 0; i < adjacentCoords.length; i++) {
            let x = pixel.x + adjacentCoords[i][0];
            let y = pixel.y + adjacentCoords[i][1];
            if (isEmpty(x, y) || outOfBounds(x, y)) continue;
            let adjacentPixel = pixelMap[x][y];
            if (adjacentPixel.element === "dirt") {
                changePixel(adjacentPixel, "grass");
            }
        }
    }
};

// 3. Reactive Clay: Changes into hard clay when exposed to water.
// Reactive Clay, transforms into Hard Clay when exposed to air or heat
elements.reactiveClay = {
    color: "#A52A2A",  // Brown for clay
    behavior: behaviors.SOLID,
    category: "New Elements",
    interactions: {
        exposeToAir: { result: "hardClay", effect: "hardens into hard clay" }
    },
    tick: function(pixel) {
        // Logic to turn into Hard Clay when exposed to air (or heat)
        if (Math.random() < 0.05 && !isSurroundedByWater(pixel)) {
            // Transform the clay into hard clay when exposed to air
            changePixel(pixel, "hardClay");
        }
    }
};

elements.hardClay = {
    color: "#8B4513",  // Darker brown for hardened clay
    behavior: behaviors.SOLID,
    category: "New Elements",
    interactions: {},
};

// 4. Time Fragment: Alters the “speed” (simulated via color change) of nearby pixels.
elements.timeFragment = {
    name: "timeFragment",
    color: "#FFD700",
    behavior: behaviors.SOLID,
    category: "New Elements",
    interactions: { timeAlter: true },
    tick: function(pixel) {
        let adjacentCoords = [[1, 0], [-1, 0], [0, 1], [0, -1],
                              [1, 1], [-1, -1], [1, -1], [-1, 1]];
        for (let i = 0; i < adjacentCoords.length; i++) {
            let x = pixel.x + adjacentCoords[i][0];
            let y = pixel.y + adjacentCoords[i][1];
            if (isEmpty(x, y) || outOfBounds(x, y)) continue;
            let adjacentPixel = pixelMap[x][y];
            if (Math.random() < 0.5) {
                adjacentPixel.color = "#FFFFE0"; // Simulated speed-up effect
            } else {
                adjacentPixel.color = "#FFA07A"; // Simulated slow-down effect
            }
        }
    }
};

// 5. Shadow Matter: Absorbs light and darkens nearby pixels.
elements.shadowMatter = {
    name: "shadowMatter",
    color: "#2F4F4F",
    behavior: behaviors.SOLID,
    category: "New Elements",
    interactions: { absorbLight: true },
    tick: function(pixel) {
        let adjacentCoords = [[1, 0], [-1, 0], [0, 1], [0, -1],
                              [1, 1], [-1, -1], [1, -1], [-1, 1]];
        for (let i = 0; i < adjacentCoords.length; i++) {
            let x = pixel.x + adjacentCoords[i][0];
            let y = pixel.y + adjacentCoords[i][1];
            if (isEmpty(x, y) || outOfBounds(x, y)) continue;
            let adjacentPixel = pixelMap[x][y];
            if (adjacentPixel.color && adjacentPixel.color !== "#000000") {
                adjacentPixel.color = "#1C1C1C";
            }
        }
    }
};

// 6. Volcanic Ash: Falls like a powder and turns into mud when contacting water.
elements.volcanicAsh = {
    name: "volcanicAsh",
    color: "#808080",
    behavior: behaviors.PARTICLE,
    category: "New Elements",
    interactions: { combineWithWater: true },
    tick: function(pixel) {
        if (!outOfBounds(pixel.x, pixel.y + 1)) {
            let belowPixel = pixelMap[pixel.x][pixel.y + 1];
            if (belowPixel && belowPixel.element === "water") {
                changePixel(pixel, "mud");
            }
        }
        if (!outOfBounds(pixel.x, pixel.y + 1) && isEmpty(pixel.x, pixel.y + 1)) {
            movePixel(pixel, pixel.x, pixel.y + 1);
        }
    }
};

// 7. Cloud Slime: A light liquid that floats upward.
elements.cloudSlime = {
    name: "cloudSlime",
    color: "#E0FFFF",
    behavior: behaviors.LIQUID,
    category: "New Elements",
    interactions: { float: true },
    tick: function(pixel) {
        if (!outOfBounds(pixel.x, pixel.y - 1) && isEmpty(pixel.x, pixel.y - 1)) {
            movePixel(pixel, pixel.x, pixel.y - 1);
        }
    }
};

// 8. Wind Element: A gaseous element that pushes nearby pixels horizontally.
elements.windElement = {
    name: "windElement",
    color: "#ADD8E6",
    behavior: behaviors.GAS,
    category: "New Elements",
    interactions: { push: true },
    tick: function(pixel) {
        let direction = Math.random() < 0.5 ? 1 : -1;
        let x = pixel.x + direction;
        let y = pixel.y;
        if (isEmpty(x, y) || outOfBounds(x, y)) return;
        let adjacentPixel = pixelMap[x][y];
        movePixel(adjacentPixel, x + direction, y);
    }
};

// 9. Mystic Fog: A gas that obscures vision by dimming nearby pixels.
elements.mysticFog = {
    name: "mysticFog",
    color: "#7B68EE",
    behavior: behaviors.GAS,
    category: "New Elements",
    interactions: { obscureVision: true },
    tick: function(pixel) {
        let adjacentCoords = [[1, 0], [-1, 0], [0, 1], [0, -1],
                              [1, 1], [-1, -1], [1, -1], [-1, 1]];
        for (let i = 0; i < adjacentCoords.length; i++) {
            let x = pixel.x + adjacentCoords[i][0];
            let y = pixel.y + adjacentCoords[i][1];
            if (isEmpty(x, y) || outOfBounds(x, y)) continue;
            let adjacentPixel = pixelMap[x][y];
            adjacentPixel.color = "#4B0082";
        }
    }
};

// 10. Quantum Particle: A tiny particle that randomly teleports within adjacent cells.
elements.quantumParticle = {
    name: "quantumParticle",
    color: "#FF1493",
    behavior: behaviors.PARTICLE,
    category: "New Elements",
    interactions: { teleport: true },
    tick: function(pixel) {
        if (Math.random() < 0.2) {
            let adjacentCoords = [[1, 0], [-1, 0], [0, 1], [0, -1],
                                  [1, 1], [-1, -1], [1, -1], [-1, 1]];
            let randomCoord = adjacentCoords[Math.floor(Math.random() * adjacentCoords.length)];
            let newX = pixel.x + randomCoord[0];
            let newY = pixel.y + randomCoord[1];
            if (!outOfBounds(newX, newY) && isEmpty(newX, newY)) {
                movePixel(pixel, newX, newY);
            }
        }
    }
};

// New Element - **Acidic Gas**
elements.acidicGas = {
    color: "#00FF00", // Green for acid gas
    behavior: behaviors.GAS,
    category: "New Elements",
    interactions: {
        dissolveMaterials: ["wood", "stone", "metal"],  // Acidic gas can dissolve certain materials
    },
    tick: function(pixel) {
        // Logic for acidic gas behavior
        if (Math.random() < 0.05) {
            let adjacentCoords = [[1, 0], [-1, 0], [0, 1], [0, -1]];
            for (let i = 0; i < adjacentCoords.length; i++) {
                let x = pixel.x + adjacentCoords[i][0];
                let y = pixel.y + adjacentCoords[i][1];
                if (isEmpty(x, y) || outOfBounds(x, y)) continue;
                let adjacentPixel = pixelMap[x][y];
                if (this.interactions.dissolveMaterials.includes(adjacentPixel.element)) {
                    changePixel(adjacentPixel, "acidicGas");  // Turn into acidic gas when material is dissolved
                }
            }
        }
    }
};

// New Element - **Time Accelerated Plant**
elements.timeAcceleratedPlant = {
    color: "#228B22", // A brighter green for accelerated plant
    behavior: behaviors.LIQUID,
    category: "New Elements",
    interactions: {
        growFaster: true,
    },
    tick: function(pixel) {
        // Accelerate the growth of the plant
        if (Math.random() < 0.1) {
            let adjacentCoords = [[1, 0], [-1, 0], [0, 1], [0, -1]];
            for (let i = 0; i < adjacentCoords.length; i++) {
                let x = pixel.x + adjacentCoords[i][0];
                let y = pixel.y + adjacentCoords[i][1];
                if (isEmpty(x, y) || outOfBounds(x, y)) continue;
                let adjacentPixel = pixelMap[x][y];
                if (adjacentPixel.element === "soil") {
                    changePixel(adjacentPixel, "grownPlant");  // The plant accelerates its growth
                }
            }
        }
    }
};

// New Element - **Grown Plant**
elements.grownPlant = {
    color: "#32CD32",  // A darker green for the grown plant
    behavior: behaviors.LIQUID,
    category: "New Elements",
    interactions: {},
};


// Function to register new elements in the game
function registerNewElements() {
    const newElements = [
        elements.goo,
        elements.electricLiquid,
        elements.lavaMist,
        elements.magneticSand,
        elements.cryoDust,
        elements.acidicFoam,
        elements.antigravityCrystal,
        elements.solarFlare,
        elements.shockwave,
        elements.jellySlime,
        elements.plasmaBlob,
        elements.terraformerPlant,
        elements.reactiveClay,
        elements.timeFragment,
        elements.shadowMatter,
        elements.volcanicAsh,
        elements.cloudSlime,
        elements.windElement,
        elements.mysticFog,
        elements.quantumParticle,
        elements.hardClay,
        elements.plasmaGas,
        elements.acidicGas,
        elements.timeAcceleratedPlant,
        elements.grownPlant
    ];

    newElements.forEach(element => {
        game.registerElement(element.name, element.category, element);
    });
}

// Call the function to register the new elements
registerNewElements();
