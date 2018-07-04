export default {
  onGameStart(game, players) {},
  
  onRoundStart(game, round, players) {
    players.forEach(player => {
      player.round.set("alterIds", player.get("alterIds"));
    });
  
    const feedbackTime =
      game.treatment.feedbackRate > 0 &&
      (round.index + 1) %
      Math.round(
        game.treatment.nRounds /
        (game.treatment.feedbackRate * game.treatment.nRounds)
      ) ===
      0;
    round.set("displayFeedback",feedbackTime);
  },
  
  onStageStart(game, round, stage, players) {},
  
  onStageEnd(game, round, stage, players) {
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
  },
  
  onRoundEnd(game, round, players) {
    players.forEach(player => {
      const currentScore = player.get("cumulativeScore");
      const roundScore = player.round.get("score");
      player.set("cumulativeScore", Math.round(currentScore + roundScore));
    });
  },
  
  onGameEnd(game, players) {
    console.log("The game", game._id, "has ended");
    const conversionRate = 1 / 5;
    players.forEach(player => {
      const bonus = Math.round(player.get("cumulativeScore") * conversionRate);
      player.set("bonus", bonus);
    });
  }
  
  // ===========================================================================
  // => onSet, onAppend and onChanged ==========================================
  // ===========================================================================
  
  // onSet, onAppend and onChanged are called on every single update made by all
  // players in each game, so they can rapidly become quite expensive and have
  // the potential to slow down the app. Use wisely.
  // It is very useful to be able to react to each update a user makes. Try
  // nontheless to limit the amount of computations and database saves (.set)
  // done in this callback. You can also try to limit the amount of calls to
  // set() and append() you make (avoid calling them on a continuous drag of a
  // slider for example) and inside the callbacks use the `key` argument at the
  // very beginning of the callback to filter out which keys your need to run
  // logic against.
  // If you have not using these callbacks, comment them out so the system does
  // not call them for nothing.
  
  // // onSet is called when the experiment code call the .set() method
  // // on games, rounds, stages, players, playerRounds or playerStages.
  // onSet(
  //   game,
  //   round,
  //   stage,
  //   players,
  //   player, // Player who made the change
  //   target, // Object on which the change was made (eg. player.set() => player)
  //   targetType, // Type of object on which the change was made (eg. player.set() => "player")
  //   key, // Key of changed value (e.g. player.set("score", 1) => "score")
  //   value, // New value
  //   prevValue // Previous value
  // ) {
  //   // // Example filtering
  //   // if (key !== "value") {
  //   //   return;
  //   // }
  // },
  
  // // onSet is called when the experiment code call the `.append()` method
  // // on games, rounds, stages, players, playerRounds or playerStages.
  // onAppend(
  //   game,
  //   round,
  //   stage,
  //   players,
  //   player, // Player who made the change
  //   target, // Object on which the change was made (eg. player.set() => player)
  //   targetType, // Type of object on which the change was made (eg. player.set() => "player")
  //   key, // Key of changed value (e.g. player.set("score", 1) => "score")
  //   value, // New value
  //   prevValue // Previous value
  // ) {
  //   // Note: `value` is the single last value (e.g 0.2), while `prevValue` will
  //   //       be an array of the previsous valued (e.g. [0.3, 0.4, 0.65]).
  // },
  
  // onChange is called when the experiment code call the `.set()` or the
  // `.append()` method on games, rounds, stages, players, playerRounds or
  // playerStages.
  // onChange(
  //   game,
  //   round,
  //   stage,
  //   players,
  //   player, // Player who made the change
  //   target, // Object on which the change was made (eg. player.set() => player)
  //   targetType, // Type of object on which the change was made (eg. player.set() => "player")
  //   key, // Key of changed value (e.g. player.set("score", 1) => "score")
  //   value, // New value
  //   prevValue, // Previous value
  //   isAppend // True if the change was an append, false if it was a set
  // ) {
  //   // `onChange` is useful to run server-side logic for any user interaction.
  //   // Note the extra isAppend boolean that will allow to differenciate sets and
  //   // appends.
  // }
};

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
