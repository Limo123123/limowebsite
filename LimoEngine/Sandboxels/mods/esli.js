elements.green_fire = {
    color: "#00FF00", // Green color
    behavior: behaviors.UL_UR_OPTIMIZED, // Fire-like behavior
    category: "energy", // Fire is usually categorized as energy
    state: "gas", // Fire is treated as a gas
    temp: 1200, // 3x the temperature of regular fire (400°C)
    burn: 100, // Maximum burn rate
    burnTime: 50, // Same burn time as regular fire
    burnInto: "ash", // Turns into ash after burning
    reactions: {
        "water": { elem1: null, elem2: "steam" }, // Extinguishes when touching water
        "sand": { elem1: "glass", elem2: null }, // Turns sand into glass
    },
    tempHigh: 2500, // Fire burns until it reaches this point, then burns out
    stateHigh: "plasma", // Turns into plasma at extremely high temperatures
};

elements.quantum_liquid = {
    color: "#9900FF",  // Purple liquid
    behavior: behaviors.SUPERFLUID,  // Superfluid behavior for smooth flowing
    category: "mystical",  // Place in a custom category "mystical"
    state: "liquid",  // Liquid state
    density: 2,  // Light liquid
    reactions: {
        "plasma": { func: (pixel) => { teleport(pixel); } }  // Teleport randomly when interacting with plasma
    },
    tick: function(pixel) {
        if(Math.random() < 0.01) {
            teleport(pixel);  // Random teleportation with 1% chance per tick
        }
    },
};

// Helper function for teleportation
function teleport(pixel) {
    let randomX = Math.floor(Math.random() * width);  // Random X position
    let randomY = Math.floor(Math.random() * height); // Random Y position
    movePixel(pixel, randomX, randomY);  // Move pixel to new position
}

elements.gravity_crystal = {
    color: "#00FFFF",  // Cyan color for crystal
    behavior: behaviors.AGPOWDER,  // Powder with reversed gravity
    category: "mystical",  // Place in a custom category "mystical"
    state: "solid",  // Solid state
    density: 500,  // Medium density
    tick: function(pixel) {
        // Anti-gravity field logic
        for (let dx = -2; dx <= 2; dx++) {
            for (let dy = -2; dy <= 2; dy++) {
                let neighbor = pixelMap[pixel.x + dx]?.[pixel.y + dy];
                if (neighbor && neighbor.state === "liquid" || neighbor.state === "gas") {
                    neighbor.vy -= 0.5;  // Apply upward force to nearby liquids or gases
                }
            }
        }
    },
    tempHigh: 1000,  // Melts at high temperatures
    stateHigh: "molten_crystal",  // Turns into molten crystal when heated
};


