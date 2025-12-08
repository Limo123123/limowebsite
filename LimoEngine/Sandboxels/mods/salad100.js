// Define the Salad Dressing element (which is sperm in reality)
elements.salad_dressing = {
    color: "#FFFACD", // Light off-white color
    behavior: behaviors.LIQUID, // It behaves like a liquid
    category: "liquids", // Categorized under liquids
    state: "liquid", // The state is liquid
    density: 1040, // Similar to water, but slightly denser
    viscosity: 0.5, // Adjust viscosity to make it slightly sticky like fluids
    reactions: {
        "water": { elem1: "water", elem2: "salad_dressing", chance: 0.1 }, // Low chance to mix with water
        "heat": { tempHigh: 50, stateHigh: "boiled_salad_dressing" } // Turns into boiled form at 50°C
    },
    tempHigh: 50, // Boils at 50 degrees Celsius
    stateHigh: "boiled_salad_dressing", // What it turns into when boiled
    burn: 10, // Low chance of burning
    burnTime: 100, // It can burn for 100 ticks
    burnInto: "charcoal", // Turns into charcoal when burned
};

// Define the boiled version
elements.boiled_salad_dressing = {
    color: "#E0E0E0", // Duller white for the boiled version
    behavior: behaviors.LIQUID, // Still behaves like a liquid
    category: "liquids",
    state: "liquid",
    density: 1000,
    viscosity: 0.8,
    burn: 5, // Still burnable but with a lower chance
    burnTime: 50,
    burnInto: "ash", // Burns into ash
};
