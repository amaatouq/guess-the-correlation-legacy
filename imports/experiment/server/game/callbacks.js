export const onGameStart = (game, players) => {};

export const onRoundStart = (game, round, players) => {
  //TODO: temporary fix for storing network evolution
  // The network should be at the player.round level
  // (i.e., so we can know the structure of the network at each round and track how it changed).
  // A simple fix of doing an extra set at the start of the round
  // This might change once we have the ''network'' object in later versions.
  players.forEach(player => {
    player.round.set("alterIds", player.get("alterIds"));
  });
};

export const onStageStart = (game, round, stage, players) => {};

export const onStageEnd = (game, round, stage, players) => {
  if (stage.name === "response") {
    computeScore(players, round);
  } else if (stage.name === "interactive") {
    //after the 'interactive' stage, we compute the score and color it
    computeScore(players, round);
    colorScores(players);
  } else {
    //nothing to do when it is 'outcome' stage
    return;
  }
};

export const onRoundEnd = (game, round, players) => {
  //update the cumulative Score for everyone after the round
  players.forEach(player => {
    const currentScore = player.get("cumulativeScore");
    const roundScore = player.round.get("score");
    player.set("cumulativeScore", Math.round(currentScore + roundScore));
  });

  //checking whether the game contains shock and whether it is time for it!
  //currentRoundNumber % nRounds/shockRate * nRounds => whether it is time!
  const shockTime =
    game.treatment.shockRate > 0 &&
    (round.index + 1) %
      Math.round(
        game.treatment.nRounds /
          (game.treatment.shockRate * game.treatment.nRounds)
      ) ===
      0;
  //if it is time for a shock to arrive, then shock the players
  // i.e., change the difficulty of the task for them.
  shockTime ? shock(players) : null;
};

export const onGameEnd = (game, players) => {};


// These are just some helper functions for the Guess the Correlation Game
// compute score.
function computeScore(players, round) {
  const correctAnswer = round.get("task").correctAnswer;
  
  players.forEach(player => {
    const guess = player.round.get("guess");
    // If no guess given, score is 0
    const score = !guess
      ? 0
      : Math.round((1 - Math.abs(correctAnswer - guess)) * 100);
    
    player.round.set("score", score);
  });
}

// We sort the players based on their score in this round in order to color code
// how we display their scores.
// The highest 1/3 players are green, the lowest 1/3 are red, and the rest are orange.
function colorScores(players) {
  const sortedPlayers = players.sort(compareScores);
  const top3rd = Math.floor(players.length / 3);
  const bottom3rd = Math.floor(players.length - players.length / 3);
  
  sortedPlayers.forEach((player, i) => {
    if (i < top3rd) {
      player.round.set("scoreColor", "green");
    } else if (i >= bottom3rd) {
      player.round.set("scoreColor", "red");
    } else {
      player.round.set("scoreColor", "orange");
    }
  });
}

// Helper function to sort players objects based on their score in the current round.
function compareScores(firstPlayer, secondPlayer) {
  const scoreA = firstPlayer.round.get("score");
  const scoreB = secondPlayer.round.get("score");
  
  let comparison = 0;
  if (scoreA > scoreB) {
    comparison = -1;
  } else if (scoreA < scoreB) {
    comparison = 1;
  }
  return comparison;
}

// Shocking the players by changing the difficulty of the problem that they see
// -1 permutation: easy => hard; medium => easy; hard => medium.
function shock(players) {
  console.log("time for shock");
  players.forEach(player => {
    const currentDifficulty = player.get("difficulty");
    if (currentDifficulty === "easy") {
      player.set("difficulty", "hard");
    } else if (currentDifficulty === "medium") {
      player.set("difficulty", "easy");
    } else {
      player.set("difficulty", "medium");
    }
  });
}
