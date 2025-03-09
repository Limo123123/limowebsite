elements.alpaka_schu = {
    color: "#8A2BE2",  // A unique color for the element
    behavior: [
        ["XX", "XX", "XX"],
        ["XX", "XX", "XX"],
        ["XX", "XX", "XX"]
    ],
    category: "special",
    state: "solid",
    reactions: {
        "laser": { elem1: null, elem2: null } // Destroyed by laser
    },
    tick: function(pixel) {
        if (Math.random() < 0.01) { // 1% chance per tick to multiply
            // Random position for new Alpaka Schu anywhere on the map
            let x = Math.floor(Math.random() * width); // Random x position within canvas width
            let y = Math.floor(Math.random() * height); // Random y position within canvas height
            if (isEmpty(x, y)) {
                createPixel("alpaka_schu", x, y);
            }
        }
    },
    tempHigh: 1500,
    stateHigh: "vaporized_alpaka_schu",
    density: 2.7,
};
