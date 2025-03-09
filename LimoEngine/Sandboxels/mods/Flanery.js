elements.flanery = {
    color: "#0000FF", // Blue color in hex code
    behavior: [
        "XX|XX|XX",
        "XX|CL|XX", // CL for Cloning itself
        "XX|XX|XX"
    ],
    category: "special",
    state: "solid",
    reactions: {
        "fire": { elem1: "ash", elem2: null } // Turns into ash when reacting with fire
    },
    tick: function(pixel) {
        // Increased cloning probability slightly, but still low
        if (Math.random() < 0.02) { // 2% chance each tick to clone itself
            let xOffset = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
            let yOffset = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
            let newX = pixel.x + xOffset;
            let newY = pixel.y + yOffset;

            // Only clone if the target position is empty
            if (isEmpty(newX, newY)) {
                createPixel("flanery", newX, newY);
            }
        }
    }
};
