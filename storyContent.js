/**
 * storyContent.js
 * FINAL CORRECTED VERSION
 *
 */

/**
 * Concludes the player's adventure.
 * This function is called when the player reaches a designated end point in any of the story settings.
 * It calculates a final message based on achievements, displays the player's score, and shows a recap of their key decisions.
 */
function endStory() {
  // Play a winning sound effect to signify completion.
  playSound("win");
  // Add the initial concluding narrative to the story queue.
  addToStoryQueue(
    `...and with a final, blinding flash of light, the world around you solidifies. The scent of pine and damp earth fills your lungs. You're back in the forest where you started, the mysterious glow now gone.`
  );

  // A default final thought for the player.
  let finalThought = "It was a legendary trip, one you'll never forget!";
  // Check for specific major achievements and overwrite the final thought with a more personalized message.
  if (unlockedAchievements.has("potionMaster")) {
    finalThought =
      "The Potion of Might you brewed still feels warm in your pack, a reminder of the magic you mastered in the medieval Guild.";
  } else if (unlockedAchievements.has("dragonRider")) {
    finalThought =
      "You can still feel the wind in your hair from your flight on the dragon, a bond of respect forged in the endless sky.";
  } else if (unlockedAchievements.has("powerRestored")) {
    finalThought =
      "The quiet hum of the portal you powered echoes in your memory, a symbol of a futuristic rebellion you aided.";
  }
  // Add the personalized or default final thought to the queue.
  addToStoryQueue(finalThought);

  // Add a congratulatory message, including the player's name and the setting they just completed.
  addToStoryQueue(
    `Congratulations, ${playerName}! You've conquered your adventure! Your journey through ${currentSetting} was epic—ready for another? Hit RESTART!`
  );
  // Create and add a formatted "Adventure Report" to the queue.
  addToStoryQueue(`
  ====================
   ADVENTURE REPORT
  ====================
  Your Final Score: ${playerAdventureScore}

  A journey to remember. Great work, ${playerName}!`);
  // Add a header for the key moments recap.
  addToStoryQueue("--- Key Moments ---");
  // Iterate over the adventureRecap array and add each recorded moment to the story queue.
  adventureRecap.forEach((detail, index) =>
    addToStoryQueue(`${index + 1}. ${detail}`)
  );
  // Process the entire story queue to display the concluding messages on the screen.
  processStoryQueue();
}

// ========================================
// MEDIEVAL VILLAGE
// ========================================

/**
 * The starting point for the Medieval Village adventure.
 * Called when the player chooses this setting.
 * @param {string} choice - The player's initial choice ("rest" or "explore").
 */
function startMedievalVillage(choice) {
  // Check the player's initial choice and update score, recap, and story text accordingly.
  if (choice === "rest") {
    // Add points for a cautious approach.
    playerAdventureScore += 5;
    // Record this choice in the adventure recap.
    adventureRecap.push("Chose a peaceful pause (+5 pts)");
    // Add descriptive text for resting.
    addToStoryQueue(
      `You take a moment, resting on a rustic bench. The warm sun feels good on your face as the village square bustles around you—the smell of fresh bread from a bakery, the clang of a distant blacksmith, the laughter of children chasing a goose.`
    );
  } else {
    // Add more points for an eager approach.
    playerAdventureScore += 10;
    // Record this choice in the adventure recap.
    adventureRecap.push("Eagerly embraced the adventure (+10 pts)");
    // Add descriptive text for exploring immediately.
    addToStoryQueue(
      `You dive right into the village's heart. The cobblestone paths, polished by centuries of footsteps, guide you through a lively scene. A bard strums a lute, merchants hawk wares from colorful stalls, and the very air seems to crackle with a faint, unseen magic.`
    );
  }
  // Update the player's score on the display.
  updateStatusPanel();
  // Present the first major location choice to the player.
  addToStoryQueue(
    `Your eyes are drawn to three distinct buildings: the cheerful clamor of the Inn, the silent, imposing Guild hall, and the glittering banners of the Palace.`,
    ["Inn", "Guild", "Palace"], // The available choices.
    medievalLocationChoice // The function to handle the player's choice.
  );
}

/**
 * Handles the player's choice of location within the medieval village.
 * @param {string} choice - The location the player chose ("inn", "guild", or "palace").
 */
function medievalLocationChoice(choice) {
  // Directs the story based on the player's decision.
  if (choice === "inn") {
    // If the player chose the Inn, queue the story text and a button to enter.
    addToStoryQueue(
      `You decide the friendly noise of the inn is the most welcoming sight. You head towards its heavy oak door.`,
      ["Enter the Inn"],
      medievalInn // The next function in this story branch.
    );
  } else if (choice === "guild") {
    // If the player chose the Guild, queue the corresponding text and button.
    addToStoryQueue(
      `You're drawn to the mysterious, silent Guild hall, a place that promises knowledge and power. You approach its shadowy entrance.`,
      ["Enter the Guild"],
      medievalGuild // The next function in this story branch.
    );
  } else {
    // If the player chose the Palace, queue that narrative.
    addToStoryQueue(
      `The lure of royalty and riches is too strong to ignore. You make your way towards the grand, sun-drenched gates of the palace.`,
      ["Approach the Palace"],
      medievalPalace // The next function in this story branch.
    );
  }
}

/**
 * The player enters the 'Dragon's Flagon' inn.
 * Presents a choice to engage with the innkeeper's riddle.
 */
function medievalInn() {
  // Award points for visiting the inn.
  playerAdventureScore += 10;
  updateStatusPanel();
  // Record the visit.
  adventureRecap.push("Entered the cozy inn (+10 pts)");
  // Set the scene and present a choice.
  addToStoryQueue(
    `The scent of roasting boar and woodsmoke greets you as you push open the heavy oak door of 'The Dragon's Flagon' inn. The innkeeper, a man with a booming laugh and a kind face, leans over the counter. "A new face! Welcome! You look like one for games. Solve a riddle for me, and the first drink is on the house."`,
    ["Accept the challenge", "No thanks, just a room"],
    innChoice1 // Function to handle the choice.
  );
}

/**
 * Handles the player's response to the innkeeper's riddle challenge.
 * @param {string} choice - The player's decision ("acceptthechallenge" or "nothanksjustaroom").
 */
function innChoice1(choice) {
  // If the player accepts the challenge...
  if (choice === "acceptthechallenge") {
    // Present the riddle and trigger the puzzle interface.
    addToStoryQueue(
      `"Excellent!" he bellows. "Listen closely... I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?"`,
      [], // No choices, as the puzzle interface will handle input.
      () => {
        // Show the specific puzzle UI, linking it to success and failure functions.
        showPuzzle("medievalRiddlePuzzle", innRiddleSuccess, innRiddleFailure);
      }
    );
  } else {
    // If the player declines, provide alternative story progression.
    addToStoryQueue(
      `"A pity!" the innkeeper says. "Another time, perhaps." You get a room for the night, resting peacefully but learning no secrets. The next morning, you feel compelled to visit the Guild.`,
      ["To the Guild!"],
      medievalGuild // Guide the player to another location.
    );
  }
}

/**
 * Callback function for successfully solving the innkeeper's riddle.
 */
function innRiddleSuccess() {
  // Award points and an achievement for solving the puzzle.
  playerAdventureScore += 25;
  updateStatusPanel();
  unlockAchievement("riddleSolver");
  adventureRecap.push("Outsmarted the innkeeper (+25 pts)");
  // Give the player story text, a reward, and a narrative push to the next location.
  addToStoryQueue(
    `"A map!" you declare. The innkeeper's jaw drops, then he erupts in laughter. "By the stars, a sharp mind! I like that. A drink for you, and a secret: a wizard at the Guild left this key. He said it could 'unlock the truth'."`
  );
  // Add the key to the player's inventory.
  addItemToInventory("Wizard's Key");
  // Guide the player to the Guild.
  addToStoryQueue(
    `With the key in hand, the Guild seems like your most promising destination.`,
    ["To the Guild!"],
    medievalGuild
  );
  // Ensure the story text queued above is displayed immediately.
  processStoryQueue();
}

/**
 * Callback function for failing the innkeeper's riddle.
 */
function innRiddleFailure() {
  // Penalize points for failure.
  playerAdventureScore -= 5;
  updateStatusPanel();
  adventureRecap.push("Was stumped by the riddle (-5 pts)");
  // Provide story text describing the failure but offer a consolation prize.
  addToStoryQueue(
    `You can't figure it out. The innkeeper chuckles. "Not the sharpest sword in the armory, eh? No matter. Have some of my famous Fiery Soup on the house." He hands you a bowl.`
  );
  // This "consolation prize" also gives points and an achievement.
  playerAdventureScore += 10;
  updateStatusPanel();
  unlockAchievement("fieryBelly");
  // Continue the story, pushing the player toward the next logical location.
  addToStoryQueue(
    `The soup is spicy! You burp a small flame! The inn cheers, and a man points you toward the Guild, saying you have the 'fire of a mage'.`,
    ["To the Guild!"],
    medievalGuild
  );
  // Ensure the story text queued above is displayed immediately.
  processStoryQueue();
}

/**
 * The player enters the Guild hall.
 * This function presents the choice between two magical disciplines.
 */
function medievalGuild() {
  // Play a magic sound for atmosphere.
  playSound("magic");
  // Award points and record the visit.
  playerAdventureScore += 15;
  updateStatusPanel();
  adventureRecap.push("Explored the mysterious guild (+15 pts)");
  // Describe the scene and present a choice to the player.
  addToStoryQueue(
    `You enter the guild hall. The air hums with power, making your hair stand on end. An old wizard with a long, star-spangled robe, surrounded by floating books, looks up. "New blood! Excellent. We need an apprentice. Which discipline calls to you: the subtle art of Alchemy or the raw power of Spellcraft?"`,
    ["Alchemy", "Spellcraft"],
    guildChoice1 // Function to handle the choice.
  );
}

/**
 * Handles the player's choice of discipline at the Guild.
 * @param {string} choice - The chosen discipline ("alchemy" or "spellcraft").
 */
function guildChoice1(choice) {
  // If the player chose Spellcraft, they receive a quest.
  if (choice === "spellcraft") {
    playerAdventureScore += 20;
    updateStatusPanel();
    adventureRecap.push("Took on a daring guild quest (+20 pts)");
    // This quest directs them to the Palace.
    addToStoryQueue(
      `"A student of power!" the wizard exclaims. "Then your first quest is a trial by fire. My prized wand was stolen by a palace thief! Retrieve it, and you shall be rewarded."`,
      ["To the Palace!"],
      medievalPalace
    );
  } else {
    // If the player chose Alchemy, they are given a potion recipe puzzle.
    playerAdventureScore += 15;
    updateStatusPanel();
    adventureRecap.push("Agreed to brew a potion (+15 pts)");
    addToStoryQueue(
      `"An alchemist! A noble pursuit." The wizard hands you a dusty tome. "The recipe for a Potion of Might is on this page. It reads: 'To grant a hero's might, add the liquid fire of a dragon's spite. To see in darkness deep, add the tear a silent spider weeps. To finish, add the glow of the sun, and your work is done.'"`,
      [], // No choices, puzzle UI will appear.
      () => {
        // Show the potion puzzle.
        showPuzzle(
          "medievalPotionPuzzle",
          guildPotionSuccess,
          guildPotionFailure
        );
      }
    );
  }
}

/**
 * Callback function for successfully brewing the potion.
 */
function guildPotionSuccess() {
  // Award points, a major achievement, and an item.
  playerAdventureScore += 25;
  updateStatusPanel();
  unlockAchievement("potionMaster");
  adventureRecap.push("Successfully brewed a Potion of Might! (+25 pts)");
  addItemToInventory("Potion of Might");
  // Provide success narrative and guide the player to the next location.
  addToStoryQueue(
    `The cauldron bubbles and glows a brilliant gold! "Incredible!" says the wizard. "You're a natural alchemist. Take this potion; it will grant you the strength to face any challenge. Perhaps even at the palace..."`,
    ["To the Palace"],
    medievalPalace
  );
  // Ensure story text is displayed.
  processStoryQueue();
}

/**
 * Callback function for failing to brew the potion.
 */
function guildPotionFailure() {
  // Penalize points and record the failure.
  playerAdventureScore -= 10;
  updateStatusPanel();
  adventureRecap.push("Brewed a dud potion (-10 pts)");
  // Describe the failure and send the player back to a different location.
  addToStoryQueue(
    `The cauldron sputters and releases a puff of green, foul-smelling smoke. "Wrong ingredients!" the wizard coughs. "No matter. Go clear your head at the inn. I'll clean this up."`,
    ["Back to the Inn"],
    medievalInn
  );
  // Ensure story text is displayed.
  processStoryQueue();
}

/**
 * The player arrives at the palace gates and must solve a puzzle to enter.
 */
function medievalPalace() {
  // Provide a crucial clue to the player for the upcoming puzzle.
  addToStoryQueue(
    `As you approach the palace gates, you notice two masons carving a large crest above the archway. One says to his partner, "Careful! The sun rises first, the moon guides the night, and the stars provide eternal light." This sounds important.`
  );
  // Present the challenge from the guard and trigger the puzzle UI.
  addToStoryQueue(
    `At the gate, a stoic royal guard in gleaming armor blocks your path. "Halt! Only those who know the royal crest may enter. Prove your worth."`,
    [],
    () => {
      showPuzzle(
        "medievalRunePuzzle",
        medievalPalaceSuccess,
        medievalPalaceFailure
      );
    }
  );
}

/**
 * Callback function for successfully solving the palace gate puzzle.
 */
function medievalPalaceSuccess() {
  // Award points and an achievement.
  playerAdventureScore += 25;
  updateStatusPanel();
  unlockAchievement("royalCrest");
  adventureRecap.push("Solved the Royal Guard's test (+25 pts)");
  // Describe the success and the opening of the gates.
  addToStoryQueue(
    `You trace the crest flawlessly. The guard's eyes widen in respect. "You have noble knowledge! You may enter." The grand gates swing open.`
  );
  // Introduce the princess and her quest.
  addToStoryQueue(
    `Inside the opulent throne room, a princess in a fine silk dress is pacing frantically. She rushes to you. "You passed my guard's test! Amazing! Please, I need your help, I've lost my royal crown!"`,
    ["Of course I'll help", "I don't have time"],
    palaceChoice1 // Function to handle the player's response.
  );
  // Ensure story text is displayed.
  processStoryQueue();
}

/**
 * Callback function for failing the palace gate puzzle.
 */
function medievalPalaceFailure() {
  // Penalize points and record the failure.
  playerAdventureScore -= 10;
  updateStatusPanel();
  adventureRecap.push("Failed the Royal Guard's test (-10 pts)");
  // Describe the failure.
  addToStoryQueue(
    `You fail the test. The guard scoffs, "Begone, commoner! You clearly don't belong here. Try the Guild if you seek adventure."`
  );
  // Force the player to go to the Guild instead.
  addToStoryQueue(
    `Turned away from the palace, you have no choice but to head to the Guild Hall.`,
    ["Go to the Guild"],
    medievalGuild
  );
  // Ensure story text is displayed.
  processStoryQueue();
}

/**
 * Handles the player's decision to help the princess or not.
 * @param {string} choice - The player's decision ("ofcourseillhelp" or "idonthavetime").
 */
function palaceChoice1(choice) {
  // If the player agrees to help...
  if (choice === "ofcourseillhelp") {
    playerAdventureScore += 20;
    updateStatusPanel();
    adventureRecap.push("Found the princess's crown (+20 pts)");
    // The player finds the crown and is presented with a moral choice.
    addToStoryQueue(
      `"Oh, thank you!" she exclaims. You scan the throne room, looking past the golden decorations and velvet curtains. Tucked away under the grand throne itself, you spot the glint of jewels. It's the crown!`,
      ["Return it to her", "Keep it for myself"],
      palaceChoice2 // Function to handle the moral choice.
    );
  } else {
    // If the player refuses, the princess shows them the exit, ending the adventure.
    addToStoryQueue(
      `"No time?" The princess looks crestfallen. "Fine. But know that the only way out of this realm is through that portal," she says, pointing to a shimmering gate in the throne room.`,
      ["Enter Portal"],
      endStory // This path ends the story.
    );
  }
}

/**
 * Handles the player's moral choice regarding the crown.
 * @param {string} choice - The player's decision ("returnittoher" or "keepitformyself").
 */
function palaceChoice2(choice) {
  // If the player makes the noble choice...
  if (choice === "returnittoher") {
    playerAdventureScore += 15;
    updateStatusPanel();
    unlockAchievement("keymaster");
    adventureRecap.push("Returned the crown (+15 pts)");
    // The player is rewarded with a key and a safe way home.
    addToStoryQueue(
      `She beams as you hand her the crown. "My hero! As a reward, take this key. It is said it can open any door, even the one back home!"`
    );
    addItemToInventory("Magic Starry Key");
    addToStoryQueue(
      `As you take the key, a shimmering portal appears before you. "Your way home," she says with a grateful smile.`,
      ["Enter Portal"],
      endStory // This path ends the story.
    );
  } else {
    // If the player makes the selfish choice...
    playerAdventureScore += 5;
    updateStatusPanel();
    adventureRecap.push("Kept a cursed crown (+5 pts)");
    // The crown is cursed, leading to a dramatic but less rewarding ending.
    addToStoryQueue(
      `As your fingers touch the crown, it pulses with a dark, cold energy. The jewels glow menacingly, and a terrifying, jagged portal rips open in the air. The princess shrieks!`,
      ["Leap Through"],
      endStory // This path also ends the story.
    );
  }
}

// ========================================
// SKY ISLANDS
// ========================================

/**
 * The starting point for the Sky Islands adventure.
 * @param {string} choice - The player's initial choice ("rest" or "explore").
 */
function startSkyIslands(choice) {
  // Handle the initial choice, similar to the medieval start.
  if (choice === "rest") {
    playerAdventureScore += 5;
    adventureRecap.push("Rested on the sky island (+5 pts)");
    addToStoryQueue(
      `You sit on the island's edge, watching clouds drift by like fluffy ships on a sea of blue. The air is crisp and clean.`
    );
  } else {
    playerAdventureScore += 10;
    adventureRecap.push("Embraced the sky's mysteries (+10 pts)");
    addToStoryQueue(
      `You explore this strange new realm! The very ground beneath your feet hums with a gentle energy, and smaller stone chunks drift lazily around the main island.`
    );
  }
  updateStatusPanel();
  // Present the main locations in this world.
  addToStoryQueue(
    `Ahead, you see three distinct areas: a Lake whose water ripples upwards, a Forest of glowing flora, and a smoky Dragon's peak.`,
    ["Lake", "Forest", "Dragon"],
    skyLocationChoice // Function to handle the location choice.
  );
}

/**
 * Handles the player's choice of location in the Sky Islands.
 * @param {string} choice - The location chosen ("lake", "forest", or "dragon").
 */
function skyLocationChoice(choice) {
  // Route the player to the appropriate function based on their choice.
  if (choice === "lake") {
    skyLake();
  } else if (choice === "forest") {
    skyForest();
  } else {
    skyDragon();
  }
}

/**
 * The player visits the Sky Lake.
 * This area contains the "Whispering Stones" music puzzle.
 */
function skyLake() {
  // Award points and record the visit.
  playerAdventureScore += 10;
  updateStatusPanel();
  adventureRecap.push("Visited the sky lake (+10 pts)");
  // Play a sound for atmosphere.
  playSound("splash");
  // Set the scene.
  addToStoryQueue(
    `You approach the lake, its water shimmering with an inner light. In the center of the lake, several tall, smooth stones stand in a circle.`
  );
  // Introduce the puzzle and give clues, then present a choice.
  addToStoryQueue(
    `A wise-looking turtle with a mossy shell paddles near. "Greetings, traveler," it says in a slow, deep voice. "The Whispering Stones hold an ancient melody. If you can repeat their song, they may show you a secret. The song is the sound of nature: Music from a bird, the chime of a Bell, then the crackle of a lightning Bolt."`,
    ["Listen to the Stones", "Explore elsewhere"],
    lakeChoice1 // Function to handle the choice.
  );
}

/**
 * Handles the player's choice at the Sky Lake.
 * @param {string} choice - Player's decision ("listentothestones" or "exploreelsewhere").
 */
function lakeChoice1(choice) {
  // If player chooses to engage with the puzzle...
  if (choice === "listentothestones") {
    // Show the music puzzle UI.
    showPuzzle("skyMusicPuzzle", lakePuzzleSuccess, lakePuzzleFailure);
  } else {
    // If they decline, guide them to another location.
    addToStoryQueue(
      `You decide to leave the stones for now, your eyes drawn to the mysterious, glowing forest.`,
      ["To the Forest"],
      skyForest
    );
  }
}

/**
 * Callback function for successfully solving the music puzzle at the lake.
 */
function lakePuzzleSuccess() {
  // Award points and an achievement.
  playerAdventureScore += 25;
  updateStatusPanel();
  unlockAchievement("stoneListener");
  adventureRecap.push("Solved the Whispering Stones puzzle! (+25 pts)");
  // Describe the success and how it opens a path to the Dragon's peak.
  addToStoryQueue(
    `The stones glow brightly, and a path of solid light forms in the air, leading directly to the dragon's peak. "The way is open," says the turtle.`,
    ["Cross the Light Bridge"],
    skyDragon
  );
  // Ensure story text displays.
  processStoryQueue();
}

/**
 * Callback function for failing the music puzzle at the lake.
 */
function lakePuzzleFailure() {
  // Penalize points and record the failure.
  playerAdventureScore -= 10;
  updateStatusPanel();
  adventureRecap.push("Failed the stone's melody (-10 pts)");
  // Describe the failure and guide the player to another area to try a different puzzle.
  addToStoryQueue(
    `The stones fall silent. The turtle sighs. "Your mind is not in harmony today. Perhaps the tranquil forest can calm your spirit."`,
    ["Go to the Forest"],
    skyForest
  );
  // Ensure story text displays.
  processStoryQueue();
}

/**
 * The player enters the glowing Sky Forest.
 * This area contains a memory match puzzle.
 */
function skyForest() {
  // Award points and record the visit.
  playerAdventureScore += 15;
  updateStatusPanel();
  adventureRecap.push("Explored the glowing forest (+15 pts)");
  // Set the scene.
  addToStoryQueue(
    `You step into a forest bathed in an ethereal green glow. The trees pulse with soft light, and the moss underfoot feels like velvet. It's a place of quiet magic.`
  );
  // Introduce the memory puzzle challenge.
  addToStoryQueue(
    `An ancient-looking tree seems to whisper to you, its leaves rustling. It challenges you to a game of memory, to prove you are observant enough to walk its paths.`,
    ["Accept the challenge", "Search for another way"],
    forestChoice1 // Function to handle the choice.
  );
}

/**
 * Handles the player's choice within the Sky Forest.
 * @param {string} choice - The player's decision ("acceptthechallenge" or "searchforanotherway").
 */
function forestChoice1(choice) {
  // If the player accepts...
  if (choice === "acceptthechallenge") {
    // Provide a clue and then show the memory puzzle.
    addToStoryQueue(
      `The tree's leaves shimmer, showing you the symbols for a moment: Leaf, Feather, Sun, and Moon. "Match the pairs," it whispers.`
    );
    showPuzzle("skyMemoryPuzzle", forestMemorySuccess, forestMemoryFailure);
  } else {
    // If the player declines, give them an alternative path forward.
    addToStoryQueue(
      `You ignore the tree's challenge and find a tattered star chart on the ground. It shows a constellation of a serpent, with its stars clearly numbered from head (1) to tail (4). It seems to point toward the dragon's peak.`,
      ["Follow the chart"],
      skyDragon
    );
  }
}

/**
 * Callback function for successfully completing the forest memory puzzle.
 */
function forestMemorySuccess() {
  // Award points, an achievement, and an item.
  playerAdventureScore += 25;
  updateStatusPanel();
  unlockAchievement("forestMemory");
  adventureRecap.push("Passed the Forest's memory test! (+25 pts)");
  // Describe the success and the new path it reveals.
  addToStoryQueue(
    `The tree's whisper turns into a warm, approving hum. "Your mind is sharp. You have earned my guidance." A hidden path illuminates, leading upwards toward the dragon's peak.`
  );
  // Give the player a symbolic item.
  addItemToInventory("Forest Blessing");
  // Guide the player to the next location.
  addToStoryQueue(
    `You feel a sense of peace and clarity as you take the newly revealed path.`,
    ["Ascend the Path"],
    skyDragon
  );
  // Ensure story text displays.
  processStoryQueue();
}

/**
 * Callback function for failing the forest memory puzzle.
 */
function forestMemoryFailure() {
  // Penalize points and record the failure.
  playerAdventureScore -= 10;
  updateStatusPanel();
  adventureRecap.push("Failed the memory game (-10 pts)");
  // Describe the failure and send the player back to a different area.
  addToStoryQueue(
    `The symbols fade, unmatched. The tree's whisper fades. "You are not yet focused enough for this place." The path forward becomes overgrown and confusing, forcing you back toward the lake.`,
    ["Return to the Lake"],
    skyLake
  );
  // Ensure story text displays.
  processStoryQueue();
}

/**
 * The player arrives at the Dragon's peak, the final location in this world.
 * This area contains the constellation puzzle.
 */
function skyDragon() {
  // Award points and record the visit.
  playerAdventureScore += 20;
  updateStatusPanel();
  adventureRecap.push("Faced the dragon's peak (+20 pts)");
  // Play a sound for atmosphere.
  playSound("roar");
  // Set the scene and introduce the final puzzle.
  addToStoryQueue(
    `You arrive at a misty peak. A magnificent, crystal-scaled dragon regards you with ancient eyes. "A mortal visitor. To ride upon my back, you must first prove your mind is as sharp as my claws. You have either found my star chart or earned passage here. Now show me you understand the heavens."`,
    ["I am ready"],
    () => {
      // Show the constellation puzzle.
      showPuzzle("skyConstellationPuzzle", skyDragonSuccess, skyDragonFailure);
    }
  );
}

/**
 * Callback function for successfully solving the dragon's constellation puzzle.
 */
function skyDragonSuccess() {
  // Award points and an achievement.
  playerAdventureScore += 25;
  updateStatusPanel();
  unlockAchievement("celestialMapper");
  adventureRecap.push("Proved your wisdom to the dragon (+25 pts)");
  // Describe the success and the dragon's approval.
  addToStoryQueue(
    `The stars shimmer. The dragon rumbles, "You see the patterns of the universe. Wise indeed. You are worthy." It lowers its great head, offering you a place upon its back.`,
    ["Climb Aboard"],
    dragonRideHome // Lead to the adventure's conclusion.
  );
  // Ensure story text displays.
  processStoryQueue();
}

/**
 * Callback function for failing the dragon's constellation puzzle.
 */
function skyDragonFailure() {
  // Penalize points and record the failure.
  playerAdventureScore -= 10;
  updateStatusPanel();
  adventureRecap.push("Failed the dragon's celestial test (-10 pts)");
  // Describe the failure and send the player back to the lake to try a different path.
  addToStoryQueue(
    `The stars fade. "Your mind is clouded," the dragon rumbles. "The sky rejects you. Perhaps you will have better luck by the strange, rippling lake below."`,
    ["Return to the Lake"],
    skyLake
  );
  // Ensure story text displays.
  processStoryQueue();
}

/**
 * The concluding function for the Sky Islands adventure path.
 * The player successfully rides the dragon home.
 */
function dragonRideHome() {
  // Award a large number of points and a major achievement for this epic ending.
  playerAdventureScore += 25;
  updateStatusPanel();
  unlockAchievement("dragonRider");
  adventureRecap.push("Flew home on a dragon! (+25 pts)");
  // Describe the ride home.
  addToStoryQueue(
    `You climb onto the dragon's back. It leaps into the air, soaring through a rainbow-hued portal. You land gently back in the forest where you started.`,
    ["Finish Adventure"],
    endStory // Call the main endStory function.
  );
}

// ========================================
// FUTURISTIC CITY
// ========================================

/**
 * The starting point for the Futuristic City adventure.
 * @param {string} choice - Player's initial choice ("lookaround" or "explore").
 */
function startFuturisticCity(choice) {
  // Handle the player's initial choice.
  if (choice === "lookaround") {
    playerAdventureScore += 5;
    adventureRecap.push("Observed the city first (+5 pts)");
    addToStoryQueue(
      `You take a moment to absorb the dazzling sights. A small sanitation bot whistles as it zips past, reminding you this is a living, breathing city.`
    );
  } else {
    playerAdventureScore += 10;
    adventureRecap.push("Arrived in the neon city (+10 pts)");
    addToStoryQueue(
      `You materialize on a walkway of light. Gleaming towers pierce the clouds, and vehicles hum through the air.`
    );
  }
  updateStatusPanel();
  // Present the primary locations in this world.
  addToStoryQueue(
    `The city pulses with opportunity. You see a sleek robotic Cafe, a bustling maglev Train Station, and a discreet hatch leading to an underground Bunker.`,
    ["Cafe", "Train Station", "Bunker"],
    cityLocationChoice // Function to handle the location choice.
  );
}

/**
 * Handles the player's choice of location in the Futuristic City.
 * @param {string} choice - The location chosen ("cafe", "trainstation", or "bunker").
 */
function cityLocationChoice(choice) {
  // Route the player based on their decision.
  if (choice === "cafe") {
    cityCafe();
  } else if (choice === "trainstation") {
    cityTrainStation();
  } else {
    cityBunker();
  }
}

/**
 * The player enters the robotic Cafe.
 */
function cityCafe() {
  // Award points and record the visit.
  playerAdventureScore += 10;
  updateStatusPanel();
  adventureRecap.push("Visited the robot cafe (+10 pts)");
  // Play a sound for atmosphere.
  playSound("beep");
  // Set the scene and present a choice.
  addToStoryQueue(
    `The cafe is sterile and efficient, run entirely by robots. A barista bot with a single glowing eye glides over. "Query: Sustenance or Information?"`,
    ["Sustenance", "Information"],
    cafeChoice1 // Function to handle the choice.
  );
}

/**
 * Handles the player's choice at the cafe (food or info).
 * @param {string} choice - The player's decision ("sustenance" or "information").
 */
function cafeChoice1(choice) {
  // If the player chooses sustenance...
  if (choice === "sustenance") {
    // Present a menu of futuristic foods.
    addToStoryQueue(
      `The bot displays a holographic menu. "My nutritional offerings include the 'Synth-Burger Deluxe', the 'Nutri-Paste 5000', and the 'Chromatic Fizz' energy drink."`,
      ["Order the Burger", "Try the Paste", "Get the Fizz"],
      cafeChoice2 // Function to handle the food choice.
    );
  } else {
    // If the player chooses information, they get a key item and a new objective.
    playerAdventureScore += 15;
    updateStatusPanel();
    unlockAchievement("dataHound");
    adventureRecap.push("Acquired information (+15 pts)");
    addToStoryQueue(
      `The robot's eye flashes. "The portal home requires a high-energy source. The Resistance in the bunker has one. Take this data chip with their location."`
    );
    // Add the item to inventory.
    addItemToInventory("Encrypted Data Chip");
    // Guide the player to the next location.
    addToStoryQueue(`You now know where to go.`, ["Go to Bunker"], cityBunker);
  }
}

/**
 * Handles the player's choice of food at the cafe.
 * @param {string} choice - The specific food item chosen.
 */
function cafeChoice2(choice) {
  // Award minor points for trying the food.
  playerAdventureScore += 5;
  updateStatusPanel();
  adventureRecap.push("Sampled futuristic cuisine (+5 pts)");
  let foodDescription = "";
  // Set the description based on the choice.
  if (choice === "ordertheburger") {
    foodDescription =
      "The Synth-Burger tastes surprisingly like real beef, but with a strange, static-like aftertaste.";
  } else if (choice === "trythepaste") {
    foodDescription =
      "The Nutri-Paste is a bland, grey goo that provides every nutrient you need. It's efficient, but joyless.";
  } else {
    // getthefizz
    foodDescription =
      "The Chromatic Fizz bubbles with light and tastes like popping candy and electricity. You feel incredibly awake.";
  }
  // Add the food description to the story.
  addToStoryQueue(foodDescription);
  // No matter the food, the player gets a clue leading them to the bunker.
  addToStoryQueue(
    `As you finish your 'meal', a person at a nearby table slips you a note: "They're watching. The Resistance bunker is the only safe place." They nod towards a hidden hatch across the street.`,
    ["Go to Bunker"],
    cityBunker
  );
}

/**
 * The player visits the maglev Train Station.
 * This area contains a route-plotting puzzle.
 */
function cityTrainStation() {
  // Award points and record the visit.
  playerAdventureScore += 15;
  updateStatusPanel();
  adventureRecap.push("Explored the maglev station (+15 pts)");
  // Set the scene.
  addToStoryQueue(
    `The station is a massive dome of glass and steel. High-speed maglev trains arrive and depart in silent streaks of light. A holographic schedule board flickers, displaying dozens of destinations.`
  );
  // Provide the clues for the puzzle and present a choice.
  addToStoryQueue(
    `An announcement crackles: "The express cargo freighter to the 'Central Spire' departs Platform Gamma, passes through Junction X-7, and arrives at Terminal Alpha." You realize this freighter could be your ticket to the bunker, which is said to be in the city's substructure.`,
    ["Plot the route", "Try to sneak on"],
    trainChoice1 // Function to handle the choice.
  );
}

/**
 * Handles the player's choice at the train station.
 * @param {string} choice - The player's decision ("plottheroute" or "trytosneakon").
 */
function trainChoice1(choice) {
  // If the player chooses to plot the route, show the puzzle.
  if (choice === "plottheroute") {
    showPuzzle("futuristicRoutePuzzle", trainPuzzleSuccess, trainPuzzleFailure);
  } else {
    // If they try to sneak, they fail and are sent to the cafe.
    playerAdventureScore += 5;
    updateStatusPanel();
    adventureRecap.push("Attempted to sneak on (+5 pts)");
    addToStoryQueue(
      `You try to sneak past the scanner, but a laser grid immediately activates, blocking your path. A security bot whirs towards you. "Citizen, please enjoy a complimentary beverage at the cafe while we sort out this... routing error."`,
      ["Go to Cafe"],
      cityCafe
    );
  }
}

/**
 * Callback function for successfully solving the train route puzzle.
 */
function trainPuzzleSuccess() {
  // Award points and an achievement.
  playerAdventureScore += 25;
  updateStatusPanel();
  unlockAchievement("routePlanner");
  adventureRecap.push("Plotted the correct maglev route! (+25 pts)");
  // Describe the success and guide the player to the bunker.
  addToStoryQueue(
    `The terminal chimes and displays a route to a hidden maintenance platform. You board the cargo train, and it speeds silently through a private tunnel, arriving at the Resistance bunker.`,
    ["Enter the Bunker"],
    cityBunker
  );
  // Ensure story text is displayed.
  processStoryQueue();
}

/**
 * Callback for failing the train route puzzle.
 */
function trainPuzzleFailure() {
  // Penalize points and record the failure.
  playerAdventureScore -= 10;
  updateStatusPanel();
  adventureRecap.push("Got lost in the train station (-10 pts)");
  // Describe the failure and send the player to the cafe.
  addToStoryQueue(
    `"Invalid route." The terminal flashes. You've missed your chance and drawn the attention of a security bot. "Citizen, please report to the nearest cafe for... recalibration."`,
    ["Go to Cafe"],
    cityCafe
  );
  // Ensure story text is displayed.
  processStoryQueue();
}

/**
 * The player arrives at the underground Resistance bunker, the final area.
 */
function cityBunker() {
  // Award points and an achievement for finding the place.
  playerAdventureScore += 20;
  updateStatusPanel();
  unlockAchievement("urbanExplorer");
  adventureRecap.push("Found the underground bunker (+20 pts)");
  // Set the scene.
  addToStoryQueue(
    `You find the bunker hidden beneath the city. Inside, a group of rebels huddle around a holographic map. Their leader, a woman with a cybernetic arm, turns to you.`
  );
  // Present the final two challenges required to end the adventure.
  addToStoryQueue(
    `"You found us," she says, her voice low and steady. "We can send you home, but our portal is unstable. It needs two things: a message sent to our allies, and the power conduits rerouted. Which will you handle first?"`,
    ["Send the Message", "Fix the Conduits"],
    bunkerChoice1 // Function to handle the choice of which puzzle to tackle first.
  );
}

/**
 * Handles the player's choice of which puzzle to solve first in the bunker.
 * @param {string} choice - Player's decision ("sendthemessage" or "fixtheconduits").
 */
function bunkerChoice1(choice) {
  // If the player chooses to send the message...
  if (choice === "sendthemessage") {
    // Describe the hacking puzzle and then trigger it.
    addToStoryQueue(
      `"The message terminal is locked with a sequential access code. It's a standard Tricolor Protocol, three steps. Don't mess it up."`,
      [],
      () => {
        showPuzzle(
          "futuristicHackPuzzle",
          bunkerHackSuccess,
          bunkerHackFailure
        );
      }
    );
  } else {
    // If the player chooses to fix the conduits...
    // Describe the conduit puzzle and then trigger it.
    addToStoryQueue(
      `"The main power grid is a mess," she says, leading you to a large panel on the wall. "The power must flow from the source (⚡) to the portal emitter (💡). Rotate the pipes to make a complete circuit."`,
      [],
      () => {
        showPuzzle(
          "futuristicConduitPuzzle",
          bunkerConduitSuccess,
          bunkerConduitFailure
        );
      }
    );
  }
}

/**
 * Callback for successfully hacking the terminal.
 * Success here leads directly to the second puzzle.
 */
function bunkerHackSuccess() {
  // Award a large number of points and an achievement.
  playerAdventureScore += 30;
  updateStatusPanel();
  unlockAchievement("freedomFighter");
  adventureRecap.push("Sent the Resistance message! (+30 pts)");
  // Describe the success and immediately present the conduit puzzle.
  addToStoryQueue(
    `"Message sent," the terminal chimes. The leader nods. "Good work. Now for the conduits..."`,
    ["Work on the Conduits"],
    () => {
      showPuzzle(
        "futuristicConduitPuzzle",
        bunkerConduitSuccess,
        bunkerConduitFailure
      );
    }
  );
  // Ensure story text is displayed.
  processStoryQueue();
}

/**
 * Callback for failing the hacking puzzle.
 */
function bunkerHackFailure() {
  // Penalize heavily for failure as it triggers an alarm.
  playerAdventureScore -= 15;
  updateStatusPanel();
  adventureRecap.push("Failed the hack and triggered alarms! (-15 pts)");
  // Describe the failure and force the player to flee.
  addToStoryQueue(
    `The terminal flashes red: ACCESS DENIED. ALARM PROTOCOL INITIATED. Sirens blare! "You've compromised us!" the leader yells. "Get out of here!"`,
    ["Escape to Station"],
    cityTrainStation // Send the player back to the train station.
  );
  // Ensure story text is displayed.
  processStoryQueue();
}

/**
 * Callback for successfully fixing the power conduits.
 * This is the successful end-state for the futuristic city.
 */
function bunkerConduitSuccess() {
  // Award a large number of points and the final achievement.
  playerAdventureScore += 30;
  updateStatusPanel();
  unlockAchievement("powerRestored");
  adventureRecap.push("Restored power to the portal! (+30 pts)");
  // Describe the success and the now-stable portal home.
  addToStoryQueue(
    `The conduits hum to life, and the portal in the center of the room swirls with stable, inviting energy. The leader nods, a rare smile on her face. "You did it. A deal's a deal. Go home."`,
    ["Enter Portal"],
    endStory // Call the main endStory function.
  );
  // Ensure story text is displayed.
  processStoryQueue();
}

/**
 * Callback for failing to fix the power conduits.
 */
function bunkerConduitFailure() {
  // Penalize heavily for failure.
  playerAdventureScore -= 15;
  updateStatusPanel();
  adventureRecap.push("Failed to route the power (-15 pts)");
  // Describe the failure and guide the player to a different location for another chance.
  addToStoryQueue(
    `You can't complete the circuit. A power surge fries the panel with a shower of sparks! "The main conduit is fried!" a rebel shouts. "We can't send you home now. Our only other contact is a bot at the cafe. Maybe it can help you."`,
    ["Go to the Cafe"],
    cityCafe // Send the player to the cafe.
  );
  // Ensure story text is displayed.
  processStoryQueue();
}
