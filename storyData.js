/* ========================================
    STORYDATA.JS - COMPLETE VERSION
   ======================================== */

/**
 * @constant {object} storyData
 * @description Defines the narrative structure of the game.
 * Each key represents a major world or theme (e.g., "medieval village").
 * The value is an array of strings, where each string is a specific location or scene within that world.
 * This object is used to dynamically generate navigation and story progression.
 */
const storyData = {
  "medieval village": ["Inn", "Guild", "Palace"],
  "Sky Islands": ["Lake", "Forest", "Dragon"],
  "Futuristic City": ["Cafe", "Train Station", "Bunker"],
};

/**
 * @constant {object} soundMap
 * @description Maps simple, descriptive keys (e.g., "zap", "win") to their corresponding sound file paths.
 * This allows for easy reference and playback of sound effects throughout the application.
 * Note the use of a full URL for 'click' as a reliable default, while others point to local files in a 'sounds' folder.
 */
const soundMap = {
  click:
    "https://google-samples.github.io/web-fundamentals/fundamentals/media/sound/sounds/button-press.wav", // Kept as a reliable default
  zap: "sounds/zap.mp3",
  win: "sounds/win.mp3",
  magic: "sounds/magic.mp3",
  splash: "sounds/splash.mp3",
  roar: "sounds/roar.mp3",
  beep: "sounds/beep.mp3",
  chime: "sounds/chime.mp3",
  flip: "sounds/flip.mp3",
};

/**
 * @constant {object} musicMap
 * @description Maps theme names (e.g., "medieval") to their background music file paths.
 * This is used to play ambient music that matches the current game world or theme.
 * The keys are designed to be easily associated with the worlds defined in `storyData`.
 */
const musicMap = {
  medieval: "sounds/medieval.mp3",
  sky: "sounds/blue-sky-231778.mp3",
  futuristic: "sounds/futuristic_city.mp3",
};

/**
 * @constant {object} backgroundMap
 * @description A nested object that maps worlds and their specific locations to background image URLs.
 * Each top-level key corresponds to a world from `storyData`.
 * The value is another object where:
 * - The 'default' key holds the URL for the world's main background.
 * - Other keys (e.g., 'inn', 'lake') match the locations from `storyData` and hold URLs for their specific backgrounds.
 */
const backgroundMap = {
  "medieval village": {
    default:
      "https://image.slidesdocs.com/responsive-images/background/fantastical-medieval-village-brought-to-life-through-stunning-digital-art-and-3d-rendering-powerpoint-background_3ff779d676__960_540.jpg",
    inn: "https://media.istockphoto.com/id/1390674666/photo/medieval-inn-dining-area-lit-by-candlelight-and-daylight-through-windows-with-food-and-drink.jpg?s=612x612&w=0&k=20&c=y_luHiN1ioXpfbs-CnyNI7W47N3gVS1y24yTEjpFvM0=",
    guild:
      "https://knightstemplar.co/wp-content/uploads/2023/10/Medieval-Guilds-and-Their-Roles.jpg",
    palace:
      "https://knightstemplar.co/wp-content/uploads/2023/10/rooms-in-a-medieval-castle.jpg",
  },
  "Sky Islands": {
    default:
      "https://img.freepik.com/premium-photo/group-islands-floating-sky-with-medievalstyle-buildings-ships_14117-462487.jpg",
    lake: "https://th.bing.com/th/id/OIP.RqS7tlSB9hF1yUi-NfOfwwHaEK?rs=1&pid=ImgDetMain&cb=idpwebp2&o=7&rm=3",
    forest: "https://wallpaperaccess.com/full/5888066.jpg",
    dragon:
      "https://th.bing.com/th/id/OIP.i80gHadCqKDpRjU17bOdPAHaEo?rs=1&pid=ImgDetMain&cb=idpwebp2&o=7&rm=3",
  },
  "Futuristic City": {
    default: "https://i.redd.it/f6bompvjyie11.jpg",
    cafe: "https://cdn.openart.ai/stable_diffusion/0e2ac483f85e3076ff804a8d0d663039dfe2f05a_2000x2000.webp",
    "train station":
      "https://th.bing.com/th/id/OIP.FO-x439jjhYLsHLGApHh2wHaEK?rs=1&pid=ImgDetMain&cb=idpwebp2&o=7&rm=3",
    bunker: "https://gcdn.daz3d.com/p/90453/i/kujscificorridor02daz3d.jpg",
  },
};

/**
 * @constant {object} achievements
 * @description A collection of all possible achievements a player can earn in the game.
 * Each key is a unique identifier for an achievement (e.g., 'riddleSolver').
 * The value is an object containing the achievement's details:
 * - `name`: The display name of the achievement.
 * - `description`: A brief explanation of how the achievement is earned.
 * - `unlocked`: A boolean flag indicating whether the player has earned it yet. Initialized to `false`.
 * - `icon`: A string representing a Font Awesome icon class (e.g., 'fa-brain') for visual representation.
 */
const achievements = {
  explorer: {
    name: "The Explorer",
    description: "Began your grand adventure.",
    unlocked: false,
    icon: "fa-compass",
  },
  riddleSolver: {
    name: "Riddle Solver",
    description: "Outsmarted the innkeeper with wit.",
    unlocked: false,
    icon: "fa-brain",
  },
  potionMaster: {
    name: "Potion Master",
    description: "Brewed a potion in the Guild.",
    unlocked: false,
    icon: "fa-vial",
  },
  royalCrest: {
    name: "Royal Crest",
    description: "Passed the Royal Guard's test.",
    unlocked: false,
    icon: "fa-shield-alt",
  },
  forestMemory: {
    name: "Forest Memory",
    description: "Matched the glowing symbols of the forest.",
    unlocked: false,
    icon: "fa-seedling",
  },
  stoneListener: {
    name: "Stone Listener",
    description: "Repeated the sequence of the Whispering Stones.",
    unlocked: false,
    icon: "fa-assistive-listening-systems",
  },
  celestialMapper: {
    name: "Celestial Mapper",
    description: "Solved the constellation puzzle.",
    unlocked: false,
    icon: "fa-star",
  },
  powerRestored: {
    name: "Power Restored",
    description: "Rerouted power in the bunker.",
    unlocked: false,
    icon: "fa-plug",
  },
  routePlanner: {
    name: "Route Planner",
    description: "Plotted the correct maglev train route.",
    unlocked: false,
    icon: "fa-project-diagram",
  },
  freedomFighter: {
    name: "Freedom Fighter",
    description: "Hacked a terminal for the Resistance.",
    unlocked: false,
    icon: "fa-fist-raised",
  },
};
