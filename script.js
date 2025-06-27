/* ========================================
    SCRIPT.JS - COMPLETE VERSION
   ======================================== */

// --- Global variables, DOM elements, and Game state variables ---
let playerAdventureScore = 0;
const adventureRecap = [];
const choiceHistory = [];
let playerInventory = [];
const unlockedAchievements = new Set();
const storyTextElement = document.getElementById("story-text");
const choicesContainerElement = document.getElementById("choices-container");
const inputContainerElement = document.getElementById("input-container");
const playerInputElement = document.getElementById("player-input");
const submitButton = document.getElementById("submit-btn");
const welcomeSectionElement = document.getElementById("welcome-section");
const storySectionElement = document.getElementById("story-section");
const startButton = document.getElementById("start-btn");
const playerNameInputElement = document.getElementById("player-name");
const mainContainerElement = document.getElementById("main-container");
const typingProgressBar = document.getElementById("typing-progress");
const backgroundMusicElement = document.getElementById("background-music");
const backgroundContainerElement = document.getElementById(
  "background-container"
);
const statusPlayerNameElement = document.getElementById("status-player-name");
const statusPlayerScoreElement = document.getElementById("status-player-score");
const inventoryListElement = document.getElementById("inventory-list");
const achievementsListElement = document.getElementById("achievements-list");
const puzzleModalElement = document.getElementById("puzzleModal");
const puzzleTitleElement = document.getElementById("puzzleModalLabel");
const puzzleInstructionsElement = document.getElementById(
  "puzzle-instructions"
);
const puzzleContentElement = document.getElementById("puzzle-content");
const puzzleFeedbackElement = document.getElementById("puzzle-feedback");
const puzzleSubmitButton = document.getElementById("puzzle-submit-btn");
const puzzleHintButton = document.getElementById("puzzle-hint-btn");
const confettiCanvas = document.getElementById("confetti-canvas");
const myConfetti = confetti.create(confettiCanvas, {
  resize: true,
  useWorker: true,
});

// Updated Navbar element selectors
const navbarDashboardBtn = document.getElementById("dashboard-btn");
const navbarStopBtn = document.getElementById("navbar-stop-btn");
const navbarRestartBtn = document.getElementById("navbar-restart-btn");
const musicToggleButton = document.getElementById("navbar-music-toggle");
const soundToggleButton = document.getElementById("navbar-sound-toggle");
const volumeSlider = document.getElementById("volume-slider");
const volumeIndicator = document.getElementById("volume-indicator");

// New Modal Content Selectors
const playerDetailModalElement = document.getElementById("playerDetailModal");
const detailPlayerName = document.getElementById("detail-player-name");
const detailPlayerRank = document.getElementById("detail-player-rank");
const detailAchievementsList = document.getElementById(
  "detail-achievements-list"
);
const detailItemsList = document.getElementById("detail-items-list");

let playerName = "";
let currentSetting = "";
let currentLocation = "";
let storyEventQueue = [];
let animationTypingSpeed = 40;
let isTextAnimating = false;
let isMusicMuted = false;
let isSoundMuted = false;
let activePuzzle = {
  id: null,
  onSuccess: null,
  onFailure: null,
  solution: null,
  playerInput: [],
  isTextInput: false,
  hint: "",
};
let puzzleModal;
let audioCache = {}; // For pre-loading sounds

const itemInfo = {
  "Wizard's Key": "A strange key from the Guild. It feels warm to the touch.",
  "Potion of Might":
    "A swirling golden liquid that smells of ozone and courage.",
  "Magic Starry Key": "This key glitters with the light of a thousand stars.",
  "Forest Blessing": "A faint, calming aura surrounds you.",
  "Encrypted Data Chip": "A futuristic chip containing vital Resistance data.",
};

// Demo data for the leaderboard
const demoPlayers = [
  {
    name: "Aria the Bold",
    score: 175,
    achievements: [
      "Potion Master",
      "Royal Crest",
      "Freedom Fighter",
      "Celestial Mapper",
    ],
    items: ["Potion of Might", "Magic Starry Key"],
  },
  {
    name: "Kael the Swift",
    score: 120,
    achievements: ["Riddle Solver", "Forest Memory"],
    items: ["Wizard's Key", "Forest Blessing"],
  },
  {
    name: "Nexus-7",
    score: 95,
    achievements: ["Route Planner", "Power Restored"],
    items: ["Encrypted Data Chip"],
  },
];

// --- Audio & Visual Functions ---
function preloadSounds() {
  for (const key in soundMap) {
    audioCache[key] = new Audio(soundMap[key]);
  }
}
function setVolume(level) {
  backgroundMusicElement.volume = level;
  for (const key in audioCache) {
    audioCache[key].volume = level;
  }
  volumeIndicator.textContent = `${Math.round(level * 100)}%`;
}
function toggleMusic() {
  isMusicMuted = !isMusicMuted;
  const icon = musicToggleButton.querySelector("i");
  if (isMusicMuted) {
    backgroundMusicElement.pause();
    icon.className = "fas fa-volume-mute";
  } else {
    backgroundMusicElement
      .play()
      .catch((e) => console.error("Music play failed:", e));
    icon.className = "fas fa-music";
  }
}
function toggleSound() {
  isSoundMuted = !isSoundMuted;
  const icon = soundToggleButton.querySelector("i");
  icon.className = isSoundMuted ? "fas fa-volume-mute" : "fas fa-volume-up";
}
function playSound(soundName) {
  if (!isSoundMuted && audioCache[soundName]) {
    audioCache[soundName].currentTime = 0;
    audioCache[soundName]
      .play()
      .catch((e) => console.log("Sound playback error:", e));
  }
}
function playMusic(theme) {
  if (theme && musicMap[theme]) {
    backgroundMusicElement.src = musicMap[theme];
    if (!isMusicMuted) {
      backgroundMusicElement
        .play()
        .catch((e) => console.log("Music playback error:", e));
    }
  }
}
function setBackgroundImage(setting, location) {
  const imageUrl =
    backgroundMap[setting]?.[location?.toLowerCase()] ||
    backgroundMap[setting]?.default ||
    "";
  if (imageUrl)
    backgroundContainerElement.style.backgroundImage = `url('${imageUrl}')`;
}
function setTheme(setting) {
  if (!mainContainerElement) return;
  const musicKey = setting.toLowerCase().split(" ")[0];
  playMusic(musicKey);
  setBackgroundImage(setting);
}

// --- Story Queue & Display Functions ---
function addToStoryQueue(eventText, eventChoices = null, eventCallback = null) {
  storyEventQueue.push({
    text: eventText,
    choices: eventChoices,
    callback: eventCallback,
  });
}
function clearStoryQueue() {
  storyEventQueue = [];
}
function processStoryQueue() {
  if (storyEventQueue.length === 0 || isTextAnimating) return;
  const currentEvent = storyEventQueue.shift();
  typeWriterEffect(currentEvent.text, () => {
    if (currentEvent.choices && currentEvent.choices.length > 0) {
      displayChoices(currentEvent.choices, currentEvent.callback);
    } else if (currentEvent.callback) {
      currentEvent.callback();
    } else {
      setTimeout(processStoryQueue, 1000);
    }
  });
}
function typeWriterEffect(displayText, onComplete) {
  if (!storyTextElement) return;
  isTextAnimating = true;
  const maxParagraphLimit = 8;
  const existingParagraphs = storyTextElement.querySelectorAll("p");
  if (existingParagraphs.length >= maxParagraphLimit) {
    for (let i = 0; i <= existingParagraphs.length - maxParagraphLimit; i++) {
      existingParagraphs[i]?.remove();
    }
  }
  storyTextElement.insertAdjacentHTML("beforeend", "<p></p>");
  const currentParagraph = storyTextElement.lastElementChild;
  let charIndex = 0;
  const typingInterval = setInterval(() => {
    if (charIndex < displayText.length) {
      currentParagraph.textContent += displayText.charAt(charIndex);
      charIndex++;
      typingProgressBar.style.width = `${
        (charIndex / displayText.length) * 100
      }%`;
      storyTextElement.scrollTop = storyTextElement.scrollHeight;
    } else {
      clearInterval(typingInterval);
      isTextAnimating = false;
      typingProgressBar.style.width = "0%";
      onComplete?.();
    }
  }, animationTypingSpeed);
}
function displayChoices(choiceOptions, choiceCallback) {
  if (!choicesContainerElement) return;
  choicesContainerElement.innerHTML = "";
  const colorClasses = ["", "-green", "-purple", "-orange"];
  choiceOptions.forEach((option, index) => {
    const choiceButton = document.createElement("button");
    const colorModifier = colorClasses[index % colorClasses.length];
    choiceButton.className = `btn btn-primary choice-btn choice-btn${colorModifier}`;
    choiceButton.textContent = option;
    choiceButton.addEventListener("click", () => {
      playSound("click");
      choiceHistory.push(option);
      choicesContainerElement.innerHTML = "";
      const processedChoice = option.toLowerCase().replace(/[^a-z0-9]/g, "");
      choiceCallback?.(processedChoice);
      processStoryQueue();
    });
    choicesContainerElement.appendChild(choiceButton);
  });
}

// --- UI Panel, Navbar, and Puzzle Functions ---

function getPlayerRank(score) {
  if (score >= 150) return "Legend";
  if (score >= 100) return "Veteran";
  if (score >= 50) return "Adventurer";
  return "Novice";
}

function updateStatusPanel() {
  // Update side panel
  if (statusPlayerNameElement) statusPlayerNameElement.textContent = playerName;
  if (statusPlayerScoreElement)
    statusPlayerScoreElement.textContent = playerAdventureScore;
}

function updateLeaderboard() {
  const leaderboardBody = document.getElementById("leaderboard-body");
  if (!leaderboardBody) return;

  // Combine current player with demo players
  const allPlayers = [
    {
      name: playerName,
      score: playerAdventureScore,
      achievements: Array.from(unlockedAchievements).map(
        (id) => achievements[id].name
      ),
      items: playerInventory,
    },
    ...demoPlayers,
  ];

  // Sort players by score
  allPlayers.sort((a, b) => b.score - a.score);

  // Clear previous entries
  leaderboardBody.innerHTML = "";

  // Create and append new rows
  allPlayers.forEach((player, index) => {
    const rank = index + 1;
    const rankIcon =
      rank === 1
        ? "fas fa-crown text-warning"
        : rank === 2
        ? "fas fa-medal text-secondary"
        : rank === 3
        ? "fas fa-award"
        : "";

    const row = document.createElement("tr");
    // Add data attributes to the row for the detail modal
    row.setAttribute("data-bs-toggle", "modal");
    row.setAttribute("data-bs-target", "#playerDetailModal");
    row.setAttribute("data-player-name", player.name);
    row.setAttribute("data-player-rank", getPlayerRank(player.score));
    row.setAttribute("data-player-achievements", player.achievements.join(","));
    row.setAttribute("data-player-items", player.items.join(","));

    row.innerHTML = `
            <th scope="row">${rank} <i class="${rankIcon}"></i></th>
            <td>${player.name} ${player.name === playerName ? "(You)" : ""}</td>
            <td>${player.score}</td>
            <td>${player.achievements.length}</td>
            <td>${player.items.length}</td>
        `;
    leaderboardBody.appendChild(row);
  });
}

function addItemToInventory(itemName) {
  if (!playerInventory.includes(itemName)) {
    playerInventory.push(itemName);
    updateInventoryUI();
    addToStoryQueue(`[You acquired: ${itemName}]`);
  }
}
function updateInventoryUI() {
  if (!inventoryListElement) return;
  inventoryListElement.innerHTML = "";
  if (playerInventory.length === 0) {
    inventoryListElement.innerHTML =
      '<li class="inventory-placeholder">No items yet...</li>';
  } else {
    playerInventory.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      if (itemInfo[item]) {
        li.setAttribute("data-info", itemInfo[item]);
      }
      inventoryListElement.appendChild(li);
    });
  }
}
function unlockAchievement(achievementId) {
  if (achievements[achievementId] && !unlockedAchievements.has(achievementId)) {
    unlockedAchievements.add(achievementId);
    achievements[achievementId].unlocked = true;
    updateAchievementsUI();
    playSound("win");
    myConfetti({ particleCount: 150, spread: 180, origin: { y: 0.6 } });
    const newAchievementElement = document.getElementById(
      `achievement-${achievementId}`
    );
    if (newAchievementElement) {
      newAchievementElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
    const achievement = achievements[achievementId];
    addToStoryQueue(`🏆 Achievement Unlocked: ${achievement.name}!`);
  }
}

function updateAchievementsUI() {
  if (!achievementsListElement) return;
  achievementsListElement.innerHTML = "";
  const sortedAchievementIds = Object.keys(achievements).sort((a, b) => {
    const aUnlocked = achievements[a].unlocked;
    const bUnlocked = achievements[b].unlocked;
    return bUnlocked - aUnlocked;
  });
  sortedAchievementIds.forEach((id) => {
    const achievement = achievements[id];
    const li = document.createElement("li");
    li.id = `achievement-${id}`;
    li.className = achievement.unlocked
      ? "achievement-unlocked"
      : "achievement-locked";
    li.innerHTML = `
      <div class="achievement-icon"><i class="fas ${achievement.icon}"></i></div>
      <div class="achievement-details">
        <h6>${achievement.name}</h6>
        <p>${achievement.description}</p>
      </div>`;
    achievementsListElement.appendChild(li);
  });
}

function showPuzzle(puzzleId, onSuccess, onFailure) {
  // Reset hint button state
  if (puzzleHintButton) {
    puzzleHintButton.disabled = false;
    puzzleHintButton.classList.remove("hint-used");
  }

  activePuzzle.id = puzzleId;
  activePuzzle.onSuccess = onSuccess;
  activePuzzle.onFailure = onFailure;
  activePuzzle.playerInput = [];
  activePuzzle.isTextInput = false;
  puzzleFeedbackElement.textContent = "";
  puzzleFeedbackElement.style.color = "white";
  puzzleSubmitButton.style.display = "block";
  puzzleSubmitButton.onclick = checkPuzzleAnswer;
  puzzleSubmitButton.textContent = "Submit Answer";
  puzzleHintButton.disabled = false;

  setupPuzzle(puzzleId);
  if (!puzzleModal) {
    puzzleModal = new bootstrap.Modal(puzzleModalElement);
  }
  puzzleModal.show();
}

function setupPuzzle(puzzleId) {
  puzzleContentElement.innerHTML = "";
  const hints = {
    medievalRunePuzzle:
      "Hint: The order follows the cycle of a day, as mentioned by the masons.",
    medievalPotionPuzzle:
      "Hint: The recipe is literal. Find ingredients that sound like 'fire', 'tear', and 'light'.",
    medievalRiddlePuzzle:
      "Hint: It's something a traveler uses to find their way without getting lost.",
    skyConstellationPuzzle:
      "Hint: The star chart you found showed the serpent's stars numbered from head to tail.",
    skyMusicPuzzle:
      "Hint: The turtle mentioned the sounds of nature in a specific order: Music, Bell, then Bolt.",
    skyMemoryPuzzle:
      "Hint: Be patient. Flip one card and try to remember its symbol before seeking its match.",
    futuristicHackPuzzle:
      "Hint: The Resistance mentioned a 'Tricolor Protocol'. The sequence is three steps long.",
    futuristicRoutePuzzle:
      "Hint: The announcement gave three locations in order: Departure, Junction, and Arrival.",
    futuristicConduitPuzzle:
      "Hint: The goal is one continuous, connected line from the lightning bolt (⚡) to the light bulb (💡).",
  };
  activePuzzle.hint = hints[puzzleId] || "No hint available for this puzzle.";

  switch (puzzleId) {
    case "medievalRunePuzzle":
      puzzleTitleElement.textContent = "The Royal Guard's Test";
      puzzleInstructionsElement.textContent =
        "To prove your worth, you must trace the royal crest. Select the three ancient runes in the correct order.";
      activePuzzle.solution = ["☀️", "🌙", "⭐"];
      const runes = ["⚔️", "🌙", "🛡️", "☀️", "👑", "⭐"].sort(
        () => Math.random() - 0.5
      );
      const runeGrid = document.createElement("div");
      runeGrid.className = "rune-grid";
      runes.forEach((rune) => {
        const cell = document.createElement("div");
        cell.className = "rune-cell";
        cell.textContent = rune;
        cell.addEventListener("click", () => {
          if (activePuzzle.playerInput.length < 3) {
            cell.classList.add("selected");
            activePuzzle.playerInput.push(rune);
          }
        });
        runeGrid.appendChild(cell);
      });
      puzzleContentElement.appendChild(runeGrid);
      break;

    case "medievalPotionPuzzle":
      puzzleTitleElement.textContent = "The Alchemist's Task";
      puzzleInstructionsElement.textContent =
        "The wizard's note gives a cryptic recipe. Click the ingredients in the correct order to brew the potion.";
      activePuzzle.solution = ["fire", "tear", "light"];
      const ingredients = [
        { name: "Dragon's Chili", id: "fire" },
        { name: "Glow Worm", id: "worm" },
        { name: "Spider Silk Dew", id: "tear" },
        { name: "Sunstone", id: "light" },
      ].sort(() => Math.random() - 0.5);
      const ingredientBox = document.createElement("div");
      ingredientBox.className = "potion-ingredients";
      ingredients.forEach((ing) => {
        const item = document.createElement("div");
        item.className = "ingredient";
        item.textContent = ing.name;
        item.addEventListener("click", () => {
          if (activePuzzle.playerInput.length < 3) {
            item.classList.add("selected");
            activePuzzle.playerInput.push(ing.id);
          }
        });
        ingredientBox.appendChild(item);
      });
      puzzleContentElement.appendChild(ingredientBox);
      break;

    case "medievalRiddlePuzzle":
      puzzleTitleElement.textContent = "The Innkeeper's Challenge";
      puzzleInstructionsElement.textContent =
        "The innkeeper leans forward. 'You look clever. Solve my riddle, and a secret is yours. What has cities, but no houses; mountains, but no trees; and water, but no fish?'";
      activePuzzle.solution = "map";
      activePuzzle.isTextInput = true;
      const riddleInput = `<div class="riddle-input-group"><input type="text" id="riddle-answer" class="form-control input-field" placeholder="Type your one-word answer..."></div>`;
      puzzleContentElement.innerHTML = riddleInput;
      setTimeout(() => document.getElementById("riddle-answer")?.focus(), 500);
      break;

    case "skyConstellationPuzzle":
      puzzleTitleElement.textContent = "The Dragon's Riddle";
      puzzleInstructionsElement.textContent =
        "Trace the path of the Winged Serpent constellation. Connect the stars from head to tail (1 to 4).";
      activePuzzle.solution = ["1", "2", "3", "4"];
      const constellationMap = document.createElement("div");
      constellationMap.className = "constellation-map";
      const stars = [
        [30, 20, "1"],
        [50, 60, "2"],
        [80, 35, "3"],
        [120, 70, "4"],
        [70, 85, "X"],
      ];
      stars.forEach(([top, left, id]) => {
        const star = document.createElement("div");
        star.className = "star";
        star.style.top = `${top}%`;
        star.style.left = `${left}%`;
        star.dataset.id = id;
        const label = document.createElement("span");
        label.className = "star-label";
        label.textContent = id;
        star.appendChild(label);
        star.addEventListener("click", () => {
          if (!star.classList.contains("selected")) {
            star.classList.add("selected");
            activePuzzle.playerInput.push(id);
          }
        });
        constellationMap.appendChild(star);
      });
      puzzleContentElement.appendChild(constellationMap);
      break;

    case "skyMusicPuzzle":
      puzzleTitleElement.textContent = "The Whispering Stones";
      puzzleInstructionsElement.textContent =
        "The ancient stones hum with a secret melody. Listen to the sequence, then repeat it by clicking the stones.";
      puzzleSubmitButton.style.display = "none";
      setupMusicGame();
      break;

    case "skyMemoryPuzzle":
      puzzleTitleElement.textContent = "The Forest's Echo";
      puzzleInstructionsElement.textContent =
        "The ancient trees present a challenge of memory. Find the matching pairs of glowing symbols.";
      puzzleSubmitButton.style.display = "none";
      setupMemoryGame();
      break;

    case "futuristicHackPuzzle":
      puzzleTitleElement.textContent = "Terminal Security Bypass";
      puzzleInstructionsElement.textContent =
        "The terminal requires a sequential access code. Watch the pattern, then repeat it.";
      setupHackingGame();
      break;

    case "futuristicRoutePuzzle":
      puzzleTitleElement.textContent = "Maglev Route Planner";
      puzzleInstructionsElement.textContent =
        "The terminal announces the express route. Plot the course on the grid!";
      activePuzzle.solution = ["gamma", "x7", "alpha"];
      const pads = ["Alpha", "Beta", "Gamma", "X-7", "Y-9", "Z-2"].sort(
        () => Math.random() - 0.5
      );
      const routeGrid = document.createElement("div");
      routeGrid.className = "route-grid";
      pads.forEach((id) => {
        const pad = document.createElement("div");
        pad.className = "route-pad";
        pad.textContent = id;
        pad.addEventListener("click", () => {
          if (activePuzzle.playerInput.length < 3) {
            pad.classList.add("selected");
            activePuzzle.playerInput.push(
              id.toLowerCase().replace(/[^a-z0-9]/g, "")
            );
          }
        });
        routeGrid.appendChild(pad);
      });
      puzzleContentElement.appendChild(routeGrid);
      break;

    case "futuristicConduitPuzzle":
      puzzleTitleElement.textContent = "Power Conduit Reroute";
      puzzleInstructionsElement.textContent =
        "Rotate the pipes to create an unbroken circuit from the source (⚡) to the emitter (💡).";
      puzzleSubmitButton.textContent = "Activate Power";
      setupConduitGame();
      break;
  }
}

function checkPuzzleAnswer() {
  if (activePuzzle.isTextInput) {
    const answer = document
      .getElementById("riddle-answer")
      ?.value.trim()
      .toLowerCase();
    activePuzzle.playerInput = [answer];
  }
  let isCorrect =
    JSON.stringify(activePuzzle.playerInput) ===
    JSON.stringify(activePuzzle.solution);
  if (activePuzzle.isTextInput) {
    isCorrect = activePuzzle.playerInput[0] === activePuzzle.solution;
  }

  if (isCorrect) {
    puzzleFeedbackElement.textContent = "Success!";
    puzzleFeedbackElement.style.color = "#4dff6d";
    playSound("win");
    setTimeout(() => {
      puzzleModal.hide();
      activePuzzle.onSuccess();
    }, 1500);
  } else {
    puzzleFeedbackElement.textContent = "That's not right. Try again.";
    puzzleFeedbackElement.style.color = "#ff4d4d";
    playSound("beep");
    activePuzzle.playerInput = [];
    document
      .querySelectorAll(".selected")
      .forEach((el) => el.classList.remove("selected"));
  }
}

function showHint() {
  if (!puzzleHintButton || puzzleHintButton.disabled) return;

  // Deduct points only if this is the first hint request
  if (!puzzleHintButton.classList.contains("hint-used")) {
    playerAdventureScore = Math.max(0, playerAdventureScore - 5); // Ensure score doesn't go negative
    updateStatusPanel();
    adventureRecap.push("Used a hint (-5 pts)");
    puzzleHintButton.classList.add("hint-used");
  }

  puzzleFeedbackElement.textContent = activePuzzle.hint;
  puzzleFeedbackElement.style.color = "#7bb5ff";
  playSound("chime");
}

function setupMusicGame() {
  const tones = ["fa-music", "fa-bell", "fa-bolt", "fa-leaf"];
  const solution = [tones[0], tones[1], tones[2]];
  const stoneCircle = document.createElement("div");
  stoneCircle.className = "stone-circle";
  let playerInput = [];
  tones.forEach((tone) => {
    const stone = document.createElement("div");
    stone.className = "whispering-stone";
    stone.innerHTML = `<i class="fas ${tone}"></i>`;
    stoneCircle.appendChild(stone);
    stone.addEventListener("click", () => {
      stone.classList.add("active");
      playSound("chime");
      setTimeout(() => stone.classList.remove("active"), 300);
      playerInput.push(tone);
      if (playerInput.length === solution.length) {
        checkMusicAnswer();
      }
    });
  });
  puzzleContentElement.appendChild(stoneCircle);
  function checkMusicAnswer() {
    if (JSON.stringify(playerInput) === JSON.stringify(solution)) {
      puzzleFeedbackElement.textContent = "The melody is complete!";
      puzzleFeedbackElement.style.color = "#4dff6d";
      playSound("win");
      setTimeout(() => {
        puzzleModal.hide();
        activePuzzle.onSuccess();
      }, 1500);
    } else {
      puzzleFeedbackElement.textContent =
        "The stones fall silent. The sequence was wrong.";
      puzzleFeedbackElement.style.color = "#ff4d4d";
      playSound("beep");
      playerInput = [];
    }
  }
}

function setupMemoryGame() {
  const symbols = [
    "fa-leaf",
    "fa-feather-alt",
    "fa-sun",
    "fa-moon",
    "fa-leaf",
    "fa-feather-alt",
    "fa-sun",
    "fa-moon",
  ];
  symbols.sort(() => Math.random() - 0.5);
  let flippedCards = [];
  let matchedPairs = 0;
  let lockBoard = false;
  const grid = document.createElement("div");
  grid.className = "memory-grid";
  symbols.forEach((symbol) => {
    const card = document.createElement("div");
    card.className = "memory-card";
    card.innerHTML = `
      <div class="card-face card-face-front"><i class="fas fa-question"></i></div>
      <div class="card-face card-face-back"><i class="fas ${symbol}"></i></div>`;
    card.dataset.symbol = symbol;
    card.addEventListener("click", () => {
      if (
        lockBoard ||
        flippedCards.length >= 2 ||
        card.classList.contains("is-flipped")
      )
        return;
      playSound("flip");
      card.classList.add("is-flipped");
      flippedCards.push(card);
      if (flippedCards.length === 2) {
        lockBoard = true;
        setTimeout(checkMatch, 1000);
      }
    });
    grid.appendChild(card);
  });
  puzzleContentElement.appendChild(grid);
  function checkMatch() {
    if (flippedCards[0].dataset.symbol === flippedCards[1].dataset.symbol) {
      playSound("chime");
      matchedPairs++;
      if (matchedPairs === symbols.length / 2) {
        puzzleFeedbackElement.textContent = "A perfect match!";
        puzzleFeedbackElement.style.color = "#4dff6d";
        setTimeout(() => {
          puzzleModal.hide();
          activePuzzle.onSuccess();
        }, 1500);
      }
      flippedCards = [];
      lockBoard = false;
    } else {
      playSound("beep");
      flippedCards[0].classList.remove("is-flipped");
      flippedCards[1].classList.remove("is-flipped");
      flippedCards = [];
      lockBoard = false;
    }
  }
}

function setupConduitGame() {
  const grid = document.createElement("div");
  grid.className = "conduit-grid";
  const pipeImages = [
    "https://cdn4.iconfinder.com/data/icons/plumber-cartoon/512/val73_13-512.png",
    "https://static.vecteezy.com/system/resources/previews/014/351/064/large_2x/angle-pipe-icon-cartoon-style-vector.jpg",
  ];
  for (let i = 0; i < 16; i++) {
    let cell;
    if (i === 0) {
      cell = document.createElement("div");
      cell.className = "source-pipe";
      cell.innerHTML = '<i class="fas fa-bolt"></i>';
    } else if (i === 15) {
      cell = document.createElement("div");
      cell.className = "emitter-pipe";
      cell.innerHTML = '<i class="fas fa-lightbulb"></i>';
    } else {
      cell = document.createElement("div");
      cell.className = "pipe";
      const isCorner = Math.random() > 0.4;
      cell.style.backgroundImage = `url(${
        isCorner ? pipeImages[1] : pipeImages[0]
      })`;
      let rotation = Math.floor(Math.random() * 4) * 90;
      cell.style.transform = `rotate(${rotation}deg)`;
      cell.addEventListener("click", () => {
        rotation = (rotation + 90) % 360;
        cell.style.transform = `rotate(${rotation}deg)`;
        playSound("click");
      });
    }
    grid.appendChild(cell);
  }
  puzzleContentElement.appendChild(grid);
  puzzleSubmitButton.onclick = () => {
    const emitter = grid.childNodes[15];
    if (emitter) {
      emitter.style.color = "#00ffff";
      emitter.style.boxShadow = "0 0 20px #00ffff";
    }
    puzzleFeedbackElement.textContent = "System Powered!";
    puzzleFeedbackElement.style.color = "#4dff6d";
    playSound("win");
    setTimeout(() => {
      puzzleModal.hide();
      activePuzzle.onSuccess();
    }, 1500);
  };
}

function setupHackingGame() {
  puzzleSubmitButton.style.display = "none";
  const grid = document.createElement("div");
  grid.className = "hacking-grid";
  puzzleContentElement.appendChild(grid);
  const pads = ["green", "red", "yellow", "blue"];
  const colorPads = pads.map((color) => {
    const pad = document.createElement("div");
    pad.className = `hack-pad pad-${color}`;
    pad.dataset.color = color;
    pad.addEventListener("click", () => handlePadClick(color));
    grid.appendChild(pad);
    return pad;
  });
  const statusDisplay = document.createElement("div");
  statusDisplay.className = "hack-pad";
  statusDisplay.textContent = "STATUS: IDLE";
  grid.appendChild(statusDisplay);
  const startButtonEl = document.createElement("div");
  startButtonEl.className = "hack-pad";
  startButtonEl.textContent = "START";
  grid.appendChild(startButtonEl);
  let sequence = [];
  let playerSequence = [];
  let level = 0;
  const maxLevel = 3;
  startButtonEl.addEventListener("click", nextLevel);
  function nextLevel() {
    level++;
    playerSequence = [];
    statusDisplay.textContent = `LEVEL ${level}`;
    sequence.push(pads[Math.floor(Math.random() * 4)]);
    playSequence();
  }
  function playSequence() {
    let i = 0;
    grid.style.pointerEvents = "none";
    const interval = setInterval(() => {
      if (i >= sequence.length) {
        clearInterval(interval);
        grid.style.pointerEvents = "auto";
        return;
      }
      const pad = grid.querySelector(`.pad-${sequence[i]}`);
      pad.classList.add("active");
      playSound("click");
      setTimeout(() => pad.classList.remove("active"), 350);
      i++;
    }, 700);
  }
  function handlePadClick(color) {
    playerSequence.push(color);
    const pad = grid.querySelector(`.pad-${color}`);
    pad.classList.add("active");
    playSound("click");
    setTimeout(() => pad.classList.remove("active"), 200);
    const currentMoveIndex = playerSequence.length - 1;
    if (playerSequence[currentMoveIndex] !== sequence[currentMoveIndex]) {
      puzzleFeedbackElement.textContent = "Hack failed! System resetting...";
      puzzleFeedbackElement.style.color = "#ff4d4d";
      playSound("beep");
      setTimeout(() => {
        puzzleModal.hide();
        activePuzzle.onFailure();
      }, 2000);
      return;
    }
    if (playerSequence.length === sequence.length) {
      if (level === maxLevel) {
        puzzleFeedbackElement.textContent = "Bypass successful!";
        puzzleFeedbackElement.style.color = "#4dff6d";
        playSound("win");
        setTimeout(() => {
          puzzleModal.hide();
          activePuzzle.onSuccess();
        }, 1500);
      } else {
        setTimeout(nextLevel, 1000);
      }
    }
  }
}

// --- Game Flow & State Management ---

function toggleNavControls(enabled) {
  const links = [navbarDashboardBtn, navbarStopBtn, navbarRestartBtn];
  if (enabled) {
    links.forEach((link) => link.classList.remove("disabled"));
  } else {
    links.forEach((link) => link.classList.add("disabled"));
  }
}

function startAdventure() {
  playerName = playerNameInputElement?.value.trim() || "Explorer";
  currentSetting = selectRandomSetting();
  welcomeSectionElement?.classList.add("hidden");
  storySectionElement?.classList.remove("hidden");
  toggleNavControls(true);
  setTheme(currentSetting);
  updateHeader(currentSetting);
  updateStatusPanel();
  updateInventoryUI();
  updateAchievementsUI();

  clearStoryQueue();
  unlockAchievement("explorer");

  addToStoryQueue(
    `Greetings, ${playerName}! Welcome to your interactive adventure!`
  );
  addToStoryQueue(
    `Explore enchanting worlds—your choices craft a unique tale. Your mission: navigate back home while racking up points!`
  );
  addToStoryQueue(
    `You're wandering through a dark forest when a mysterious glow flickers ahead... you step closer—WHOOSH!—and you're pulled into the light!`
  );

  if (currentSetting === "medieval village") {
    addToStoryQueue(
      `You land in a medieval village teeming with magic and wonder!`,
      ["Explore", "Rest"],
      startMedievalVillage
    );
  } else if (currentSetting === "Sky Islands") {
    addToStoryQueue(
      `You find yourself on a vast island soaring among the clouds!`,
      ["Explore", "Rest"],
      startSkyIslands
    );
  } else if (currentSetting === "Futuristic City") {
    addToStoryQueue(
      `You arrive in a futuristic city alive with robots and neon brilliance!`,
      ["Explore", "Look around"],
      startFuturisticCity
    );
  }
  processStoryQueue();
}

function restartAdventure() {
  playerAdventureScore = 0;
  adventureRecap.length = 0;
  choiceHistory.length = 0;
  playerInventory = [];
  unlockedAchievements.clear();
  Object.keys(achievements).forEach(
    (id) => (achievements[id].unlocked = false)
  );
  storyTextElement.innerHTML = "";
  choicesContainerElement.innerHTML = "";
  startAdventure();
}

function stopStory() {
  clearStoryQueue();
  choicesContainerElement.innerHTML = "";
  backgroundMusicElement.pause();
  toggleNavControls(false);
  navbarRestartBtn.classList.remove("disabled");
  if (storyTextElement) {
    storyTextElement.innerHTML =
      "<p>Story paused! Click RESTART to begin a new adventure.</p>";
    const pauseImage = document.createElement("img");
    pauseImage.src =
      "https://media.tenor.com/sWkHnUiRJvIAAAAC/reading-read.gif";
    pauseImage.alt = "Paused";
    pauseImage.className = "stop-gif";
    storyTextElement.appendChild(pauseImage);
  }
}

function updateHeader(settingName) {
  const headerElement = mainContainerElement?.querySelector("h1");
  if (headerElement)
    headerElement.innerHTML = `<i class="fas fa-book-open"></i> ${settingName.toUpperCase()} <i class="fas fa-star"></i>`;
}

function selectRandomSetting() {
  const availableSettings = Object.keys(storyData);
  return availableSettings[
    Math.floor(Math.random() * availableSettings.length)
  ];
}

function processPlayerInput() {
  const inputText = playerInputElement?.value.trim().toLowerCase();
  if (!inputText) return;

  if (activePuzzle.isTextInput) {
    activePuzzle.playerInput = [inputText];
    playerInputElement.value = "";
    checkPuzzleAnswer();
    return;
  }

  playerInputElement.value = "";
  if (inputText === "stop") {
    stopStory();
    return;
  }
  if (inputText === "hint") {
    addToStoryQueue(
      "Hint: There are no wrong answers! Explore different paths on your next playthrough to see everything."
    );
    processStoryQueue();
    return;
  }
  addToStoryQueue(
    `You typed "${inputText}". While the world is vast, your path forward lies in the choices before you.`
  );
  processStoryQueue();
}

function hideInputField() {
  inputContainerElement?.classList.add("hidden");
}

/* --- EVENT LISTENERS --- */
startButton?.addEventListener("click", startAdventure);
submitButton?.addEventListener("click", processPlayerInput);
playerInputElement?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") processPlayerInput();
});

// Navbar Listeners
navbarRestartBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  restartAdventure();
});
navbarStopBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  stopStory();
});
musicToggleButton?.addEventListener("click", toggleMusic);
soundToggleButton?.addEventListener("click", toggleSound);
volumeSlider?.addEventListener("input", (e) => {
  setVolume(e.target.value);
});
navbarDashboardBtn?.addEventListener("click", updateLeaderboard);

// Connect the hint button
puzzleHintButton?.addEventListener("click", showHint);

// Event listener for the player detail modal
playerDetailModalElement?.addEventListener("show.bs.modal", function (event) {
  const button = event.relatedTarget; // The table row that was clicked

  // Extract info from data-* attributes
  const name = button.getAttribute("data-player-name");
  const rank = button.getAttribute("data-player-rank");
  const achievements = button
    .getAttribute("data-player-achievements")
    .split(",");
  const items = button.getAttribute("data-player-items").split(",");

  // Update the modal's content
  detailPlayerName.textContent = name;
  detailPlayerRank.textContent = `Rank: ${rank}`;

  detailAchievementsList.innerHTML = "";
  if (achievements[0] !== "") {
    achievements.forEach((ach) => {
      const li = document.createElement("li");
      li.textContent = ach;
      detailAchievementsList.appendChild(li);
    });
  } else {
    detailAchievementsList.innerHTML = "<li>None yet!</li>";
  }

  detailItemsList.innerHTML = "";
  if (items[0] !== "") {
    items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      detailItemsList.appendChild(li);
    });
  } else {
    detailItemsList.innerHTML = "<li>None yet!</li>";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  playerNameInputElement?.focus();
  preloadSounds();
  setVolume(0.5);
});
