elements.limo = {
    color: "#00FF00",  // Green color
    behavior: behaviors.WALL, // Solid material that can be placed
    category: "special",
    state: "solid",
    reactions: {
        // Reaction with water
        "water": { 
            elem1: "fire",  // Limo turns into fire
            elem2: "fire",  // Water also turns into fire
            func: (pixel1, pixel2) => {
                pixel1.burning = true;
                pixel1.burnStart = pixelTicks;
                pixel2.burning = true;
                pixel2.burnStart = pixelTicks;
            }
        },
        // Reaction with Mayo
        "mayo": {
            elem1: null,  // Limo disappears
            elem2: null,  // Mayo disappears
            func: (pixel1, pixel2) => {
                // Create a large explosion
                for (let dx = -10; dx <= 10; dx++) {
                    for (let dy = -10; dy <= 10; dy++) {
                        const nx = pixel1.x + dx;
                        const ny = pixel1.y + dy;
                        if (isEmpty(nx, ny)) {
                            createPixel("fire", nx, ny);
                        } else {
                            deletePixel(nx, ny);
                        }
                    }
                }
            }
        }
    },
    tick: function(pixel) {
        // Eat surrounding materials except water and mayo
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx !== 0 || dy !== 0) {
                    const nx = pixel.x + dx;
                    const ny = pixel.y + dy;
                    const neighbor = pixelMap[nx]?.[ny];
                    if (neighbor && neighbor.element !== "limo" && neighbor.element !== "fire" && neighbor.element !== "water" && neighbor.element !== "mayo") {
                        deletePixel(nx, ny);
                    }
                }
            }
        }

        // Slowly grow in size over time
        if (Math.random() < 0.01) { // 1% chance per tick to grow
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    let nx = pixel.x + dx;
                    let ny = pixel.y + dy;
                    if (isEmpty(nx, ny)) {
                        createPixel("limo", nx, ny);
                    }
                }
            }
        }
    }
};
